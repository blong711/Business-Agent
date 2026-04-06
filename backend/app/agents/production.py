import os
import time
from typing import List, Optional
from .base import BaseSkill
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.tools import tool
import httpx
import json
from ..core.config import settings
from ..db.mongodb import mongodb

# Simple TTL Cache for order info (5 minutes)
order_cache = {}
CACHE_TTL = 300  # 5 mins

async def get_db_provider_keys() -> dict:
    """Helper để lấy API Key từ MongoDB, fallback về settings."""
    doc = await mongodb.db.system_settings.find_one({"key": "provider_keys"})
    db_keys = doc.get("value", {}) if doc else {}
    return {
        "customcat": db_keys.get("customcat_key") or settings.CUSTOMCAT_API_KEY,
        "pentifine": db_keys.get("pentifine_key") or settings.PENTIFINE_API_KEY,
        "merchize": db_keys.get("merchize_key") or settings.MERCHIZE_API_KEY
    }

@tool
async def get_efs_order_info(order_id: str) -> str:
    """Tra cứu trạng thái và thông tin chi tiết của đơn hàng trên hệ thống EFS thông qua mã đơn hàng (mã order_id, ví dụ như mã marketplace_id). Gọi hàm này khi user cung cấp mã đơn (chứa chữ và số)."""
    
    # 1. Check cache first
    now = time.time()
    if order_id in order_cache:
        cached_data, timestamp = order_cache[order_id]
        if now - timestamp < CACHE_TTL:
            return json.dumps(cached_data, ensure_ascii=False)

    # 2. Fetch from API if not cached or expired
    base_url = os.getenv("EFS_API_BASE_URL", "https://efs.expsolution.io/api/v1")
    url = f"{base_url}/orders/by-marketplace-id/{order_id}"
    token = os.getenv("EFS_API_TOKEN", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTE1NGZiMjE1ZDdmNjI2ZTExZDVlNDYiLCJlbWFpbCI6ImFkbWluQGVmcy5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3ODI3MTY3ODMsInR5cGUiOiJhY2Nlc3MifQ.sT7PUduNyih4ZuMcKz7K2guyUgtCOBus-XtU180T4FE")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "User-Agent": "AI-Business-Agent/1.0"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            raw_data = response.json()
            
            # 3. Response Pruning (Save LOTS of tokens here)
            d = raw_data.get("data", {})
            items = d.get("items", [])
            
            # Lấy print_provider từ item đầu tiên nếu ở root là null
            print_provider = d.get("print_provider")
            if not print_provider and items:
                # Thử tìm trong items[0].product.print_info.product_name
                first_item = items[0]
                product = first_item.get("product", {})
                print_info = product.get("print_info", {})
                print_provider = print_info.get("product_name")

            # Lấy reference_order_id
            reference_order_id = d.get("reference_order_id") or d.get("fulfillment_order_id")

            pruned_data = {
                "order_number": d.get("order_number"),
                "marketplace": d.get("marketplace"),
                "marketplace_order_id": d.get("marketplace_order_id"),
                "status": d.get("status"),
                "total_amount": d.get("total_amount"),
                "print_provider": print_provider,
                "reference_order_id": reference_order_id,
                "shipping_type": d.get("shipping_type"),
                "customer": {
                    "name": d.get("shipping_address", {}).get("full_name"),
                    "location": f"{d.get('shipping_address', {}).get('city')}, {d.get('shipping_address', {}).get('state')}, {d.get('shipping_address', {}).get('country')}"
                },
                "items": [
                    {
                        "title": item.get("product", {}).get("title"),
                        "variant": item.get("variant"),
                        "quantity": item.get("quantity"),
                        "print_provider_internal": item.get("product", {}).get("print_info", {}).get("product_name")
                    } for item in items
                ],
                "production": {
                    "design_status": d.get("design_approval_status"),
                    "design_completed": d.get("design_completed_at") is not None,
                    "production_status": d.get("production_started_at") is not None,
                    "production_completed": d.get("production_completed_at") is not None,
                    "sent_to_print_partner_at": d.get("sent_to_print_partner_at")
                },
                "tracking": d.get("packages", [])
            }
            
            # Store in cache
            order_cache[order_id] = (pruned_data, now)
            return json.dumps(pruned_data, ensure_ascii=False)

        except httpx.HTTPStatusError as e:
            return f"Lỗi EFS API: Không tìm thấy hoặc bị lỗi HTTP {e.response.status_code}. Chi tiết: {e.response.text}"
        except Exception as e:
            return f"Lỗi kết nối từ Hệ thống EFS nội bộ: {str(e)}"

@tool
async def get_pending_orders(status: str = "in_production", skip: int = 0) -> str:
    """Lấy danh sách đơn hàng theo trạng thái từ EFS. Các trạng thái khả dụng: pending, on_hold, in_production, shipped, in_transit, out_for_delivery, delivered, delivery_error, completed, cancelled, refunded, new, manually, has_issue. Trả về mã đơn và ngày tạo."""
    
    base_url = os.getenv("EFS_API_BASE_URL", "https://efs.expsolution.io/api/v1")
    url = f"{base_url}/orders/"
    token = os.getenv("EFS_API_TOKEN", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTE1NGZiMjE1ZDdmNjI2ZTExZDVlNDYiLCJlbWFpbCI6ImFkbWluQGVmcy5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3ODI3MTY3ODMsInR5cGUiOiJhY2Nlc3MifQ.sT7PUduNyih4ZuMcKz7K2guyUgtCOBus-XtU180T4FE")
    
    params = {
        "status": status,
        "skip": skip,
        "limit": 50 # Lấy tối đa 50 đơn gần nhất để tránh tốn quá nhiều token
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "accept": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, params=params, timeout=20)
            response.raise_for_status()
            data = response.json()
            
            orders = data.get("data", [])
            if not orders:
                return f"Hiện tại không có đơn hàng nào ở trạng thái '{status}'."
            
            # Pruning: Only relevant info for the list
            pruned_list = []
            for o in orders:
                pruned_list.append({
                    "order_number": o.get("order_number"),
                    "marketplace_id": o.get("marketplace_order_id"),
                    "created_at": o.get("created_at"),
                    "total_amount": o.get("total_amount")
                })
                
            return json.dumps({
                "total_count": data.get("total", len(pruned_list)),
                "status": status,
                "orders": pruned_list
            }, ensure_ascii=False)

        except Exception as e:
            return f"Lỗi khi lấy danh sách đơn pending: {str(e)}"

@tool
async def search_shop_info(shop_name: str) -> str:
    """Tìm kiếm thông tin về cửa hàng (shop) trên hệ thống EFS. Dùng hàm này khi user hỏi 'shop này của ai', 'shop này thuộc team nào' hoặc tìm kiếm thông tin theo tên shop."""
    
    base_url = os.getenv("EFS_API_BASE_URL", "https://efs.expsolution.io/api/v1")
    url = f"{base_url}/shops/"
    token = os.getenv("EFS_API_TOKEN", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTE1NGZiMjE1ZDdmNjI2ZTExZDVlNDYiLCJlbWFpbCI6ImFkbWluQGVmcy5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3ODI3MTY3ODMsInR5cGUiOiJhY2Nlc3MifQ.sT7PUduNyih4ZuMcKz7K2guyUgtCOBus-XtU180T4FE")
    
    params = {
        "search": shop_name,
        "limit": 10,
        "skip": 0
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "accept": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            
            shops = data if isinstance(data, list) else data.get("data", [])
            if not shops:
                return f"Không tìm thấy thông tin cho cửa hàng '{shop_name}'."
            
            # Pruning shop info
            result_list = []
            for s in shops:
                result_list.append({
                    "id": str(s.get("_id") or s.get("id")),
                    "name": s.get("name"),
                    "seller": s.get("manager_username") or s.get("seller_username") or s.get("username") or s.get("owner"),
                    "team": s.get("team_name") or s.get("team") or s.get("team_id"),
                    "marketplace": s.get("shop_type") or s.get("marketplace"),
                    "status": s.get("shop_mode") or s.get("status") or "N/A",
                    "auto_sync": s.get("auto_sync_orders"),
                    "raw_data": s
                })
                
            return json.dumps(result_list, ensure_ascii=False)

        except Exception as e:
            return f"Lỗi khi tìm kiếm shop: {str(e)}"

@tool
async def get_production_bottlenecks(days: int = 7) -> str:
    """Lấy danh sách các đơn hàng bị 'kẹt' trong sản xuất quá lâu mà chưa có tracking (mặc định là 7 ngày). Dùng hàm này khi user hỏi 'có đơn nào bị kẹt không' hoặc 'đơn nào sản xuất quá lâu chưa có tracking'."""
    base_url = os.getenv("EFS_API_BASE_URL", "https://efs.expsolution.io/api/v1")
    url = f"{base_url}/production/bottlenecks"
    token = os.getenv("EFS_API_TOKEN", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTE1NGZiMjE1ZDdmNjI2ZTExZDVlNDYiLCJlbWFpbCI6ImFkbWluQGVmcy5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3ODI3MTY3ODMsInR5cGUiOiJhY2Nlc3MifQ.sT7PUduNyih4ZuMcKz7K2guyUgtCOBus-XtU180T4FE")
    
    headers = {"Authorization": f"Bearer {token}", "accept": "application/json"}
    params = {"days": days}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, params=params, timeout=20)
            response.raise_for_status()
            data = response.json()
            
            total = data.get("total_stuck_orders", 0)
            bottlenecks = data.get("bottlenecks", [])
            
            if total == 0 or not bottlenecks:
                return f"Tuyệt vời! Hiện tại không có đơn nào bị kẹt trong sản xuất quá {days} ngày."
            
            # Extract sample orders from all bottlenecks
            all_samples = []
            for b in bottlenecks:
                shop_name = b.get("shop_name", "Unknown")
                for o in b.get("sample_orders", []):
                    all_samples.append({
                        "order": o.get("order_number"),
                        "shop": shop_name,
                        "marketplace_id": o.get("marketplace_order_id"),
                        "sent_at": o.get("sent_at")
                    })
            
            return json.dumps({
                "total_stuck": total,
                "stuck_list": all_samples[:20] 
            }, ensure_ascii=False)
        except Exception as e:
            return f"Lỗi khi lấy danh sách đơn kẹt: {str(e)}"

@tool
async def get_delivery_delays(days: int = 15) -> str:
    """Lấy danh sách các đơn hàng đã ship nhưng quá lâu chưa giao thành công (mặc định 15 ngày). Dùng hàm này khi user hỏi 'có đơn nào giao chậm không' hoặc 'đơn nào quá lâu chưa delivered'."""
    base_url = os.getenv("EFS_API_BASE_URL", "https://efs.expsolution.io/api/v1")
    url = f"{base_url}/shipping/delivery-delays"
    token = os.getenv("EFS_API_TOKEN", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTE1NGZiMjE1ZDdmNjI2ZTExZDVlNDYiLCJlbWFpbCI6ImFkbWluQGVmcy5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3ODI3MTY3ODMsInR5cGUiOiJhY2Nlc3MifQ.sT7PUduNyih4ZuMcKz7K2guyUgtCOBus-XtU180T4FE")
    
    headers = {"Authorization": f"Bearer {token}", "accept": "application/json"}
    params = {"days": days}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, params=params, timeout=20)
            response.raise_for_status()
            data = response.json()
            
            orders = data.get("data", [])
            if not orders:
                return f"Hiện tại không có đơn nào bị chậm giao hàng quá {days} ngày."
            
            pruned = [{
                "order": o.get("order_number"),
                "tracking": o.get("tracking_number"),
                "carrier": o.get("carrier"),
                "days_shipped": o.get("days_since_shipped")
            } for o in orders[:20]]
            
            return json.dumps({"count": len(orders), "delays": pruned}, ensure_ascii=False)
        except Exception as e:
            return f"Lỗi khi lấy danh sách đơn giao chậm: {str(e)}"

@tool
async def get_provider_tracking(print_provider: str, reference_id: str, external_id: str = None) -> str:
    """Tra cứu mã vận đơn (tracking number) trực tiếp từ API của nhà in (Print Provider). 
    Lưu ý: 
    - Với PENTIFINE: BẮT BUỘC dùng marketplace_order_id (mã đơn sàn) làm tham số external_id.
    - Với các nhà in khác: Có thể dùng reference_id.
    """
    if not print_provider:
        return "Thiếu thông tin print_provider."

    provider_key = print_provider.upper()
    
    # 1. Cấu hình đặc thù cho CUSTOMCAT
    if "CUSTOMCAT" in provider_key:
        if not reference_id: return "CustomCat yêu cầu reference_id."
        keys = await get_db_provider_keys()
        api_key = keys.get("customcat")
        if not api_key: return "Lỗi: Chưa cấu hình CUSTOMCAT_API_KEY trong hệ thống."
        
        base_url = "https://customcat-beta.mylocker.net"
        url = f"{base_url}/api/v1/order/status/{reference_id}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params={"api_key": api_key}, timeout=15)
                print(f"[DEBUG] CustomCat Response ({reference_id}): {response.status_code}")
                if response.status_code == 200:
                    data = response.json()
                    raw_status = data.get('ORDER_STATUS') or data.get('status', 'pending')
                    
                    # Xử lý Shipments và Carrier Tracking URLs
                    shipments = []
                    raw_shipments = data.get('SHIPMENTS', [])
                    
                    tracking_info = {
                        "tracking_number": data.get("tracking_number"),
                        "tracking_url": data.get("tracking_url"),
                        "carrier": "N/A"
                    }

                    if isinstance(raw_shipments, list) and len(raw_shipments) > 0:
                        for boat in raw_shipments:
                            tid = boat.get('TRACKING_ID')
                            carrier = boat.get('VENDOR', '').upper()
                            if tid:
                                t_url = ""
                                if 'USPS' in carrier:
                                    t_url = f"https://tools.usps.com/go/TrackConfirmAction?tLabels={tid}"
                                elif 'UPS' in carrier:
                                    t_url = f"https://www.ups.com/track?tracknum={tid}"
                                elif 'FEDEX' in carrier:
                                    t_url = f"https://www.fedex.com/fedextrack/?trknbr={tid}"
                                elif 'DHL' in carrier:
                                    t_url = f"https://www.dhl.com/en/express/tracking.html?AWB={tid}"
                                
                                if not tracking_info["tracking_number"]:
                                    tracking_info["tracking_number"] = tid
                                    tracking_info["tracking_url"] = t_url
                                    tracking_info["carrier"] = carrier
                                
                                shipments.append({"id": tid, "carrier": carrier, "url": t_url})

                    return json.dumps({
                        "provider": "CustomCat",
                        "status": raw_status,
                        "tracking_number": tracking_info["tracking_number"],
                        "tracking_url": tracking_info["tracking_url"],
                        "carrier": tracking_info["carrier"],
                        "all_shipments": shipments,
                        "note": "Thông tin từ CustomCat API"
                    }, ensure_ascii=False)
                else:
                    return f"CustomCat báo: Đơn {reference_id} hiện có trạng thái HTTP {response.status_code}."
            except Exception as e:
                return f"Lỗi kết nối CustomCat: {str(e)}"

    # 2. Cấu hình cho PENTIFINE
    if "PENTIFINE" in provider_key:
        # Ưu tiên external_id (mã đơn sàn) cho Pentifine theo yêu cầu của user
        target_id = external_id or reference_id
        if not target_id: return "Pentifine yêu cầu marketplace_order_id làm external_id."
        
        keys = await get_db_provider_keys()
        api_key = keys.get("pentifine")
        if not api_key: return "Lỗi: Chưa cấu hình PENTIFINE_API_KEY trong hệ thống (kiểm tra file .env)."
        
        base_url = "https://app.pentifine.com"
        url = f"{base_url}/api/v1/partner/order/{target_id}"
        # Pentifine API thường sử dụng Bearer Token
        headers = {"Authorization": f"Bearer {api_key}"}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=headers, timeout=15)
                print(f"[DEBUG] Pentifine Response ({target_id}): {response.status_code}")
                if response.status_code == 200:
                    raw_data = response.json()
                    data = raw_data.get('data', raw_data)
                    
                    trackings = data.get('trackings', [])
                    primary_tracking = next((t for t in trackings if t.get('is_primary')), None)
                    if not primary_tracking and trackings:
                        primary_tracking = trackings[0]
                    
                    return json.dumps({
                        "provider": "Pentifine",
                        "status": data.get('status', 'pending'),
                        "tracking_number": primary_tracking.get('tracking_number') if primary_tracking else None,
                        "tracking_url": primary_tracking.get('tracking_url') if primary_tracking else None,
                        "note": "Thông tin trực tiếp từ Pentifine Core"
                    }, ensure_ascii=False)
                else:
                    return f"Pentifine báo lỗi {response.status_code} (Unauthorized). Vui lòng kiểm tra lại API Key trong .env hoặc định dạng Header."
            except Exception as e:
                return f"Lỗi kết nối Pentifine: {str(e)}"

    # 3. Cấu hình cho MERCHIZE
    if "MERCHIZE" in provider_key:
        if not reference_id: return "Merchize yêu cầu reference_order_id."
        
        keys = await get_db_provider_keys()
        api_key = keys.get("merchize")
        if not api_key: return "Lỗi: Chưa cấu hình MERCHIZE_API_KEY trong hệ thống."
        
        # Base URL do user cung cấp (ví dụ: b82273a6...bo-api)
        base_url = "https://bo-group-2-1.merchize.com/wtulav8/bo-api"
        url = f"{base_url}/orders/{reference_id}"
        
        # Merchize thường dùng Authorization: Bearer <token>
        headers = {"Authorization": f"Bearer {api_key}"}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=headers, timeout=15)
                print(f"[DEBUG] Merchize Response ({reference_id}): {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    return json.dumps({
                        "provider": "Merchize",
                        "status": data.get('status'),
                        "tracking_number": data.get('tracking_number'),
                        "tracking_url": data.get('tracking_url'),
                        "estimated_delivery": data.get('estimated_delivery'),
                        "note": "Thông tin trực tiếp từ Merchize API"
                    }, ensure_ascii=False)
                else:
                    return f"Merchize báo lỗi {response.status_code}. Đơn {reference_id} có thể chưa được xử lý hoặc sai API key."
            except Exception as e:
                return f"Lỗi kết nối Merchize: {str(e)}"

    # 4. Cấu hình cho các nhà in khác
    if not reference_id: return "Thiếu reference_id để tra cứu."
    provider_endpoints = {
        "SHINE": f"https://api.shineon.com/v1/orders/{reference_id}/tracking",
        "SPOD": f"https://api.spod.com/v1/orders/{reference_id}/status",
        "GENERA": f"https://api.genera.io/v1/tracking/{reference_id}"
    }
    
    url = provider_endpoints.get(provider_key)
    if not url:
        return f"Nhà in {print_provider} chưa được tích hợp API tra cứu nhanh."

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return json.dumps({
                    "tracking_number": data.get("tracking_number") or data.get("tracking_code"),
                    "carrier": data.get("carrier") or "DHL/FedEx",
                    "status": "Đã có thông tin từ nhà in"
                }, ensure_ascii=False)
            else:
                return f"Thông báo từ nhà in {print_provider}: Hiện tại đơn {reference_id} vẫn đang trong quá trình sản xuất, chưa có tracking."
        except Exception as e:
            return f"Lỗi khi kết nối tới API của {print_provider}: {str(e)}"

class ProductionSkill(BaseSkill):
    def __init__(self):
        super().__init__(
            name="Sản xuất & Vận hành",
            description="Theo dõi lịch sản xuất, kiểm soát tồn kho và theo dõi tiến độ đơn hàng (bao gồm tra cứu tracking từ nhà in)."
        )

    async def get_capabilities(self) -> List[dict]:
        return [
            {"id": "get_efs_order_info", "name": "Tra cứu chi tiết đơn hàng", "desc": "Lấy thông tin súc tích từ EFS API."},
            {"id": "get_pending_orders", "name": "Thống kê đơn theo trạng thái", "desc": "Đếm và liệt kê các đơn: pending, in_production, on_hold, v.v."},
            {"id": "search_shop_info", "name": "Tra cứu thông tin Shop", "desc": "Tìm kiếm chủ sở hữu và team quản lý của một cửa hàng."},
            {"id": "get_production_bottlenecks", "name": "Cảnh báo đơn kẹt sản xuất", "desc": "Tìm các đơn chưa có tracking sau 7 ngày."},
            {"id": "get_delivery_delays", "name": "Cảnh báo đơn giao chậm", "desc": "Tìm các đơn ship lâu nhưng chưa delivered."},
            {"id": "get_provider_tracking", "name": "Tra cứu Tracking nhà in", "desc": "Gọi API trực tiếp nhà in (Pentifine, Merchize, CustomCat)."}
        ]

    async def get_system_prompt(self, user_role: str = "user", username: str = "guest") -> str:
        # Lấy bảng thời gian sản xuất từ DB
        from ..db.mongodb import mongodb
        cursor = mongodb.db.production_times.find()
        times_data = await cursor.to_list(length=100)
        
        table_rows = []
        for t in times_data:
            table_rows.append(f"- {t['product_type']}: {t['min_days']}-{t['max_days']} ngày làm việc.")
        
        production_table_str = "\n".join(table_rows) if table_rows else "- Mặc định: 3-5 ngày làm việc."

        return f"""
        Bạn là Quản lý Sản xuất kiêm Trưởng phòng Vận hành (Operations) chuyên nghiệp.
        
        BẢNG THỜI GIAN SẢN XUẤT DỰ KIẾN (LẤY TỪ DATABASE):
        {production_table_str}
        (Lưu ý: Không tính Thứ 7, Chủ nhật).

        NHIỆM VỤ:
        1. Sử dụng tool 'get_efs_order_info' để tra cứu thông tin CHI TIẾT 1 đơn hàng khi có mã đơn.
        2. Sử dụng tool 'get_pending_orders' khi cần liệt kê danh sách đơn theo trạng thái.
        3. Sử dụng tool 'search_shop_info' khi user hỏi các câu hỏi về thông tin cửa hàng.
        4. Sử dụng tool 'get_production_bottlenecks' khi user hỏi về các đơn hàng bị kẹt, sản xuất quá lâu chưa có tracking.
        5. Sử dụng tool 'get_delivery_delays' khi user hỏi về các đơn hàng giao chậm, ship lâu rồi chưa tới.
        6. Nếu hỏi về TRACKING mà EFS chưa có, hãy dùng 'get_provider_tracking' tra cứu nhà in:
           - Với PENTIFINE: Bạn PHẢI truyền 'marketplace_order_id' (ví dụ: 112-...) vào tham số 'external_id'.
           - Với MERCHIZE: Bạn PHẢI dùng 'reference_order_id' (ví dụ: MCZ-...) truyền vào tham số 'reference_id'.
           - Với các nhà in khác (CustomCat, Shine, v.v.): Dùng 'reference_order_id' truyền vào 'reference_id'.
        4. Nếu CẢ HAI đều chưa có tracking, hãy dùng trường 'sent_to_print_partner_at' (ngày gửi sang nhà in) cộng với số ngày trong BẢNG THỜI GIAN SẢN XUẤT ở trên để tính toán ngày dự kiến có tracking cho khách hàng.
           + Quan trọng: Phải lấy đúng loại sản phẩm từ danh sách 'items' để tra cứu trong bảng.
           + Ví dụ: Đơn Mug gửi đi ngày 01/04 -> Dự kiến có tracking vào ngày 03/04 hoặc 04/04.
        
        BẢNG ĐỊNH NGHĨA TRẠNG THÁI ĐƠN HÀNG:
        - 'pending': Chờ xử lý sau khi load từ sàn.
        - 'on_hold': Tạm giữ (thiếu design/SKU/seller giữ).
        - 'in_production': Đang sản xuất tại nhà in.
        - 'shipped': Đã sản xuất xong & có mã vận đơn.
        - 'in_transit': Đang vận chuyển.
        - 'out_for_delivery': Đang trên đường giao khách.
        - 'delivered': Giao thành công.
        - 'delivery_error': Lỗi giao hàng (sai địa chỉ/vắng nhà).
        - 'completed': Kết thúc hoàn toàn.
        - 'cancelled': Đã hủy.
        - 'refunded': Đã hoàn tiền.
        - 'new': Khởi tạo mới.
        - 'manually': Tạo thủ công.
        - 'has_issue': Gặp sự cố (hàng lỗi/sai phẩm).

        QUY TẮC TRẢ LỜI:
        - TRẢ LỜI CỰC KỲ NGẮN GỌN, SÚC TÍCH. KHÔNG giải thích các trạng thái đơn hàng trừ khi được yêu cầu. 
        - Với đơn kẹt/giao chậm: Báo tổng số lượng và liệt kê các mã đơn kèm số ngày bị trễ.
        - Với thông tin shop: Chỉ báo tên shop, seller (chủ shop) và team quản lý.
        - Với danh sách đơn theo trạng thái: Chỉ liệt kê số lượng tổng, sau đó liệt kê danh sách tối đa 10 đơn gần nhất (Mã đơn - Marketplace ID - Ngày tạo).
        - Với tra cứu 1 đơn: TÓM TẮT súc tích các thông tin chính. Nếu chưa có tracking, chỉ đưa ra NGÀY DỰ KIẾN cụ thể.
        - ĐỊNH DẠNG: Bullet points.
        - BẢO MẬT: Người đang hỏi là {username} ({user_role.upper()}).
          + Chỉ báo trạng thái và mã vận đơn. Không lộ thông tin nhạy cảm.
        - Ngôn ngữ: Tiếng Việt.
        """

    async def chat(self, user_input: str, user_role: str = "user", username: str = "guest", history: list = []) -> tuple[str, int]:
        system_prompt = await self.get_system_prompt(user_role, username)
        messages = [SystemMessage(content=system_prompt), HumanMessage(content=user_input)]
        
        # Cung cấp các tools cho Agent
        all_tools = [get_efs_order_info, get_provider_tracking, get_pending_orders, search_shop_info, get_production_bottlenecks, get_delivery_delays]
        tools = await self.filter_tools_by_permissions("production", all_tools, user_role)
        llm_with_tools = self.llm.bind_tools(tools)
        
        total_tokens = 0
        max_iterations = 5  # Giới hạn số vòng gọi tool để tránh loop vô tận
        
        for i in range(max_iterations):
            response = await llm_with_tools.ainvoke(messages)
            
            usage = getattr(response, "usage_metadata", {})
            total_tokens += usage.get("input_tokens", 0) + usage.get("output_tokens", 0)
            
            # Lưu response vào lịch sử hội thoại
            messages.append(response)
            
            if not response.tool_calls:
                # Nếu không còn yêu cầu gọi tool, trả về kết quả cuối cùng
                return response.content, total_tokens
            
            # Xử lý tất cả các yêu cầu gọi tool trong lượt này
            for tool_call in response.tool_calls:
                if tool_call["name"] == "get_efs_order_info":
                    tool_result = await get_efs_order_info.ainvoke(tool_call)
                    messages.append(tool_result)
                elif tool_call["name"] == "get_provider_tracking":
                    tool_result = await get_provider_tracking.ainvoke(tool_call)
                    messages.append(tool_result)
                elif tool_call["name"] == "get_pending_orders":
                    tool_result = await get_pending_orders.ainvoke(tool_call)
                    messages.append(tool_result)
                elif tool_call["name"] == "search_shop_info":
                    tool_result = await search_shop_info.ainvoke(tool_call)
                    messages.append(tool_result)
                elif tool_call["name"] == "get_production_bottlenecks":
                    tool_result = await get_production_bottlenecks.ainvoke(tool_call)
                    messages.append(tool_result)
                elif tool_call["name"] == "get_delivery_delays":
                    tool_result = await get_delivery_delays.ainvoke(tool_call)
                    messages.append(tool_result)
                    
        return "Tôi xin lỗi, quá trình xử lý yêu cầu của bạn quá phức tạp và đã vượt quá giới hạn cho phép.", total_tokens

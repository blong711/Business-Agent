import os
import time
from .base import BaseSkill
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.tools import tool
import httpx
import json
from ..core.config import settings

# Simple TTL Cache for order info (5 minutes)
order_cache = {}
CACHE_TTL = 300  # 5 mins

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
        api_key = settings.CUSTOMCAT_API_KEY
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
        
        api_key = settings.PENTIFINE_API_KEY
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
        
        api_key = settings.MERCHIZE_API_KEY
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
        1. Sử dụng tool 'get_efs_order_info' để tra cứu thông tin đơn hàng.
        2. Nếu hỏi về TRACKING mà EFS chưa có, hãy dùng 'get_provider_tracking' tra cứu nhà in:
           - Với PENTIFINE: Bạn PHẢI truyền 'marketplace_order_id' (ví dụ: 112-...) vào tham số 'external_id'.
           - Với MERCHIZE: Bạn PHẢI dùng 'reference_order_id' (ví dụ: MCZ-...) truyền vào tham số 'reference_id'.
           - Với các nhà in khác (CustomCat, Shine, v.v.): Dùng 'reference_order_id' truyền vào 'reference_id'.
        3. Nếu CẢ HAI đều chưa có tracking, hãy dùng trường 'sent_to_print_partner_at' (ngày gửi sang nhà in) cộng với số ngày trong BẢNG THỜI GIAN SẢN XUẤT ở trên để tính toán ngày dự kiến có tracking cho khách hàng.
           + Quan trọng: Phải lấy đúng loại sản phẩm từ danh sách 'items' để tra cứu trong bảng.
           + Ví dụ: Đơn Mug gửi đi ngày 01/04 -> Dự kiến có tracking vào ngày 03/04 hoặc 04/04.
        
        QUY TẮC TRẢ LỜI:
        - TÓM TẮT súc tích. Nếu chưa có tracking, phải đưa ra NGÀY DỰ KIẾN cụ thể dựa trên tính toán ở bước 3.
        - ĐỊNH DẠNG: Bullet points.
        - BẢO MẬT: Người đang hỏi là {username} ({user_role.upper()}).
          + Chỉ báo trạng thái và mã vận đơn. Không lộ thông tin nhạy cảm.
        - Ngôn ngữ: Tiếng Việt.
        """

    async def chat(self, user_input: str, user_role: str = "user", username: str = "guest", history: list = []) -> tuple[str, int]:
        system_prompt = await self.get_system_prompt(user_role, username)
        messages = [SystemMessage(content=system_prompt), HumanMessage(content=user_input)]
        
        # Cung cấp cả 2 tools cho Agent
        tools = [get_efs_order_info, get_provider_tracking]
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
                    
        return "Tôi xin lỗi, quá trình xử lý yêu cầu của bạn quá phức tạp và đã vượt quá giới hạn cho phép.", total_tokens

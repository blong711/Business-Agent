from .base import BaseSkill
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.tools import tool
import httpx
import json

@tool
async def get_efs_order_info(order_id: str) -> str:
    """Tra cứu trạng thái và thông tin chi tiết của đơn hàng trên hệ thống EFS thông qua mã đơn hàng (mã order_id, ví dụ như mã marketplace_id). Gọi hàm này khi user cung cấp mã đơn (chứa chữ và số)."""
    url = f"https://efs.expsolution.io/api/v1/orders/by-marketplace-id/{order_id}"
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTE1NGZiMjE1ZDdmNjI2ZTExZDVlNDYiLCJlbWFpbCI6ImFkbWluQGVmcy5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3ODI3MTY3ODMsInR5cGUiOiJhY2Nlc3MifQ.sT7PUduNyih4ZuMcKz7K2guyUgtCOBus-XtU180T4FE"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            return json.dumps(response.json(), ensure_ascii=False)
        except httpx.HTTPStatusError as e:
            return f"Lỗi EFS API: Không tìm thấy hoặc bị lỗi HTTP {e.response.status_code}. Chi tiết: {e.response.text}"
        except Exception as e:
            return f"Lỗi kết nối từ Hệ thống EFS nội bộ: {str(e)}"

class ProductionSkill(BaseSkill):
    def __init__(self):
        super().__init__(
            name="Sản xuất & Vui Hành",
            description="Theo dõi lịch sản xuất, kiểm soát tồn kho và theo dõi tiến độ đơn hàng trên hệ thống EFS."
        )

    async def get_system_prompt(self, user_role: str = "user", username: str = "guest") -> str:
        return f"""
        Bạn là Quản lý Sản xuất kiêm Trưởng phòng Vận hành (Operations) thông minh.
        Nhiệm vụ:
        - Theo dõi tiến độ đơn hàng, thông tin sản phẩm và cập nhật dựa trên API EFS.
        - Khi khách hàng cho một mã đơn hàng ngẫu nhiên (chữ hoặc số), BẮT BUỘC sử dụng tool get_efs_order_info để tra cứu trực tiếp thông tin từ mạng nội bộ EFS trước khi trả lời.
        - BẢO MẬT DỮ LIỆU: Người đang hỏi bạn có TÀI KHOẢN là '{username}' và QUYỀN HẠN là '{user_role.upper()}'.
          Nếu quyền là USER, chỉ trả lời tiến độ và tình trạng đơn hàng cơ bản, KHÔNG cung cấp các thông tin nhạy cảm như giá trị nhập hàng (cost) hay thông tin của khách hàng khác.
          Nếu quyền là ADMIN, bạn được phép xem và trả lời chi tiết toàn bộ dữ liệu trả về từ hệ thống EFS.
        - Giải thích chi tiết cho khách hàng về tình trạng đơn hàng (ví dụ: đang chờ thiết kế, đã in, đã ship...) và các thông số đi kèm trong JSON API nếu có.
        - Giọng văn: Giành mạch, rõ ràng, tập trung vào giải đáp tiến độ đơn hàng.
        - Ngôn ngữ: Tiếng Việt.
        """

    async def chat(self, user_input: str, user_role: str = "user", username: str = "guest", history: list = []) -> tuple[str, int]:
        system_prompt = await self.get_system_prompt(user_role, username)
        messages = [SystemMessage(content=system_prompt), HumanMessage(content=user_input)]
        
        # Khai báo cho AI biết có Tools 
        llm_with_tools = self.llm.bind_tools([get_efs_order_info])
        response = await llm_with_tools.ainvoke(messages)
        
        total_tokens = 0
        usage = getattr(response, "usage_metadata", {})
        total_tokens += usage.get("input_tokens", 0) + usage.get("output_tokens", 0)
        
        # Nếu mô hình quyết định gọi Tools sau khi phân tích ý định
        if response.tool_calls:
            # Lưu lại yêu cầu gọi function vào messages
            messages.append(response)
            
            for tool_call in response.tool_calls:
                if tool_call["name"] == "get_efs_order_info":
                    # Thực thi hàm HTTP call tới API (dạng Async)
                    tool_result = await get_efs_order_info.ainvoke(tool_call)
                    
                    # Trả lại kết quả JSON của EFS vào thông điệp mới
                    messages.append(tool_result)
                    
            # Yêu cầu AI tổng hợp câu trả lời dựa trên kết quả JSON vừa nhận được
            final_response = await llm_with_tools.ainvoke(messages)
            usage2 = getattr(final_response, "usage_metadata", {})
            total_tokens += usage2.get("input_tokens", 0) + usage2.get("output_tokens", 0)
            return final_response.content, total_tokens
            
        return response.content, total_tokens

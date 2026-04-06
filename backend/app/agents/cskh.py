from typing import List
from .base import BaseSkill
from ..db.mongodb import mongodb
from langchain_core.messages import SystemMessage, HumanMessage
from ..core.llm_manager import llm_manager
import json

class CSKHSkill(BaseSkill):
    def __init__(self):
        super().__init__(
            name="Chăm sóc Khách hàng",
            description="Giải quyết khiếu nại, hỗ trợ đơn hàng, xem thông tin nhóm và tin nhắn khách hàng."
        )

    async def get_capabilities(self) -> List[dict]:
        return [
            {"id": "summarize_telegram", "name": "Tổng hợp tin nhắn Telegram", "desc": "Tóm tắt nội dung chat trong các nhóm kết nối."},
            {"id": "analyze_sentiment", "name": "Phân tích thái độ khách hàng", "desc": "Nhận diện khách hàng đang nóng giận hoặc hài lòng."},
            {"id": "member_lookup", "name": "Tra cứu thành viên nhóm", "desc": "Lấy thông tin profile Telegram của khách hàng."}
        ]

    async def get_system_prompt(self, user_role: str = "user", username: str = "guest") -> str:
        return f"""
        Bạn là chuyên viên Chăm sóc Khách hàng kiêm Thư ký quản lý cộng đồng Telegram thông minh, chuyên nghiệp.
        Nhiệm vụ: 
        - Trả lời khách hàng nhẹ nhàng, thấu hiểu.
        - Phân tích thông tin nhóm Telegram, tổng hợp tin nhắn khách hàng và ĐÁNH GIÁ THÁI ĐỘ của khách.
        - TÌM KIẾM, trích xuất sự thật dựa vào Dữ liệu Telegram hệ thống cung cấp dưới đây.
        - BẢO MẬT DỮ LIỆU: Người đang hỏi bạn có TÀI KHOẢN là '{username}' và QUYỀN HẠN là '{user_role.upper()}'.
          Nếu quyền là USER, bạn KHÔNG ĐƯỢC PHÉP báo cáo tóm tắt nội dung tin nhắn Telegram của người khác hoặc thông tin nhóm nội bộ. Chỉ được trả lời hoặc hỗ trợ các vấn đề cá nhân của họ.
          Nếu quyền là ADMIN, bạn được phép xem và tóm tắt mọi thứ.
        - Nếu đề cập đến một khách hàng có thái độ tiêu cực, hãy gợi ý cách giải quyết.
        - Ngôn ngữ: Tiếng Việt.
        """

    async def chat(self, user_input: str, user_role: str = "user", username: str = "guest", history: list = []) -> tuple[str, int]:
        # Lấy tối đa 5 groups, 20 members, 30 tin nhắn mới nhất
        if user_role == "admin":
            groups = await mongodb.db.telegram_groups.find().to_list(length=5)
            members = await mongodb.db.telegram_members.find().to_list(length=20)
            messages_raw = await mongodb.db.telegram_messages.find().sort("date", -1).to_list(length=30)
        else:
            # User thường không có quyền xem thông tin nhóm nội bộ của người khác
            groups = []
            members = []
            messages_raw = []
        
        # Lọc bớt dữ liệu rác, chỉ lấy trường cần thiết
        group_info = [
            {"chat_id": str(g.get("chat_id")), "title": g.get("title"), "type": g.get("type")} 
            for g in groups
        ]
        
        member_info = [
            {
                "user_id": str(m.get("user_id")), 
                "name": f"{m.get('first_name', '')} {m.get('last_name', '')}".strip(),
                "username": m.get("username", "")
            } 
            for m in members
        ]
        
        # Đảo ngược tin nhắn để theo thứ tự thời gian cũ -> mới
        recent_messages = [
            {"user_id": str(m.get("user_id")), "text": m.get("text", "")} 
            for m in messages_raw[::-1]
        ]

        # Gắn thêm tên member vào tin nhắn cho AI dễ hiểu
        for msg in recent_messages:
            for mem in member_info:
                if msg["user_id"] == mem["user_id"]:
                    msg["tên_người_gửi"] = mem["name"]
                    break

        context = f"""
        ======== DỮ LIỆU TELEGRAM HIỆN TẠI ========
        - Nhóm (Groups): {json.dumps(group_info, ensure_ascii=False)}
        - Thành viên (Members): {json.dumps(member_info, ensure_ascii=False)}
        - 30 Tin nhắn gần nhất (Chat History): {json.dumps(recent_messages, ensure_ascii=False)}
        ================================================

        Câu hỏi / Yêu cầu của user: {user_input}
        
        Hãy sử dụng DỮ LIỆU TELEGRAM phía trên để trả lời user một cách đầy đủ và sâu sắc nhất.
        """

        # 1. Tải cấu hình LLM từ DB/Settings
        keys = await self.get_provider_keys()
        llm = llm_manager.get_chat_model(
            model_name=keys.get("default_model"),
            api_key=keys.get("model_api_key"),
            api_base=keys.get("model_api_url")
        )

        system_prompt = await self.get_system_prompt(user_role, username)
        msgs = [SystemMessage(content=system_prompt), HumanMessage(content=context)]
        
        response = await llm.ainvoke(msgs)
        usage = getattr(response, "usage_metadata", {})
        total_tokens = usage.get("input_tokens", 0) + usage.get("output_tokens", 0)
        return response.content, total_tokens

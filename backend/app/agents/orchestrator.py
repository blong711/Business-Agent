import json
from typing import List, Dict, Any
from langchain_core.messages import SystemMessage, HumanMessage
from ..core.llm_manager import llm_manager
from .cskh import CSKHSkill
from .accounting import AccountingSkill
from .production import ProductionSkill

class Orchestrator:
    """
    Phân tích yêu cầu khách hàng và điều hướng đến Skill phù hợp nhất.
    Sử dụng Router Agent (Claude Haiku).
    """
    def __init__(self):
        self.skills = {
            "cskh": CSKHSkill(),
            "accounting": AccountingSkill(),
            "production": ProductionSkill()
        }
        self.classifier_llm = llm_manager.get_chat_model()

    async def classify_intent(self, user_input: str) -> tuple[str, int]:
        prompt = f"""
        Nhiệm vụ của bạn là phân loại một yêu cầu của khách hàng vào một trong các bộ phận sau:
        - 'cskh': Nếu hỏi về hỗ trợ, khiếu nại, thông tin sản phẩm, HOẶC xem/phân tích lịch sử tin nhắn Telegram, thông tin thành viên, tóm tắt nhóm, sắc thái tin nhắn.
        - 'accounting': Nếu hỏi về tiền bạc, doanh thu, hóa đơn, bảng lương.
        - 'production': Nếu hỏi về lịch sản xuất, tiến độ, tồn kho vật tư, kiểm tra mã đơn hàng, trạng thái tracking, EFS.
        - 'general': Nếu chỉ là chào hỏi hoặc nội dung khác.

        Chỉ trả về DUY NHẤT một từ khóa trong danh sách trên (cskh, accounting, production, general).
        Yêu cầu: '{user_input}'
        """
        messages = [HumanMessage(content=prompt)]
        response = await self.classifier_llm.ainvoke(messages)
        intent = response.content.strip().lower()
        
        usage = getattr(response, "usage_metadata", {})
        total_tokens = usage.get("input_tokens", 0) + usage.get("output_tokens", 0)
        
        # Fallback nếu AI trả lời dài dòng
        for key in ["cskh", "accounting", "production", "general"]:
            if key in intent:
                return key, total_tokens
        return "general", total_tokens

    async def process_request(self, user_input: str, intent: str, tokens_intent: int, user_role: str = "user", username: str = "guest") -> str:
        if intent == "general":
            if "chào" in user_input.lower():
                res, tk = await self.skills["cskh"].chat("Chào bạn! Bạn cần hỗ trợ gì ạ?", user_role, username)
                return res + f"\n\n*(🔋 Tốn {tokens_intent + tk} tokens cho câu hỏi này)*"
            else:
                return f"Tôi có thể giúp bạn gì với CSKH, Kế toán hoặc Sản xuất không?\n\n*(🔋 Tốn {tokens_intent} tokens cho câu hỏi này)*"
        
        skill = self.skills.get(intent)
        if skill:
            res, tk = await skill.chat(user_input, user_role, username)
            return res + f"\n\n*(🔋 Tốn {tokens_intent + tk} tokens cho câu hỏi này)*"
        
        return "Xin lỗi, tôi không hiểu bạn đang quan tâm đến bộ phận nào."

orchestrator = Orchestrator()

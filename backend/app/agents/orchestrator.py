import json
import re
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
        # -- FAST PATH: Heuristic checks to save tokens --
        user_input_lower = user_input.lower().strip()
        
        # 1. Check for Order IDs (usually long numbers)
        if re.search(r'\d{12,}', user_input):
            return "production", 0
        
        # 2. Check for Production keywords
        if any(kw in user_input_lower for kw in ["đơn hàng", "trạng thái", "tracking", "vận chuyển", "sản xuất", "shop", "cửa hàng"]):
            if re.search(r'#?\d+', user_input) or any(kw in user_input_lower for kw in ["shop", "cửa hàng"]): 
                return "production", 0

        # 3. Check for Accounting keywords
        if any(kw in user_input_lower for kw in ["doanh thu", "tiền", "lương", "hóa đơn", "kế toán"]):
            return "accounting", 0

        # 4. Check for CSKH / Messages
        if any(kw in user_input_lower for kw in ["tin nhắn", "telegram", "khách hàng", "mắng", "chửi", "hỗ trợ"]):
            return "cskh", 0

        # 5. Check for Greetings
        if user_input_lower in ["chào", "hi", "hello", "xin chào", "hey"]:
            return "general", 0

        # -- SLOW PATH: LLM Classification --
        prompt = f"""
        Nhiệm vụ của bạn là phân loại một yêu cầu của khách hàng vào một trong các bộ phận sau:
        - 'cskh': Nếu hỏi về hỗ trợ, khiếu nại, thông tin sản phẩm, HOẶC tóm tắt/phân tích tin nhắn Telegram.
        - 'accounting': Nếu hỏi về tiền bạc, doanh thu, hóa đơn, bảng lương.
        - 'production': Nếu hỏi về sản xuất, đơn hàng, tracking, HOẶC tra cứu thông tin shop/cửa hàng (vd: shop Taylor của ai).
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
        user_input_lower = user_input.lower().strip()
        if intent == "general":
            if any(greeting in user_input_lower for greeting in ["chào", "hi", "hello", "xin chào", "hey"]):
                return f"Chào bạn! Tôi là Nexus AI. Tôi có thể hỗ trợ bạn kiểm tra đơn hàng, xem báo cáo doanh thu hoặc tóm tắt tin nhắn Telegram. Bạn cần giúp gì ạ?\n\n*(🔋 Tốn {tokens_intent} tokens cho câu hỏi này)*"
            else:
                return f"Tôi có thể giúp bạn gì với CSKH, Kế toán hoặc Sản xuất không?\n\n*(🔋 Tốn {tokens_intent} tokens cho câu hỏi này)*"
        
        skill = self.skills.get(intent)
        if skill:
            res, tk = await skill.chat(user_input, user_role, username)
            return res + f"\n\n*(🔋 Tốn {tokens_intent + tk} tokens cho câu hỏi này)*"
        
        return "Xin lỗi, tôi không hiểu bạn đang quan tâm đến bộ phận nào."

orchestrator = Orchestrator()

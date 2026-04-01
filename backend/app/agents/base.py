from typing import List, Optional
from langchain_core.messages import SystemMessage, HumanMessage
from ..core.llm_manager import llm_manager
from ..core.config import settings

class BaseSkill:
    """
    Lớp cơ sở cho mọi kỹ năng (Skill) của Bot.
    Từng bộ phận sẽ kế thừa từ đây.
    """
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.llm = llm_manager.get_chat_model()

    async def get_system_prompt(self, user_role: str = "user", username: str = "guest") -> str:
        raise NotImplementedError("Skill phải tự định nghĩa system prompt.")

    async def chat(self, user_input: str, user_role: str = "user", username: str = "guest", history: List = []) -> tuple[str, int]:
        """
        Gửi tin nhắn và nhận phản hồi đơn giản (chưa bao gồm dùng Tools).
        """
        system_prompt = await self.get_system_prompt(user_role, username)
        messages = [SystemMessage(content=system_prompt)]
        
        # Thêm lịch sử nếu có...
        # messages.extend(history) 
        
        messages.append(HumanMessage(content=user_input))
        
        response = await self.llm.ainvoke(messages)
        usage = getattr(response, "usage_metadata", {})
        total_tokens = usage.get("input_tokens", 0) + usage.get("output_tokens", 0)
        return response.content, total_tokens

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

    async def get_capabilities(self) -> List[dict]:
        """
        Trả về danh sách các khả năng (tools/features) của Agent này.
        """
        return []

    async def filter_tools_by_permissions(self, agent_id: str, tools: List, user_role: str) -> List:
        """
        Lọc danh sách tools dựa trên quyền hạn trong DB.
        Admin luôn có toàn quyền.
        """
        if user_role == "admin":
            return tools
            
        from ..db.mongodb import mongodb
        # Lấy quyền hạn từ DB
        db_perms = await mongodb.db.agent_permissions.find({"agent_id": agent_id}).to_list(length=100)
        # Những tool nào cho phép 'user' thì mới giữ lại
        allowed_cap_ids = [p["cap_id"] for p in db_perms if "user" in p.get("roles", [])]
        
        # Nếu chưa set gì trong DB, mặc định 'user' không có quyền dùng tool nào (an toàn nhất)
        # trừ khi chúng ta muốn mặc định là có (tuỳ policy). Ở đây chọn an toàn.
        
        filtered = []
        for t in tools:
            # t là một function được wrap bởi @tool, nó có thuộc tính name (hoặc __name__)
            # Lưu ý name của tool thường là ID chúng ta dùng trong Capabilities
            tool_name = getattr(t, "name", t.__name__)
            if tool_name in allowed_cap_ids:
                filtered.append(t)
        
        return filtered

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
    async def get_provider_keys(self) -> dict:
        """
        Lấy các API Key từ DB. Nếu không có, lấy từ settings (.env).
        """
        from ..db.mongodb import mongodb
        doc = await mongodb.db.system_settings.find_one({"key": "provider_keys"})
        db_keys = doc.get("value", {}) if doc else {}
        
        return {
            "customcat": db_keys.get("customcat_key") or settings.CUSTOMCAT_API_KEY,
            "pentifine": db_keys.get("pentifine_key") or settings.PENTIFINE_API_KEY,
            "merchize": db_keys.get("merchize_key") or settings.MERCHIZE_API_KEY
        }

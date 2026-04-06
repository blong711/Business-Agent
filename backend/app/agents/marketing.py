from typing import List
from .base import BaseSkill
from langchain_core.messages import SystemMessage, HumanMessage
import json
import datetime
from ..core.llm_manager import llm_manager
from ..db.mongodb import mongodb

class MarketingSkill(BaseSkill):
    def __init__(self):
        super().__init__(
            name="Chuyên gia Marketing & Content",
            description="Tối ưu tiêu đề sản phẩm SEO, viết mô tả bán hàng sáng tạo và bài đăng mạng xã hội."
        )

    async def get_capabilities(self) -> List[dict]:
        return [
            {"id": "product_seo_title", "name": "SEO Title Optimizer", "desc": "Tạo tiêu đề sản phẩm tối ưu cho Etsy, Amazon, Shopify dựa trên từ khóa chính."},
            {"id": "product_description", "name": "Creative Description", "desc": "Viết mô tả sản phẩm theo phong cách kể chuyện hoặc đánh vào lợi ích cốt lõi để tăng tỷ lệ chuyển đổi."},
            {"id": "social_media_hooks", "name": "Viral Content Hooks", "desc": "Tạo các tiêu đề thu hút (hook) và nội dung ngắn cho TikTok, Reels hoặc bài đăng Facebook Ads."},
            {"id": "ad_copy_gen", "name": "Ad Copy Magic", "desc": "Viết nội dung quảng cáo ngắn gọn, đánh đúng tâm lý khách hàng (FOMO, Pain points)."}
        ]

    async def get_system_prompt(self, user_role: str = "user", username: str = "guest") -> str:
        return f"""
        Bạn là Chuyên gia Marketing và Sáng tạo nội dung (Content Specialist) chuyên nghiệp trong lĩnh vực Thương mại điện tử xuyên biên giới (Cross-border E-com) và Print-On-Demand (POD).
        
        Nhiệm vụ:
        - Tối ưu TIÊU ĐỀ (Title): Luôn đảm bảo tiêu đề chứa các từ khóa mua sắm quan trọng ở đầu.
        - Viết MÔ TẢ (Description): Phân chia rõ ràng: Lợi ích chính -> Câu chuyện sản phẩm -> CTA.
        - Ngôn ngữ: Linh hoạt theo yêu cầu. Lưu ý TIÊU ĐỀ cho thị trường US phải là Tiếng Anh.
        
        Người đang yêu cầu bạn là '{username}' với quyền '{user_role.upper()}'.
        """

    async def chat(self, user_input: str, user_role: str = "user", username: str = "guest", history: list = []) -> tuple[str, int]:
        # 1. Lấy dữ liệu Trending Niches thực tế từ DB để Agent có context "thời sự"
        try:
            cursor = mongodb.db.trending_niches.find().sort("updated_at", -1).limit(5)
            db_niches = await cursor.to_list(length=5)
            niche_list = "\n".join([f"- {n['niche']} ({n['growth']})" for n in db_niches])
            extra_context = f"\n\nCÁC NGÁCH ĐANG HOT TẠI HUB NGHIÊN CỨU:\n{niche_list}"
        except Exception:
            extra_context = ""

        system_prompt = await self.get_system_prompt(user_role, username)
        system_prompt += extra_context

        # 1. Tải cấu hình LLM từ DB/Settings
        keys = await self.get_provider_keys()
        llm = llm_manager.get_chat_model(
            model_name=keys.get("default_model"),
            api_key=keys.get("model_api_key"),
            api_base=keys.get("model_api_url")
        )

        msgs = [SystemMessage(content=system_prompt), HumanMessage(content=user_input)]
        
        response = await llm.ainvoke(msgs)
        usage = getattr(response, "usage_metadata", {})
        total_tokens = usage.get("input_tokens", 0) + usage.get("output_tokens", 0)
        
        # --- AUTO-SAVE TO CONTENT LIBRARY ---
        try:
            # Dự đoán loại nội dung dựa trên input hoặc output
            content_type = "Creative Content"
            user_input_lower = user_input.lower()
            if "tiêu đề" in user_input_lower or "title" in user_input_lower: content_type = "Product Title"
            elif "mô tả" in user_input_lower or "description" in user_input_lower: content_type = "Product Description"
            elif "ad" in user_input_lower or "quảng cáo" in user_input_lower: content_type = "Ad Copy"

            # Lưu vào MongoDB
            await mongodb.db.marketing_contents.insert_one({
                "username": username,
                "type": content_type,
                "title": user_input[:50] + ("..." if len(user_input) > 50 else ""),
                "content": response.content,
                "tokens": total_tokens,
                "timestamp": datetime.datetime.utcnow()
            })
        except Exception as e:
            print(f"Error saving marketing content: {e}")

        return response.content, total_tokens

from typing import Any
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel
from .config import settings

class LLMManager:
    """
    Quản lý khởi tạo Model AI linh hoạt dựa trên cấu hình.
    Có thể mở rộng thêm OpenAI, Gemini dễ dàng.
    """
    
    @staticmethod
    def get_chat_model(model_name: str = None) -> BaseChatModel:
        model = model_name or settings.DEFAULT_MODEL
        
        # DeepSeek (OpenAI-compatible)
        if model.startswith("deepseek"):
            if not settings.DEEPSEEK_API_KEY:
                raise ValueError("Thiếu DEEPSEEK_API_KEY trong cấu hình.")
            return ChatOpenAI(
                model=model,
                openai_api_key=settings.DEEPSEEK_API_KEY,
                openai_api_base="https://api.deepseek.com",
                temperature=0.7
            )
            
        # Claude (Anthropic)
        if model.startswith("claude"):
            if not settings.ANTHROPIC_API_KEY:
                raise ValueError("Thiếu ANTHROPIC_API_KEY trong cấu hình.")
            return ChatAnthropic(
                model=model, 
                anthropic_api_key=settings.ANTHROPIC_API_KEY
            )
            
        # Thêm các điều kiện cho OpenAI, Gemini nếu cần...
        
        raise ValueError(f"Model '{model}' chưa được hỗ trợ hoặc sai định dạng.")

llm_manager = LLMManager()

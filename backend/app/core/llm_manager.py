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
    def get_chat_model(
        model_name: str = None, 
        api_key: str = None, 
        api_base: str = None
    ) -> BaseChatModel:
        model = model_name or settings.DEFAULT_MODEL
        
        # OpenAI-compatible (DeepSeek, Groq, OpenRouter, etc.)
        # If api_base or deepseek prefix matches
        if api_base or model.startswith("deepseek") or model.startswith("gpt"):
            effective_key = api_key or settings.DEEPSEEK_API_KEY
            effective_base = api_base or "https://api.deepseek.com"
            
            if not effective_key:
                raise ValueError("Thiếu API Key cho mô hình AI.")
                
            return ChatOpenAI(
                model=model,
                openai_api_key=effective_key,
                openai_api_base=effective_base,
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

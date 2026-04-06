from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Business Agent"
    API_V1_STR: str = "/api/v1"
    
    # AI Config
    ANTHROPIC_API_KEY: Optional[str] = None
    DEEPSEEK_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    DEFAULT_MODEL: str = "deepseek-chat" 
    
    # Database
    MONGODB_URL: str = "mongodb://mongodb:27017" # URL mặc định cho Docker
    DATABASE_NAME: str = "ai_business_db"
    
    # Bots
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    
    # Print Providers
    CUSTOMCAT_API_KEY: Optional[str] = None
    PENTIFINE_API_KEY: Optional[str] = None
    MERCHIZE_API_KEY: Optional[str] = None
    
    # ElevenLabs
    ELEVENLABS_API_KEY: Optional[str] = None
    ELEVENLABS_VOICE_ID: Optional[str] = "pNInz6obpg8ndEao7mAl" # Default voice
    ELEVENLABS_MODEL_ID: Optional[str] = "eleven_multilingual_v2"
    
    class Config:
        env_file = ".env"

settings = Settings()

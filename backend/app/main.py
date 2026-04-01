from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .core.config import settings
from .db.mongodb import mongodb
from .agents.orchestrator import orchestrator
from .bots.telegram import setup_telegram_bot
from contextlib import asynccontextmanager
import hashlib
import datetime
from typing import List, Optional

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi tạo kết nối DB khi Server bật
    await mongodb.connect()
    
    # Khởi tạo và chạy Telegram Bot bằng Polling Async
    telegram_app = setup_telegram_bot()
    if telegram_app:
        print("--- [FastAPI] Khởi tạo Telegram Bot... ---")
        await telegram_app.initialize()
        await telegram_app.start()
        await telegram_app.updater.start_polling()
        print("--- [FastAPI] Telegram Bot bắt đầu Polling... ---")
    else:
        print("--- [FastAPI] Bỏ qua Telegram Bot (Thiếu Token) ---")

    yield

    # Ngắt kết nối Bot và DB khi Server tắt
    if telegram_app:
        await telegram_app.updater.stop()
        await telegram_app.stop()
        await telegram_app.shutdown()
        
    await mongodb.disconnect()

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    user_id: str = "guest"

class ChatResponse(BaseModel):
    response: str
    intent: Optional[str] = "unknown"

class AuthRequest(BaseModel):
    username: str
    password: str

class AuthResponse(BaseModel):
    token: str
    username: str
    role: str = "user"

class LinkTelegramRequest(BaseModel):
    username: str
    telegram_id: str

class SettingsRequest(BaseModel):
    anthropic_api_key: str
    telegram_bot_token: str
    default_model: str

class TelegramGroupItem(BaseModel):
    chat_id: int
    title: str
    type: str
    updated_at: str

class TelegramMemberItem(BaseModel):
    user_id: int
    username: str = None
    first_name: str = None
    last_name: str = None
    chat_id: int
    updated_at: str

class UserItem(BaseModel):
    username: str
    role: str
    telegram_id: Optional[str] = None
    created_at: str

class MessageItem(BaseModel):
    role: str
    content: str
    intent: Optional[str] = None
    timestamp: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@app.get("/")
async def root():
    return {"message": "AI Business Agent API is running!"}

@app.post(f"{settings.API_V1_STR}/settings", response_model=SettingsRequest)
async def update_system_settings(request: SettingsRequest):
    doc = request.dict()
    doc["type"] = "system"
    await mongodb.db.settings.replace_one({"type": "system"}, doc, upsert=True)
    return request

@app.get(f"{settings.API_V1_STR}/telegram/groups", response_model=List[TelegramGroupItem])
async def get_telegram_groups():
    cursor = mongodb.db.telegram_groups.find()
    groups = await cursor.to_list(length=100)
    return [
        TelegramGroupItem(
            chat_id=g["chat_id"],
            title=g.get("title", ""),
            type=g.get("type", "unknown"),
            updated_at=g["updated_at"].isoformat() if "updated_at" in g else ""
        )
        for g in groups
    ]

@app.get(f"{settings.API_V1_STR}/telegram/groups/{{chat_id}}/members", response_model=List[TelegramMemberItem])
async def get_telegram_group_members(chat_id: int):
    cursor = mongodb.db.telegram_members.find({"chat_id": chat_id})
    members = await cursor.to_list(length=500)
    return [
        TelegramMemberItem(
            user_id=m["user_id"],
            username=m.get("username"),
            first_name=m.get("first_name"),
            last_name=m.get("last_name"),
            chat_id=m["chat_id"],
            updated_at=m["updated_at"].isoformat() if "updated_at" in m else ""
        )
        for m in members
    ]

@app.post(f"{settings.API_V1_STR}/auth/register", response_model=AuthResponse)
async def register(request: AuthRequest):
    user = await mongodb.db.users.find_one({"username": request.username})
    if user:
        raise HTTPException(status_code=400, detail="Tài khoản đã tồn tại!")
    
    role = "admin" if request.username.lower() == "admin" else "user"
    await mongodb.db.users.insert_one({
        "username": request.username,
        "password": hash_password(request.password),
        "role": role,
        "created_at": datetime.datetime.utcnow()
    })
    return AuthResponse(token=f"fake-jwt-token-{request.username}", username=request.username, role=role)

@app.post(f"{settings.API_V1_STR}/auth/login", response_model=AuthResponse)
async def login(request: AuthRequest):
    user = await mongodb.db.users.find_one({"username": request.username, "password": hash_password(request.password)})
    if not user:
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu!")
    
    role = user.get("role", "user")
    return AuthResponse(token=f"fake-jwt-token-{request.username}", username=request.username, role=role)

@app.post(f"{settings.API_V1_STR}/auth/link")
async def link_telegram(request: LinkTelegramRequest):
    user = await mongodb.db.users.find_one({"username": request.username})
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản người dùng!")
    
    await mongodb.db.users.update_one(
        {"username": request.username},
        {"$set": {"telegram_id": str(request.telegram_id)}}
    )
    return {"message": "Liên kết tài khoản Telegram thành công!", "telegram_id": request.telegram_id}

@app.get(f"{settings.API_V1_STR}/users", response_model=List[UserItem])
async def get_all_users():
    cursor = mongodb.db.users.find().sort("created_at", -1)
    users = await cursor.to_list(length=100)
    return [
        UserItem(
            username=u["username"],
            role=u.get("role", "user"),
            telegram_id=u.get("telegram_id"),
            created_at=u["created_at"].isoformat() if isinstance(u.get("created_at"), datetime.datetime) else str(u.get("created_at", ""))
        )
        for u in users
    ]

@app.get(f"{settings.API_V1_STR}/chat/history/{{username}}", response_model=List[MessageItem])
async def get_chat_history(username: str):
    cursor = mongodb.db.web_messages.find({"username": username}).sort("timestamp", 1)
    messages = await cursor.to_list(length=100)
    
    result = []
    for msg in messages:
        intent_val = msg.get("intent")
        if isinstance(intent_val, list) and len(intent_val) > 0:
            intent_val = str(intent_val[0])
            
        result.append(MessageItem(
            role=msg["role"], 
            content=msg["content"], 
            intent=intent_val if isinstance(intent_val, str) else None, 
            timestamp=msg["timestamp"].isoformat()
        ))
    return result

@app.post(f"{settings.API_V1_STR}/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint chính để xử lý yêu cầu chat từ mọi nguồn (Web, CLI...).
    """
    try:
        # Lưu tin nhắn của Cụ khách (User)
        user_msg = {
            "username": request.user_id,
            "role": "user",
            "content": request.message,
            "timestamp": datetime.datetime.utcnow()
        }
        await mongodb.db.web_messages.insert_one(user_msg)

        # Lấy thông tin role người dùng
        user = await mongodb.db.users.find_one({"username": request.user_id})
        user_role = user.get("role", "user") if user else "user"

        # 1. Phân loại ý định
        intent, tokens_intent = await orchestrator.classify_intent(request.message)
        
        # 2. Xử lý yêu cầu thông qua các Agent, truyền thêm role và username
        response_text = await orchestrator.process_request(request.message, intent, tokens_intent, user_role, request.user_id)
        
        # Lưu tin nhắn của Agent trả lời
        agent_msg = {
            "username": request.user_id,
            "role": "agent",
            "content": response_text,
            "intent": intent,
            "timestamp": datetime.datetime.utcnow()
        }
        await mongodb.db.web_messages.insert_one(agent_msg)

        return ChatResponse(
            response=response_text,
            intent=intent
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

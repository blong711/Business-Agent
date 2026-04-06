import logging
from telegram import Update, ChatMemberUpdated, BotCommand
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, ChatMemberHandler, filters
from ..core.config import settings
from ..agents.orchestrator import orchestrator
from ..db.mongodb import mongodb
import datetime
import traceback

logger = logging.getLogger(__name__)

async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
    logger.error("Exception while handling an update:", exc_info=context.error)
    print(f"--- [TELEGRAM ERROR] {context.error} ---")
    traceback.print_exc()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome_text = (
        "Xin chào! Tôi là AI Business Agent.\n\n"
        "Tôi có thể hỗ trợ các nghiệp vụ về:\n"
        "📦 Chăm sóc khách hàng (CSKH)\n"
        "📊 Kế toán (Accounting)\n"
        "🏭 Sản xuất (Production)\n"
        "📢 Marketing (Marketing)\n\n"
        "Hãy thêm tôi vào nhóm hoặc trò chuyện trực tiếp để tôi được hỗ trợ nhé!"
    )
    await context.bot.send_message(chat_id=update.effective_chat.id, text=welcome_text)

async def link(update: Update, context: ContextTypes.DEFAULT_TYPE):
    logger.info(f"Yêu cầu /link từ user: {update.effective_user.id}")
    user = update.effective_user
    if not user:
        return
    
    # Sử dụng FRONTEND_URL từ Settings (được cấu hình trong .env)
    frontend_url = settings.FRONTEND_URL
    link_url = f"{frontend_url}/?telegram_id={user.id}"
    
    msg = (
        "🔗 <b>Liên kết tài khoản hệ thống</b>\n\n"
        "Để tôi có thể biết bạn là ai và hỗ trợ tốt nhất, hãy sử dụng liên kết cá nhân bên dưới để đồng bộ tài khoản:\n\n"
        f"🌐 <b>Liên kết:</b> {link_url}\n\n"
        "<i>Lưu ý: Click vào liên kết trên để đăng nhập. Vui lòng không chia sẻ liên kết này cho người khác.</i>"
    )
    
    await context.bot.send_message(
        chat_id=update.effective_chat.id, 
        text=msg, 
        parse_mode="HTML"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    help_text = (
        "📖 <b>Hướng dẫn sử dụng AI Business Agent</b>\n\n"
        "Tôi là trợ lý AI thông minh hỗ trợ vận hành doanh nghiệp. Các lệnh khả dụng:\n\n"
        "🔹 /start - Bắt đầu tương tác và nhận lời chào.\n"
        "🔹 /link - Liên kết tài khoản hệ thống của bạn để đồng bộ dữ liệu.\n"
        "🔹 /help - Hiển thị hướng dẫn này.\n\n"
        "Bạn có thể nhắn tin trực tiếp hoặc nhắc tên tôi trong nhóm để hỏi về:\n"
        "✅ Kiểm tra trạng thái đơn hàng (Tracking #...)\n"
        "✅ Báo cáo doanh thu, kế toán.\n"
        "✅ Sáng tạo nội dung Marketing, SEO.\n"
        "✅ Tóm tắt tin nhắn trong nhóm Telegram."
    )
    await context.bot.send_message(chat_id=update.effective_chat.id, text=help_text, parse_mode="HTML")

async def track_chat_member(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Theo dõi khi bot được thêm vào nhóm hoặc có sự thay đổi member.
    """
    result = update.my_chat_member or update.chat_member
    if not result:
        return

    chat = result.chat
    new_member = result.new_chat_member
    if not new_member:
        return

    # Lưu thông tin nhóm
    await mongodb.db.telegram_groups.update_one(
        {"chat_id": chat.id},
        {
            "$set": {
                "title": chat.title,
                "type": chat.type,
                "updated_at": datetime.datetime.utcnow()
            }
        },
        upsert=True
    )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Xử lý tin nhắn văn bản và chuyển qua orchestrator.
    """
    user = update.effective_user
    message = update.effective_message
    chat = update.effective_chat
    
    if not message or not message.text:
        return

    # Kiểm tra xem có nhắc đến bot trong nhóm không, hoặc là chat private
    bot_username = context.bot.username
    is_private = chat.type == "private"
    is_mentioned = bot_username and f"@{bot_username}" in message.text

    if is_private or is_mentioned:
        # Lọc bỏ username của bot ra khỏi câu hỏi để AI không bị nhiễu
        user_text = message.text.replace(f"@{bot_username}", "").strip() if bot_username else message.text
        
        if user_text:
            # Lấy role người dùng dựa vào telegram_id
            db_user = await mongodb.db.users.find_one({"telegram_id": str(user.id)}) if user else None
            user_role = db_user.get("role", "user") if db_user else "user"
            username = db_user.get("username", user.username or f"telegram_{user.id}") if db_user else (user.username or f"telegram_{user.id}")

            # Phân tích ý định
            intent, tokens_intent = await orchestrator.classify_intent(user_text)

            # Gửi tin nhắn đến hệ thống AI Agent
            response_text = await orchestrator.process_request(user_text, intent, tokens_intent, user_role, username)
            await context.bot.send_message(chat_id=chat.id, text=response_text, reply_to_message_id=message.message_id)

def setup_telegram_bot():
    if not settings.TELEGRAM_BOT_TOKEN:
        logger.warning("Bỏ qua khởi tạo Telegram Bot: Thiếu TELEGRAM_BOT_TOKEN.")
        return None
        
    application = ApplicationBuilder().token(settings.TELEGRAM_BOT_TOKEN).build()
    
    async def post_init(app):
        await app.bot.set_my_commands([
            BotCommand("start", "Bắt đầu tương tác với Bot"),
            BotCommand("link", "Liên kết tài khoản hệ thống"),
            BotCommand("help", "Xem hướng dẫn sử dụng")
        ])

    application.post_init = post_init
    
    # Handlers theo dõi thay đổi Group/Member
    application.add_handler(ChatMemberHandler(track_chat_member, ChatMemberHandler.MY_CHAT_MEMBER))
    application.add_handler(ChatMemberHandler(track_chat_member, ChatMemberHandler.CHAT_MEMBER))
    
    # Handlers nhận Command và Tin nhắn thường
    application.add_handler(CommandHandler('start', start))
    application.add_handler(CommandHandler('link', link))
    application.add_handler(CommandHandler('help', help_command))
    application.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_message))
    
    # Error handler
    application.add_error_handler(error_handler)
    
    return application

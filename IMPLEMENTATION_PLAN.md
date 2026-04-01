# Implementation Plan - AI Business Agent System (v3)

Hệ thống Agent AI đa kênh (Omnichannel) hỗ trợ Web Chat, CLI và Telegram, sử dụng Python/FastAPI, MongoDB, Docker và Claude Haiku.

## User Review Required

> [!IMPORTANT]
> - **Frontend**: Giao diện Web Chat hiện đại, chuẩn UI/UX cao cấp (Glassmorphism, mượt mà).
> - **Telegram**: Tích hợp qua Telegram Bot API (cần Telegram Token).
> - **Đa kênh (Omnichannel)**: Một bộ não AI xử lý yêu cầu từ Web, CLI và Telegram đồng bộ.
> - **Docker**: Quản lý toàn bộ hệ sinh thái (API, DB, Frontend).

## Proposed Changes

### 1. Project structure [NEW]

- `backend/`: FastAPI server + Telegram handlers.
    - `app/bots/`: Logic xử lý Telegram Bot.
    - `app/agents/`: Kỹ năng CSKH, Kế toán, Sản xuất.
- `frontend/`: Giao diện React (Vite).
    - Chat UI mượt mà, hỗ trợ Markdown, Code highlight.
- `cli/`: Công cụ dòng lệnh Python.
- `docker-compose.yml`: Services `api`, `frontend`, `db`.

---

### 2. Frontend Component (React + CSS)

#### [NEW] `frontend/src/App.tsx`
- Chat interface tinh tế: Sidebar quản lý lịch sử, cửa sổ chat trung tâm.
- Hiệu ứng animation khi bot đang trả lời (Typing effect).

---

### 3. Telegram Integration

#### [NEW] `backend/app/bots/telegram.py`
- Tích hợp `python-telegram-bot`.
- Webhook handle tin nhắn và chuyển hướng đến Agent tương ứng.

---

### 4. Backend Enhancements

#### [NEW] `app/core/router.py`
- Router thông minh: Tự động phân loại tin nhắn từ kênh nào để trả về định dạng phù hợp (Markdown cho Web, Plain text/Button cho Telegram).

---

## Open Questions

- **Telegram Token**: Bạn đã có bot trên @BotFather chưa?
- **Mock Data**: Tôi sẽ tạo một bộ dữ liệu mẫu trong MongoDB (Sản phẩm, Đơn hàng, Số liệu kế toán) để bạn có thể thấy bot "làm việc" thật ngay lập tức. Bạn đồng ý chứ?

## Verification Plan

### Automated Tests
- Kiểm tra Endpoint Webhook của Telegram bằng Mock request.

### Manual Verification
1. Chạy `docker-compose up -d`.
2. Truy cập `http://localhost:3000` để bắt đầu Chat.
3. Mở Telegram và nhắn tin cho Bot -> Bot phải trả lời đồng bộ.
4. Sử dụng CLI để kiểm tra trạng thái hệ thống.


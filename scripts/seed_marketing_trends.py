import asyncio
import datetime
from app.db.mongodb import mongodb
from app.core.config import settings

async def seed_niches():
    await mongodb.connect()
    
    niches = [
        {
            "niche": "AI-Personalized Pet Portraits",
            "growth": "+45%",
            "status": "viral",
            "description": "Sử dụng AI biến hình ảnh thú cưng của khách thành tác phẩm nghệ thuật (Renaissance, Cartoon) trên Canvas/Blanket.",
            "updated_at": datetime.datetime.utcnow()
        },
        {
            "niche": "Pickleball Community Merch",
            "growth": "+32%",
            "status": "trending",
            "description": "Các thiết kế hài hước, năng động cho người chơi Pickleball - môn thể thao đang bùng nổ tại Mỹ.",
            "updated_at": datetime.datetime.utcnow()
        },
        {
            "niche": "Digital Nomad Lifestyle",
            "growth": "+22%",
            "status": "growing",
            "description": "Content tập trung vào sự tự do, làm việc từ xa, các thiết kế minimalist trên áo và phu kiện công nghệ.",
            "updated_at": datetime.datetime.utcnow()
        },
        {
            "niche": "Identity: Nursing & OT Gifts",
            "growth": "+15%",
            "status": "stable",
            "description": "Thị trường ngách cho Y tá và Kỹ thuật viên (Occupational Therapist) với các thông điệp cảm xúc, tự hào nghề nghiệp.",
            "updated_at": datetime.datetime.utcnow()
        },
        {
            "niche": "Eco-Minimalist Home Decor",
            "growth": "+28%",
            "status": "trending",
            "description": "Tranh treo tường và đồ trang trí nhà cửa với phong cách tối giản, sử dụng màu sắc trung tính (Earth tones).",
            "updated_at": datetime.datetime.utcnow()
        }
    ]
    
    # Xóa dữ liệu cũ nếu muốn làm mới hoàn toàn
    await mongodb.db.trending_niches.delete_many({})
    # Chèn dữ liệu mới
    await mongodb.db.trending_niches.insert_many(niches)
    
    print(f"Successfully seeded {len(niches)} real-time niches for April 2026!")
    await mongodb.disconnect()

if __name__ == "__main__":
    asyncio.run(seed_niches())

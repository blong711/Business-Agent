from typing import Dict, Any, Optional
import datetime
from ..db.mongodb import mongodb

class AttendanceService:
    """
    Service quản lý dữ liệu chấm công. 
    Hiện tại lấy từ DB, dễ dàng nâng cấp lên gọi API bên thứ 3.
    """
    
    @staticmethod
    async def get_attendance(username: str, month: int, year: int) -> Dict[str, Any]:
        # Giả lập gọi API hoặc truy vấn DB
        # Trong tương lai, bạn có thể thay nội dung hàm này bằng:
        # async with httpx.AsyncClient() as client:
        #     res = await client.get(f"https://api.payroll.com/v1/attendance?user={username}&month={month}")
        #     return res.json()
        
        # Hiện tại: Lấy từ collection attendance
        record = await mongodb.db.attendance.find_one({
            "username": {"$regex": f"^{username}$", "$options": "i"},
            "month": month,
            "year": year
        })
        
        if record:
            return {
                "working_days": record.get("working_days", 0),
                "holiday_days": record.get("holiday_days", 0),
                "standard_days": record.get("standard_days", 24) # Mặc định 24 như mẫu
            }
        
        # Mặc định nếu không tìm thấy (giả định làm đủ)
        return {
            "working_days": 18,
            "holiday_days": 6,
            "standard_days": 24
        }

attendance_service = AttendanceService()

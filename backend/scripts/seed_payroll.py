import asyncio
import os
import sys
from datetime import datetime

# Thêm đường dẫn để import được app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.mongodb import mongodb

async def seed_data():
    await mongodb.connect()
    
    # -- 1. Dữ liệu NHÂN VIÊN (Lương hợp đồng & Phụ cấp) --
    # Dựa trên bảng của CÔNG TY TNHH CÔNG NGHỆ EXP
    employees = [
        {"name": "Đỗ Văn Khang", "username": "khang", "role": "admin", "position": "Giám đốc", "contract_salary": 16000000, "fuel_phone": 1000000, "other": 3000000, "meal": 730000, "team": "ECOM"},
        {"name": "Trần Gia Khiên", "username": "khien", "role": "user", "position": "NVKD", "contract_salary": 5680000, "fuel_phone": 500000, "other": 2000000, "meal": 730000, "team": "ECOM"},
        {"name": "Đinh Văn Hiếu", "username": "hieu", "role": "user", "position": "NVKD", "contract_salary": 5680000, "fuel_phone": 500000, "other": 2000000, "meal": 730000, "team": "DEV"},
        {"name": "Nguyễn Thị Thu Huyền", "username": "huyen_kd", "role": "user", "position": "NVKD", "contract_salary": 5680000, "fuel_phone": 500000, "other": 1000000, "meal": 730000, "team": "ECOM"},
        {"name": "Vũ Hùng Vương", "username": "vuong_kd", "role": "user", "position": "NVKD", "contract_salary": 5680000, "fuel_phone": 500000, "other": 1000000, "meal": 730000, "team": "FOX"},
        {"name": "Nguyễn Đức Vương", "username": "vuong_nv", "role": "user", "position": "NVPM", "contract_salary": 5200000, "fuel_phone": 500000, "other": 500000, "meal": 730000, "team": "AI"},
        {"name": "Trương Quang Linh", "username": "linh", "role": "user", "position": "NVPM", "contract_salary": 5200000, "fuel_phone": 500000, "other": 500000, "meal": 730000, "team": "DEV"},
    ]

    # -- 2. Dữ liệu CHẤM CÔNG (Tháng 02/2026) --
    attendance = [
        {"name": "Đỗ Văn Khang", "username": "khang", "month": 2, "year": 2026, "working_days": 18, "holiday_days": 6, "standard_days": 24},
        {"name": "Trần Gia Khiên", "username": "khien", "month": 2, "year": 2026, "working_days": 18, "holiday_days": 6, "standard_days": 24},
        {"name": "Đinh Văn Hiếu", "username": "hieu", "month": 2, "year": 2026, "working_days": 18, "holiday_days": 6, "standard_days": 24},
        {"name": "Nguyễn Đức Vương", "username": "vuong_nv", "month": 2, "year": 2026, "working_days": 14, "holiday_days": 6, "standard_days": 24},
        {"name": "Trương Quang Linh", "username": "linh", "month": 2, "year": 2026, "working_days": 16, "holiday_days": 6, "standard_days": 24},
    ]

    # Clear old data
    await mongodb.db.employees.delete_many({})
    await mongodb.db.attendance.delete_many({})

    if employees:
        await mongodb.db.employees.insert_many(employees)
    if attendance:
        await mongodb.db.attendance.insert_many(attendance)

    print(f"--- [SEED] Đã nạp {len(employees)} nhân viên và {len(attendance)} bản ghi chấm công. ---")
    await mongodb.disconnect()

if __name__ == "__main__":
    asyncio.run(seed_data())

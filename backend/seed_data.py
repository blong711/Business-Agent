import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://mongodb:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "ai_business_db")

async def seed_data():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    await db.products.delete_many({})
    await db.orders.delete_many({})
    await db.accounting.delete_many({})
    await db.employees.delete_many({})
    await db.attendance.delete_many({})
    await db.users.delete_many({})

    products = [
        {"id": "SP001", "name": "Laptop Thinkpad T14", "price": 25000000, "stock": 10},
        {"id": "SP002", "name": "Chuột không dây Logitech", "price": 500000, "stock": 50},
        {"id": "SP003", "name": "Bàn phím cơ Keychron", "price": 1500000, "stock": 20},
    ]

    orders = [
        {"id": "DH1001", "customer": "Nguyễn Văn A", "status": "Shipped", "total": 25000000, "items": ["SP001"]},
        {"id": "DH1002", "customer": "Trần Thị B", "status": "Pending", "total": 2000000, "items": ["SP002", "SP003"]},
    ]

    accounting = [
        {"month": "2024-03", "revenue": 150000000, "expense": 100000000, "profit": 50000000},
        {"month": "2024-04", "revenue": 180000000, "expense": 120000000, "profit": 60000000},
    ]

    employees = [
        {"emp_id": "NV01", "name": "Nguyễn Văn A", "base_salary": 15000000, "position": "Developer"},
        {"emp_id": "NV02", "name": "Trần Thị B", "base_salary": 12000000, "position": "Marketing"},
        {"emp_id": "NV03", "name": "Lê Văn C", "base_salary": 8000000, "position": "Thực tập sinh"},
    ]

    attendance = [
        {"emp_id": "NV01", "month": "2024-04", "work_days": 22, "allowance": 1000000, "deduction": 0},
        {"emp_id": "NV02", "month": "2024-04", "work_days": 20, "allowance": 500000, "deduction": 200000},
        {"emp_id": "NV03", "month": "2024-04", "work_days": 15, "allowance": 0, "deduction": 0},
        {"emp_id": "NV01", "month": "2024-05", "work_days": 21, "allowance": 1000000, "deduction": 0},
    ]

    await db.products.insert_many(products)
    await db.orders.insert_many(orders)
    await db.accounting.insert_many(accounting)
    await db.employees.insert_many(employees)
    await db.attendance.insert_many(attendance)

    import hashlib
    def hash_password(password: str) -> str:
        return hashlib.sha256(password.encode()).hexdigest()

    users = [
        {
            "username": "admin",
            "password": hash_password("admin123"),
            "role": "admin",
            "telegram_id": "123456789", # Thay bằng ID thật để test
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "username": "testuser",
            "password": hash_password("user123"),
            "role": "user",
            "telegram_id": "987654321", # Thay bằng ID thật để test
            "created_at": "2024-01-01T00:00:00Z"
        }
    ]
    await db.users.insert_many(users)

    print("✅ Seed data with HR/Accounting successfully inserted!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())

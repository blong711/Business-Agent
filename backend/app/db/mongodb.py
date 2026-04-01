from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect(self):
        self.client = AsyncIOMotorClient(settings.MONGODB_URL)
        self.db = self.client[settings.DATABASE_NAME]
        logger.info(f"Đã kết nối MongoDB: {settings.MONGODB_URL}")

    async def disconnect(self):
        if self.client:
            self.client.close()
            logger.info("Đã ngắt kết nối MongoDB.")

mongodb = MongoDB()

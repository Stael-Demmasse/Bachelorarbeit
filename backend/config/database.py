from motor.motor_asyncio import AsyncIOMotorClient
from .settings import MONGO_URL, DB_NAME
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    database = None

# Global database instance
db_instance = Database()

async def connect_to_mongo():
    """Create database connection"""
    try:
        db_instance.client = AsyncIOMotorClient(MONGO_URL)
        db_instance.database = db_instance.client[DB_NAME]
        logger.info("Connected to MongoDB")
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    try:
        if db_instance.client:
            db_instance.client.close()
            logger.info("Disconnected from MongoDB")
    except Exception as e:
        logger.error(f"Error disconnecting from MongoDB: {e}")

def get_database():
    """Get database instance"""
    return db_instance.database
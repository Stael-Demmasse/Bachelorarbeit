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
        # Test the connection
        await db_instance.client.admin.command('ping')
        logger.info("Connected to MongoDB")
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        # Don't raise the exception to allow the app to start
        # The connection will be retried when needed
        pass

async def close_mongo_connection():
    """Close database connection"""
    try:
        if db_instance.client:
            db_instance.client.close()
            logger.info("Disconnected from MongoDB")
    except Exception as e:
        logger.error(f"Error disconnecting from MongoDB: {e}")

async def get_database():
    """Get database instance with reconnection logic for serverless environment"""
    # Always create a fresh connection for serverless functions
    try:
        # Create a new client for each request in serverless environment
        client = AsyncIOMotorClient(MONGO_URL)
        database = client[DB_NAME]
        # Test the connection
        await client.admin.command('ping')
        return database
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        return None
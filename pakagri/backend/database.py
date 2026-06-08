"""
MongoDB Async Connection using Motor
Database and collection management for PakAgri.
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import ConnectionFailure
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment variables with defaults
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "pakagri_db"

# Global client and database
client: Optional[AsyncIOMotorClient] = None
database: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongo() -> None:
    """
    Connect to MongoDB server.
    Called during FastAPI startup event.
    """
    global client, database

    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        database = client[DATABASE_NAME]

        # Test connection
        await client.admin.command('ping')
        logger.info(f"[MongoDB] Connected successfully to {MONGODB_URL}")

        # Create indexes for better performance
        await create_indexes()

    except ConnectionFailure as e:
        logger.error(f"[MongoDB] Connection failed: {e}")
        raise e


async def close_mongo_connection() -> None:
    """
    Close MongoDB connection.
    Called during FastAPI shutdown event.
    """
    global client

    if client:
        client.close()
        logger.info("[MongoDB] Connection closed")


async def create_indexes() -> None:
    """
    Create indexes for better query performance.
    """
    if database is None:
        return

    try:
        # Users collection - unique email index
        await database.users.create_index("email", unique=True)

        # Predictions collection - user_email index for history queries
        await database.predictions.create_index("user_email")
        await database.predictions.create_index("timestamp")

        # Compound index for user history
        await database.predictions.create_index([
            ("user_email", 1),
            ("timestamp", -1)
        ])

        logger.info("[MongoDB] Indexes created successfully")

    except Exception as e:
        logger.warning(f"[MongoDB] Index creation warning: {e}")


def get_database() -> AsyncIOMotorDatabase:
    """
    Get database instance.
    Raises error if not connected.
    """
    if database is None:
        raise RuntimeError("Database not connected. Call connect_to_mongo() first.")
    return database


# Collection shortcuts
def get_users_collection():
    """Get users collection."""
    return get_database().users


def get_predictions_collection():
    """Get predictions collection."""
    return get_database().predictions


def get_metrics_collection():
    """Get model_metrics collection."""
    return get_database().model_metrics


# Named exports for convenience
users_collection = property(lambda self: get_users_collection())
predictions_collection = property(lambda self: get_predictions_collection())
metrics_collection = property(lambda self: get_metrics_collection())

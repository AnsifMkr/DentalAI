# database.py
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load .env from project root
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME", "dental_ai")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

async def close_db_client():
    client.close()

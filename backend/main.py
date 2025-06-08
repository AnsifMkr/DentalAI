# main.py
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import close_db_client
from routers import auth, patients, appointments, notifications, chat

app = FastAPI(title="AI Patient Assistant", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "DentalAI backend is running"}

# Include routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(appointments.router)
app.include_router(notifications.router)
app.include_router(chat.router)

# CORS (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Health check endpoint (optional)
@app.get("/api/health")
async def health_check():
    from datetime import datetime
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Shutdown event
@app.on_event("shutdown")
async def on_shutdown():
    await close_db_client()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

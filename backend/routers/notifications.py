# routers/notifications.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List

from database import db
from models import NotificationOut, UserRole
from dependencies import get_current_user, require_role
from models import UserInDB

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.get("/", response_model=List[NotificationOut])
async def get_notifications(current_user: UserInDB = Depends(require_role(UserRole.DOCTOR))):
    cursor = db.notifications.find().sort("created_at", -1).limit(50)
    results = await cursor.to_list(length=50)
    return [NotificationOut(**doc) for doc in results]

@router.put("/{notif_id}/read")
async def mark_read(
    notif_id: str,
    current_user: UserInDB = Depends(require_role(UserRole.DOCTOR))
):
    result = await db.notifications.update_one({"id": notif_id}, {"$set": {"read": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification marked as read"}

# routers/appointments.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from database import db
from models import (
    AppointmentCreate,
    AppointmentOut,
    AppointmentInDB,
    AppointmentUpdate,
    UserRole
)
from dependencies import get_current_user, require_role
from models import UserInDB

router = APIRouter(prefix="/api/appointments", tags=["appointments"])

@router.post("/", response_model=AppointmentOut)
async def create_appointment(
    appointment: AppointmentCreate,
    current_user: UserInDB = Depends(require_role(UserRole.PATIENT))
):
    data = appointment.dict()
    data["patient_id"] = current_user.id
    data["patient_name"] = current_user.full_name or current_user.username
    data["patient_email"] = current_user.email

    new_app = AppointmentInDB(**data)
    await db.appointments.insert_one(new_app.dict())

    # Create a notification for all doctors
    notification = {
        "id": str(new_app.id),  # or uuid4
        "type": "new_appointment",
        "message": f"New appointment from {data['patient_name']}",
        "appointment_id": new_app.id,
        "patient_name": data["patient_name"],
        "appointment_date": data["appointment_date"],
        "appointment_time": data["appointment_time"],
        "created_at": new_app.created_at,
        "read": False,
    }
    await db.notifications.insert_one(notification)

    return new_app

@router.get("/", response_model=List[AppointmentOut])
async def list_appointments(current_user: UserInDB = Depends(get_current_user)):
    if current_user.role == UserRole.DOCTOR:
        cursor = db.appointments.find().sort("created_at", -1)
    else:
        cursor = db.appointments.find({"patient_id": current_user.id}).sort("created_at", -1)

    results = await cursor.to_list(length=1000)
    return [AppointmentOut(**doc) for doc in results]

@router.put("/{app_id}", response_model=AppointmentOut)
async def update_appointment(
    app_id: str,
    app_update: AppointmentUpdate,
    current_user: UserInDB = Depends(require_role(UserRole.DOCTOR))
):
    existing = await db.appointments.find_one({"id": app_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Appointment not found")

    update_data = app_update.dict()
    update_data["doctor_id"] = current_user.id
    await db.appointments.update_one({"id": app_id}, {"$set": update_data})

    updated = await db.appointments.find_one({"id": app_id})
    return AppointmentOut(**updated)

# routers/patients.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from database import db
from models import PatientCreate, PatientOut, PatientInDB, UserRole
from dependencies import get_current_user, require_role
from models import UserInDB

router = APIRouter(prefix="/api/patients", tags=["patients"])

@router.post("/", response_model=PatientOut)
async def create_patient(
    patient: PatientCreate,
    current_user: UserInDB = Depends(require_role(UserRole.DOCTOR))
):
    data = patient.dict()
    data["created_by"] = current_user.id
    new_patient = PatientInDB(**data)
    await db.patients.insert_one(new_patient.dict())
    return new_patient

@router.get("/", response_model=List[PatientOut])
async def list_patients(current_user: UserInDB = Depends(get_current_user)):
    if current_user.role == UserRole.DOCTOR:
        cursor = db.patients.find().sort("created_at", -1)
    else:
        cursor = db.patients.find({"email": current_user.email})
    results = await cursor.to_list(length=1000)
    return [PatientOut(**doc) for doc in results]

@router.get("/{patient_id}", response_model=PatientOut)
async def get_patient(
    patient_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    doc = await db.patients.find_one({"id": patient_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Patient not found")

    if current_user.role == UserRole.PATIENT and doc["email"] != current_user.email:
        raise HTTPException(status_code=403, detail="Access denied")

    return PatientOut(**doc)

@router.put("/{patient_id}", response_model=PatientOut)
async def update_patient(
    patient_id: str,
    patient_update: PatientCreate,
    current_user: UserInDB = Depends(require_role(UserRole.DOCTOR))
):
    existing = await db.patients.find_one({"id": patient_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Patient not found")

    await db.patients.update_one({"id": patient_id}, {"$set": patient_update.dict()})
    updated = await db.patients.find_one({"id": patient_id})
    return PatientOut(**updated)

@router.delete("/{patient_id}")
async def delete_patient(
    patient_id: str,
    current_user: UserInDB = Depends(require_role(UserRole.DOCTOR))
):
    result = await db.patients.delete_one({"id": patient_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"message": "Patient deleted successfully"}

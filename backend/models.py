# models.py
import uuid
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional

# Enumerations
class UserRole(str, Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"

class AppointmentStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

# User-related schemas
class UserBase(BaseModel):
    username: str
    email: str
    role: UserRole
    full_name: Optional[str] = ""

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserInDB(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_role: UserRole
    user_id: str

# Patient-related schemas
class PatientBase(BaseModel):
    name: str
    email: str
    phone: str
    date_of_birth: str
    medical_notes: Optional[str] = ""
    last_visit: Optional[str] = ""

class PatientCreate(PatientBase):
    pass  # same fields as base

class PatientInDB(PatientBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PatientOut(PatientInDB):
    pass  # identical, can return all fields

# Appointment-related schemas
class AppointmentBase(BaseModel):
    appointment_date: str
    appointment_time: str
    reason: str
    notes: Optional[str] = ""

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    status: AppointmentStatus
    doctor_id: Optional[str] = None
    notes: Optional[str] = ""

class AppointmentInDB(AppointmentBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    patient_name: str
    patient_email: str
    doctor_id: Optional[str] = None
    status: AppointmentStatus = AppointmentStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AppointmentOut(AppointmentInDB):
    pass

# Notification schemas
class NotificationInDB(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str              # e.g., "new_appointment"
    message: str
    appointment_id: str
    patient_name: str
    appointment_date: str
    appointment_time: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read: bool = False

class NotificationOut(NotificationInDB):
    pass

# Chat schemas
class ChatMessage(BaseModel):
    message: str
    patient_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

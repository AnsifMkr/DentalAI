# routers/chat.py
from fastapi import APIRouter, Depends
import logging

from database import db
from dependencies import get_current_user
from models import ChatMessage, ChatResponse, UserRole
from models import UserInDB
from utils import call_openai_chat

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/", response_model=ChatResponse)
async def chat_with_ai(
    chat: ChatMessage,
    current_user: UserInDB = Depends(get_current_user)
):
    # Build patient context if provided
    patient_context = ""
    if chat.patient_id:
        patient_doc = await db.patients.find_one({"id": chat.patient_id})
        if patient_doc:
            patient_context = f"""
Patient Context:
- Name: {patient_doc['name']}
- DOB: {patient_doc['date_of_birth']}
- Medical Notes: {patient_doc.get('medical_notes', 'None')}
- Last Visit: {patient_doc.get('last_visit', 'Not recorded')}
"""

    # Build system prompt based on role
    if current_user.role == UserRole.DOCTOR:
        system_prompt = f"""You are an AI dental assistant for healthcare professionals. Provide clinical insights, treatment recommendations, and professional guidance.

{patient_context}

- If you have patient context, reference it specifically.
"""
    else:
        system_prompt = f"""You are an AI dental assistant for patients. Provide empathetic, educational dental health tips (no diagnosis).

{patient_context}

- Always recommend consulting a dentist for medical concerns.
"""

    ai_content = await call_openai_chat(system_prompt, chat.message)
    if ai_content is None:
        # Fallback if OpenAI fails
        if current_user.role == UserRole.DOCTOR:
            fallback = f"I understand you asked: '{chat.message}'. As a clinical assistant, I suggest reviewing guidelines. How else can I assist?"
        else:
            fallback = f"I understand you asked: '{chat.message}'. For dental advice, consult your dentist. Meanwhile, here's a general tip: ..."

        return ChatResponse(response=fallback)

    return ChatResponse(response=ai_content)

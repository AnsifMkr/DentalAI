# routers/auth.py
from fastapi import APIRouter, HTTPException, status
from typing import Any

from database import db
from models import UserCreate, UserInDB, TokenResponse
from utils import get_password_hash, verify_password, create_access_token
from models import UserLogin, UserRole

router = APIRouter(prefix="/api", tags=["auth"])

@router.post("/register", response_model=Any)
async def register_user(user: UserCreate):
    # Check existing username/email
    existing = await db.users.find_one({
        "$or": [{"username": user.username}, {"email": user.email}]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    hashed = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed
    del user_dict["password"]

    new_user = UserInDB(**user_dict)
    await db.users.insert_one(new_user.dict())
    return {"message": "User registered successfully", "role": new_user.role}

@router.post("/login", response_model=TokenResponse)
async def login_user(user: UserLogin):
    db_user = await db.users.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Use MongoDB's _id and convert to string
    user_id = str(db_user.get("_id", db_user.get("id", "")))
    access_token = create_access_token(
        data={
            "sub": user.username,
            "role": db_user["role"],
            "user_id": user_id,
        }
    )
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user_role=db_user["role"],
        user_id=user_id,
    )
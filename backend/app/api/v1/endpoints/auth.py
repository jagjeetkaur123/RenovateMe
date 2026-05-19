from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta

from app.core.database import get_db
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.user import User
from app.models.tradesperson import Tradesperson # Tradesperson model import
from app.models.business import Business # Business model import
from app.schemas.user import UserCreate, UserResponse, Token

router = APIRouter(tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # 1. Check agar email already exists hai
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Naya User create karo
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role
    )
    db.add(new_user)
    await db.flush()  # ID generate karne ke liye flush use karein

    # 3. Role ke basis par Tradesperson ya Business table mein entry
    if user_in.role == "tradesperson":
        new_tradie = Tradesperson(user_id=new_user.id)
        db.add(new_tradie)
    elif user_in.role == "business_owner":
        new_biz = Business(owner_id=new_user.id)
        db.add(new_biz)

    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login")
async def login(db: AsyncSession = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # 1. User ko email se find karein
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()

    # 2. Password check karein
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # 3. Token generate karein jisme role include ho
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "name": user.name
        }
    }
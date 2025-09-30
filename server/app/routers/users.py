from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from app.database import get_session
from app.models.user import User
from app.schemas.user import UserRead, UserCreate
from app.auth.deps import get_admin_user
from app.auth.core import hash_pw

router = APIRouter()

@router.get("/userTable", response_model=List[UserRead])
async def list_users(db: AsyncSession = Depends(get_session), admin: User = Depends(get_admin_user)):
    result = await db.execute(select(User))
    return result.scalars().all()

@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: str, db: AsyncSession = Depends(get_session), admin: User = Depends(get_admin_user)):
    user_id = UUID(user_id)
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/adduser", response_model=UserRead)
async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_session), admin: User = Depends(get_admin_user)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalar():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_pw(user_in.password)
    user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=hashed_password
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

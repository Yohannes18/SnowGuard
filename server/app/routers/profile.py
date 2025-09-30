from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models.user import User
from app.schemas.user import UserRead
from app.auth.deps import get_active_user
from app.auth.core import hash_pw

router = APIRouter()

@router.get("/me", response_model=UserRead)
async def get_profile(current_user: User = Depends(get_active_user)):
    return current_user

@router.put("/me", response_model=UserRead)
async def update_profile(
    username: str | None = None,
    email: str | None = None,
    password: str | None = None,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_active_user)
):
    if username:
        current_user.username = username
    if email:
        current_user.email = email
    if password:
        current_user.hashed_password = hash_pw(password)
    
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user

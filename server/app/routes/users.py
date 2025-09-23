from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.auth import current_active_user
from app.utils.password_helper import PasswordHelper

router = APIRouter(prefix="/users", tags=["Users"])

password_helper = PasswordHelper()  

@router.get("/me", response_model=UserRead)
async def read_current_user(user: User = Depends(current_active_user)):
    return user

@router.put("/me", response_model=UserRead)
async def update_current_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    if user_update.email:
        user.email = user_update.email
    if user_update.username:
        user.username = user_update.username
    if user_update.password:
        user.hashed_password = password_helper.hash(user_update.password) 

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.auth import current_active_user
from app.utils.password_helper import PasswordHelper

router = APIRouter(prefix="/super-secret-admin-8923/users", tags=["Admin Users"])
password_helper = PasswordHelper()
# admin check
def admin_user(user: User = Depends(current_active_user)):
    if not user.is_superuser:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user

@router.get("/", response_model=List[UserRead])
async def list_users(db: Session = Depends(get_db), admin: User = Depends(admin_user)):
    return db.query(User).all()

@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: str, db: Session = Depends(get_db), admin: User = Depends(admin_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(user_in: UserCreate, db: Session = Depends(get_db), admin: User = Depends(admin_user)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = password_helper.hash(user_in.password)
    user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=hashed_password
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.put("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.email:
        user.email = user_update.email
    if user_update.username:
        user.username = user_update.username
    if user_update.password:
        user.hashed_password = password_helper.hash(user_update.password)
    if user_update.is_active is not None:
        user.is_active = user_update.is_active
    if user_update.is_superuser is not None:
        user.is_superuser = user_update.is_superuser

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

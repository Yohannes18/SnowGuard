from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from app.database import get_session
from app.models.user import User
from app.auth.core import hash_pw, verify_pw, create_access_token
from app.auth.deps import get_active_user
from app.schemas.user import UserRead

router = APIRouter()

# Request body for login
class LoginRequest(BaseModel):
    username: str
    password: str

# Request body for register
class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str

# Response token
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    is_admin: bool

# ----------------------
# REGISTER
# ----------------------
@router.post("/register", response_model=TokenResponse)
async def register_user(data: RegisterRequest, db: AsyncSession = Depends(get_session)):
    # Check if username/email exists
    result = await db.execute(select(User).where(User.username == data.username))
    if result.scalar():
        raise HTTPException(status_code=400, detail="Username already taken")

    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_pw(data.password)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Auto-login: create token
    token = create_access_token({"sub": new_user.username, "is_admin": new_user.is_superuser})
    return {"access_token": token, "token_type": "bearer", "is_admin": new_user.is_superuser}


# ----------------------
# LOGIN
# ----------------------
@router.post("/token", response_model=TokenResponse)
async def login_user(data: LoginRequest, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).where(User.username == data.username))
    user = result.scalar_one_or_none()

    if not user or not verify_pw(data.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": user.username, "is_admin": user.is_superuser})
    return {"access_token": token, "token_type": "bearer", "is_admin": user.is_superuser}

@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_active_user)):
    return current_user
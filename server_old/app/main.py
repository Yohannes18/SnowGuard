from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import get_async_session
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.authentication.core import hash_password, verify_password, create_access_token
from app.authentication.deps import get_active_user, get_admin_user

app = FastAPI(title="SnowGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://snowguard.app", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register", response_model=UserRead)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(User).where(User.username == user.username))
    if result.scalar_one_or_none():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Username already taken")

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@app.post("/auth/jwt/login", response_model=dict)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(User).where(User.username == form_data.username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_active_user)):
    return current_user

@app.get("/admin", response_model=UserRead)
async def admin_area(current_user: User = Depends(get_admin_user)):
    return current_user

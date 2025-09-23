from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import fastapi_users, auth_backend
from app.schemas.user import UserCreate, UserRead, UserUpdate

# Routers
from app.routes import analysis, users, admin_users  # admin_users.py contains admin-only routes

app = FastAPI(title="SnowGuard API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://snowguard.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FastAPI Users authentication ---
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

# --- Regular user routes ---
app.include_router(users.router, prefix="/users", tags=["Users"])

# --- Admin routes with secret prefix for security ---
app.include_router(admin_users.router, prefix="/admin/7f2b9c", tags=["Admin Users"])

# --- Analyzer routes ---
app.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])

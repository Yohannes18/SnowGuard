from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, profile, analysis

app = FastAPI(
    title="SnowGuard API",
    description="Backend for SnowGuard frontend",
    version="1.0.0"
)

# -----------------------
# CORS (frontend integration)
# -----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000", "http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Include Routers
# -----------------------
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])
app.include_router(analysis.router, prefix="/analysis", tags=["analysis"])

# -----------------------
# Root endpoint
# -----------------------
@app.get("/")
async def root():
    return {"message": "SnowGuard API is running"}

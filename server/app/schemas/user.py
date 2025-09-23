from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserRead(BaseModel):
    id: str
    email: str
    username: str
    is_active: bool
    is_superuser: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    
    class Config:
        from_attributes = True



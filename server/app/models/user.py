from sqlalchemy import Column, String, DateTime
from datetime import datetime
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID
from app.core.database import Base
from sqlalchemy.orm import relationship

class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    username = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")



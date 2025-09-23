from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from app.models.user import User
from app.core.database import SessionLocal

def get_user_db():
    db = SessionLocal()
    try:
        yield SQLAlchemyUserDatabase(db, User)
    finally:
        db.close()
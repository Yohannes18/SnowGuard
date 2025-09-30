from fastapi import Depends
from app.models.user import User
from app.fastapi_users_db_wrapper import SQLAlchemyUserDatabase
from app.core.database import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession

async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)

import uuid
from fastapi import Depends, Request
from fastapi_users.manager import BaseUserManager
from app.models.user import User
from app.db_.user_db import get_user_db
from app.fastapi_users_db_wrapper import SQLAlchemyUserDatabase
from app.core.config import settings
from fastapi_users import exceptions

SECRET = settings.secret_key
SECRET_PASS = settings.secret_key_pass

class UUIDIDMixin:
    """Mixin to ensure UUID parsing works consistently."""
    def parse_id(self, value: any) -> uuid.UUID:
        if isinstance(value, uuid.UUID):
            return value
        try:
            return uuid.UUID(value)
        except ValueError as e:
            raise exceptions.InvalidID() from e

class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = SECRET_PASS
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request: Request | None = None) -> None:
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(self, user: User, token: str, request: Request | None = None) -> None:
        print(f"User {user.id} requested password reset. Token: {token}")

    async def on_after_request_verify(self, user: User, token: str, request: Request | None = None) -> None:
        print(f"Verification requested for user {user.id}. Token: {token}")

async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)

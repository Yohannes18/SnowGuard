from fastapi_users import FastAPIUsers
from app.models.user import User
from app.db import get_user_db
from fastapi_users.authentication import JWTStrategy, AuthenticationBackend, BearerTransport
from app.core.config import settings

SECRET = settings.secret_key  # secure secret from settings

def get_jwt_strategy():
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, str](get_user_db, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)

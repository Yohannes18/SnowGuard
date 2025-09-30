import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

class Settings(BaseSettings):
    app_name: str = "SnowGuard"
    admin_email: str
    database_url: str
    secret_key: str
    secret_key_pass: str
    vite_api_url: str
    google_safebrowsing_api_key: str
    virustotal_api_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    debug: bool = True

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

settings = Settings()

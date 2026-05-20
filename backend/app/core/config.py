import logging
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator
from typing import List

logger = logging.getLogger(__name__)

_DEFAULT_SECRET = "dev-secret-key-change-in-production-min-32-chars"


class Settings(BaseSettings):
    # App
    APP_NAME: str = "SilverBricks Connect"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = _DEFAULT_SECRET
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://silverbricks:silverbricks_dev@localhost:5432/silverbricks"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    # File uploads
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 10

    # Email
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = "noreply@silverbricksconnect.com.au"
    EMAILS_FROM_NAME: str = "SilverBricks Connect"

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    # Firebase
    FIREBASE_CREDENTIALS_PATH: str = "./firebase-credentials.json"

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    @field_validator("SECRET_KEY")
    @classmethod
    def warn_default_secret(cls, v: str) -> str:
        if v == _DEFAULT_SECRET:
            logger.warning(
                "WARNING: Using default SECRET_KEY. Set SECRET_KEY env var before deploying to production."
            )
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters")
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

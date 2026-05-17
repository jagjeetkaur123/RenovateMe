from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
from typing import List


class Settings(BaseSettings):
    # App
    APP_NAME: str = "SilverBricks Connect"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production-min-32-chars"
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

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

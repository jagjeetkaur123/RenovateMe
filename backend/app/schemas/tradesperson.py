from pydantic import BaseModel
from datetime import datetime
from app.models.tradesperson import VerificationStatus


class TradespersonProfileCreate(BaseModel):
    bio: str | None = None
    abn: str | None = None
    license_number: str | None = None
    insurance_number: str | None = None
    categories: list[str] = []
    specialties: list[str] = []
    suburb: str | None = None
    state: str | None = None
    postcode: str | None = None
    service_radius_km: int = 20
    hire_now_enabled: bool = False


class TradespersonProfileUpdate(BaseModel):
    bio: str | None = None
    categories: list[str] | None = None
    specialties: list[str] | None = None
    suburb: str | None = None
    state: str | None = None
    postcode: str | None = None
    service_radius_km: int | None = None
    is_available: bool | None = None
    hire_now_enabled: bool | None = None


class TradespersonProfileOut(BaseModel):
    id: int
    user_id: int
    bio: str | None
    abn: str | None
    license_number: str | None
    categories: list[str]
    specialties: list[str]
    suburb: str | None
    state: str | None
    postcode: str | None
    service_radius_km: int
    rating: float
    trust_score: float
    total_jobs: int
    completion_rate: float
    verification_status: VerificationStatus
    is_available: bool
    hire_now_enabled: bool
    subscription_tier: str
    photo_urls: list[str]
    portfolio_urls: list[str]
    created_at: datetime

    model_config = {"from_attributes": True}

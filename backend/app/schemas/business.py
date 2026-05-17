from pydantic import BaseModel
from datetime import datetime
from app.models.business import BusinessCategory


class BusinessProfileCreate(BaseModel):
    business_name: str
    abn: str | None = None
    category: BusinessCategory
    description: str | None = None
    address: str | None = None
    suburb: str | None = None
    state: str | None = None
    postcode: str | None = None
    phone: str | None = None
    website: str | None = None
    business_hours: dict = {}
    cancellation_policy_hours: int = 24


class BusinessProfileUpdate(BaseModel):
    business_name: str | None = None
    description: str | None = None
    address: str | None = None
    suburb: str | None = None
    state: str | None = None
    postcode: str | None = None
    phone: str | None = None
    website: str | None = None
    business_hours: dict | None = None
    cancellation_policy_hours: int | None = None


class BusinessProfileOut(BaseModel):
    id: int
    user_id: int
    business_name: str
    abn: str | None
    category: BusinessCategory
    description: str | None
    logo_url: str | None
    address: str | None
    suburb: str | None
    state: str | None
    postcode: str | None
    phone: str | None
    website: str | None
    business_hours: dict
    rating: float
    total_bookings: int
    is_active: bool
    is_featured: bool
    verification_status: str
    subscription_tier: str
    photo_urls: list[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class ServiceCreate(BaseModel):
    name: str
    description: str | None = None
    duration_minutes: int = 60
    price: float


class ServiceOut(BaseModel):
    id: int
    business_id: int
    name: str
    description: str | None
    duration_minutes: int
    price: float
    is_active: bool

    model_config = {"from_attributes": True}


class StaffCreate(BaseModel):
    name: str
    title: str | None = None
    bio: str | None = None
    specialties: list[str] = []
    availability: dict = {}


class StaffOut(BaseModel):
    id: int
    business_id: int
    name: str
    title: str | None
    bio: str | None
    avatar_url: str | None
    specialties: list[str]
    is_active: bool

    model_config = {"from_attributes": True}

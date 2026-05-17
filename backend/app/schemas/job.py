from pydantic import BaseModel
from datetime import datetime
from app.models.job import JobStatus, JobUrgency


class JobCreate(BaseModel):
    title: str
    description: str
    category: str
    subcategory: str | None = None
    budget_min: float | None = None
    budget_max: float | None = None
    address: str | None = None
    suburb: str | None = None
    state: str | None = None
    postcode: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    preferred_date: datetime | None = None
    urgency: JobUrgency = JobUrgency.STANDARD


class JobUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    budget_min: float | None = None
    budget_max: float | None = None
    preferred_date: datetime | None = None
    urgency: JobUrgency | None = None
    status: JobStatus | None = None


class JobOut(BaseModel):
    id: int
    customer_id: int
    title: str
    description: str
    category: str
    subcategory: str | None
    budget_min: float | None
    budget_max: float | None
    suburb: str | None
    state: str | None
    postcode: str | None
    preferred_date: datetime | None
    urgency: JobUrgency
    status: JobStatus
    image_urls: list[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class JobListOut(BaseModel):
    items: list[JobOut]
    total: int
    page: int
    size: int

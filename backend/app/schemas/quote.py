from pydantic import BaseModel
from datetime import datetime
from app.models.quote import QuoteStatus


class QuoteCreate(BaseModel):
    job_id: int
    amount: float
    scope_notes: str | None = None
    timeline_days: int | None = None
    inclusions: list[str] = []
    exclusions: list[str] = []
    terms: str | None = None


class QuoteUpdate(BaseModel):
    amount: float | None = None
    scope_notes: str | None = None
    timeline_days: int | None = None


class QuoteRespond(BaseModel):
    status: QuoteStatus
    customer_message: str | None = None


class QuoteOut(BaseModel):
    id: int
    job_id: int
    tradesperson_id: int
    amount: float
    scope_notes: str | None
    timeline_days: int | None
    inclusions: list[str]
    exclusions: list[str]
    terms: str | None
    status: QuoteStatus
    customer_message: str | None
    created_at: datetime

    model_config = {"from_attributes": True}

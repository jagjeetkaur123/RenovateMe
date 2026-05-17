from pydantic import BaseModel
from datetime import datetime
from app.models.booking import BookingStatus


class BookingCreate(BaseModel):
    business_id: int
    service_id: int | None = None
    staff_id: int | None = None
    slot_datetime: datetime
    customer_notes: str | None = None


class BookingUpdate(BaseModel):
    slot_datetime: datetime | None = None
    status: BookingStatus | None = None
    business_notes: str | None = None


class BookingOut(BaseModel):
    id: int
    customer_id: int
    business_id: int
    service_id: int | None
    staff_id: int | None
    slot_datetime: datetime
    duration_minutes: int
    status: BookingStatus
    price: float | None
    deposit_amount: float | None
    deposit_paid: bool
    customer_notes: str | None
    created_at: datetime

    model_config = {"from_attributes": True}

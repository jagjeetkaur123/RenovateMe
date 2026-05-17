from pydantic import BaseModel, field_validator
from datetime import datetime


class ReviewCreate(BaseModel):
    rating: int
    comment: str | None = None
    target_tradesperson_id: int | None = None
    target_business_id: int | None = None
    booking_id: int | None = None
    job_id: int | None = None

    @field_validator("rating")
    @classmethod
    def valid_rating(cls, v: int) -> int:
        if not 1 <= v <= 5:
            raise ValueError("Rating must be between 1 and 5")
        return v


class ReviewRespond(BaseModel):
    response: str


class ReviewOut(BaseModel):
    id: int
    reviewer_id: int
    target_tradesperson_id: int | None
    target_business_id: int | None
    rating: int
    comment: str | None
    is_verified: bool
    response: str | None
    response_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}

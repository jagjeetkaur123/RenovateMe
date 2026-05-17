from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    reviewer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)

    # Target — either a tradesperson or a business (one must be set)
    target_tradesperson_id: Mapped[int | None] = mapped_column(
        ForeignKey("tradesperson_profiles.id"), nullable=True
    )
    target_business_id: Mapped[int | None] = mapped_column(
        ForeignKey("business_profiles.id"), nullable=True
    )

    # Linked booking or job (for verification)
    booking_id: Mapped[int | None] = mapped_column(ForeignKey("bookings.id"), nullable=True)
    job_id: Mapped[int | None] = mapped_column(ForeignKey("job_posts.id"), nullable=True)

    # Content
    rating: Mapped[int] = mapped_column(Integer)  # 1-5
    comment: Mapped[str | None] = mapped_column(Text)

    # Moderation
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_flagged: Mapped[bool] = mapped_column(Boolean, default=False)
    admin_note: Mapped[str | None] = mapped_column(Text)

    # Provider response
    response: Mapped[str | None] = mapped_column(Text)
    response_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    reviewer: Mapped["User"] = relationship(
        back_populates="reviews_given", foreign_keys=[reviewer_id]
    )
    tradesperson: Mapped["TradespersonProfile | None"] = relationship(
        back_populates="reviews_received", foreign_keys=[target_tradesperson_id]
    )
    business: Mapped["BusinessProfile | None"] = relationship(
        back_populates="reviews_received", foreign_keys=[target_business_id]
    )
    booking: Mapped["Booking | None"] = relationship(back_populates="review")

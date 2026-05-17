import enum
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, DateTime, ForeignKey, Boolean, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    RESCHEDULED = "rescheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("business_profiles.id"), index=True)
    service_id: Mapped[int | None] = mapped_column(ForeignKey("services.id"), nullable=True)
    staff_id: Mapped[int | None] = mapped_column(ForeignKey("staff_members.id"), nullable=True)

    # Booking time
    slot_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    duration_minutes: Mapped[int] = mapped_column(default=60)
    end_datetime: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Status
    status: Mapped[BookingStatus] = mapped_column(SAEnum(BookingStatus), default=BookingStatus.PENDING)

    # Financial
    price: Mapped[float | None] = mapped_column(Float)
    deposit_amount: Mapped[float | None] = mapped_column(Float)
    deposit_paid: Mapped[bool] = mapped_column(Boolean, default=False)

    # Notes
    customer_notes: Mapped[str | None] = mapped_column(Text)
    business_notes: Mapped[str | None] = mapped_column(Text)

    # Reminders
    reminder_sent: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    customer: Mapped["User"] = relationship(
        back_populates="bookings", foreign_keys=[customer_id]
    )
    business: Mapped["BusinessProfile"] = relationship(back_populates="bookings")
    service: Mapped["Service | None"] = relationship(back_populates="bookings")
    staff_member: Mapped["StaffMember | None"] = relationship(back_populates="bookings")
    review: Mapped["Review | None"] = relationship(back_populates="booking", uselist=False)

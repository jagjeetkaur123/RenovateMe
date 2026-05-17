import enum
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    TRADESPERSON = "tradesperson"
    BUSINESS_OWNER = "business_owner"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(20))
    hashed_password: Mapped[str | None] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), default=UserRole.CUSTOMER)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    tradesperson_profile: Mapped["TradespersonProfile"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    business_profile: Mapped["BusinessProfile"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    job_posts: Mapped[list["JobPost"]] = relationship(back_populates="customer")
    bookings: Mapped[list["Booking"]] = relationship(
        back_populates="customer", foreign_keys="Booking.customer_id"
    )
    reviews_given: Mapped[list["Review"]] = relationship(
        back_populates="reviewer", foreign_keys="Review.reviewer_id"
    )
    notifications: Mapped[list["Notification"]] = relationship(back_populates="user")

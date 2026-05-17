import enum
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, Boolean, DateTime, ForeignKey, JSON, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class TradeCategory(str, enum.Enum):
    HANDYMAN = "handyman"
    PLUMBING = "plumbing"
    ELECTRICAL = "electrical"
    RENOVATION = "renovation"
    CARPENTRY = "carpentry"
    CABINET_MAKING = "cabinet_making"
    CLEANING = "cleaning"
    PAINTING = "painting"
    LANDSCAPING = "landscaping"
    TILING_FLOORING = "tiling_flooring"
    SECURITY = "security"
    MOVING_TRANSPORT = "moving_transport"
    HEATING_COOLING = "heating_cooling"
    SPECIALIST = "specialist"


class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class TradespersonProfile(Base):
    __tablename__ = "tradesperson_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)

    # Profile details
    bio: Mapped[str | None] = mapped_column(Text)
    abn: Mapped[str | None] = mapped_column(String(11))
    license_number: Mapped[str | None] = mapped_column(String(100))
    insurance_number: Mapped[str | None] = mapped_column(String(100))

    # Categories and specialties (stored as JSON arrays)
    categories: Mapped[list] = mapped_column(JSON, default=list)
    specialties: Mapped[list] = mapped_column(JSON, default=list)

    # Location
    suburb: Mapped[str | None] = mapped_column(String(100))
    state: Mapped[str | None] = mapped_column(String(10))
    postcode: Mapped[str | None] = mapped_column(String(10))
    service_radius_km: Mapped[int] = mapped_column(default=20)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)

    # Metrics
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    trust_score: Mapped[float] = mapped_column(Float, default=0.0)
    total_jobs: Mapped[int] = mapped_column(default=0)
    completion_rate: Mapped[float] = mapped_column(Float, default=0.0)
    response_time_hours: Mapped[float] = mapped_column(Float, default=0.0)

    # Verification
    verification_status: Mapped[VerificationStatus] = mapped_column(
        SAEnum(VerificationStatus), default=VerificationStatus.PENDING
    )
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    hire_now_enabled: Mapped[bool] = mapped_column(Boolean, default=False)

    # Subscription
    subscription_tier: Mapped[str] = mapped_column(String(20), default="free")
    lead_credits: Mapped[int] = mapped_column(default=3)

    # Media
    photo_urls: Mapped[list] = mapped_column(JSON, default=list)
    portfolio_urls: Mapped[list] = mapped_column(JSON, default=list)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="tradesperson_profile")
    quotes: Mapped[list["Quote"]] = relationship(back_populates="tradesperson")
    reviews_received: Mapped[list["Review"]] = relationship(
        back_populates="tradesperson", foreign_keys="Review.target_tradesperson_id"
    )

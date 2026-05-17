import enum
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, Boolean, DateTime, ForeignKey, JSON, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class BusinessCategory(str, enum.Enum):
    BEAUTY_SALON = "beauty_salon"
    HAIR_SALON = "hair_salon"
    NAIL_SALON = "nail_salon"
    BARBER = "barber"
    DAY_SPA = "day_spa"
    PARTY_HALL = "party_hall"
    WEDDING_VENUE = "wedding_venue"
    CONFERENCE_HALL = "conference_hall"
    HEALTHCARE_GP = "healthcare_gp"
    HEALTHCARE_DENTAL = "healthcare_dental"
    HEALTHCARE_PHYSIO = "healthcare_physio"
    HEALTHCARE_SPECIALIST = "healthcare_specialist"
    CONSULTANT = "consultant"
    GYM = "gym"
    COACHING = "coaching"
    RESTAURANT = "restaurant"
    LOCAL_REPAIR = "local_repair"
    OTHER = "other"


class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)

    # Business details
    business_name: Mapped[str] = mapped_column(String(255))
    abn: Mapped[str | None] = mapped_column(String(11))
    category: Mapped[BusinessCategory] = mapped_column(SAEnum(BusinessCategory))
    description: Mapped[str | None] = mapped_column(Text)
    logo_url: Mapped[str | None] = mapped_column(String(500))

    # Contact & location
    address: Mapped[str | None] = mapped_column(String(500))
    suburb: Mapped[str | None] = mapped_column(String(100))
    state: Mapped[str | None] = mapped_column(String(10))
    postcode: Mapped[str | None] = mapped_column(String(10))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    phone: Mapped[str | None] = mapped_column(String(20))
    website: Mapped[str | None] = mapped_column(String(500))

    # Hours (stored as JSON: {"mon": {"open": "09:00", "close": "17:00"}, ...})
    business_hours: Mapped[dict] = mapped_column(JSON, default=dict)

    # Metrics
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    total_bookings: Mapped[int] = mapped_column(default=0)

    # Settings
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    verification_status: Mapped[str] = mapped_column(String(20), default="pending")
    subscription_tier: Mapped[str] = mapped_column(String(20), default="free")
    cancellation_policy_hours: Mapped[int] = mapped_column(default=24)

    # Media
    photo_urls: Mapped[list] = mapped_column(JSON, default=list)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="business_profile")
    services: Mapped[list["Service"]] = relationship(
        back_populates="business", cascade="all, delete-orphan"
    )
    staff: Mapped[list["StaffMember"]] = relationship(
        back_populates="business", cascade="all, delete-orphan"
    )
    bookings: Mapped[list["Booking"]] = relationship(back_populates="business")
    proposals: Mapped[list["Proposal"]] = relationship(back_populates="business")
    reviews_received: Mapped[list["Review"]] = relationship(
        back_populates="business", foreign_keys="Review.target_business_id"
    )


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("business_profiles.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    duration_minutes: Mapped[int] = mapped_column(default=60)
    price: Mapped[float] = mapped_column(Float)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    business: Mapped["BusinessProfile"] = relationship(back_populates="services")
    bookings: Mapped[list["Booking"]] = relationship(back_populates="service")


class StaffMember(Base):
    __tablename__ = "staff_members"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("business_profiles.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    title: Mapped[str | None] = mapped_column(String(100))
    bio: Mapped[str | None] = mapped_column(Text)
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    specialties: Mapped[list] = mapped_column(JSON, default=list)
    availability: Mapped[dict] = mapped_column(JSON, default=dict)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    business: Mapped["BusinessProfile"] = relationship(back_populates="staff")
    bookings: Mapped[list["Booking"]] = relationship(back_populates="staff_member")

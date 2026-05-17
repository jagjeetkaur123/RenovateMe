import enum
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, Boolean, DateTime, ForeignKey, JSON, Integer, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class JobStatus(str, enum.Enum):
    OPEN = "open"
    QUOTED = "quoted"
    HIRED = "hired"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"


class JobUrgency(str, enum.Enum):
    STANDARD = "standard"
    URGENT = "urgent"
    EMERGENCY = "emergency"


class JobPost(Base):
    __tablename__ = "job_posts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)

    # Job details
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(50))
    subcategory: Mapped[str | None] = mapped_column(String(100))

    # Budget
    budget_min: Mapped[float | None] = mapped_column(Float)
    budget_max: Mapped[float | None] = mapped_column(Float)

    # Location
    address: Mapped[str | None] = mapped_column(String(500))
    suburb: Mapped[str | None] = mapped_column(String(100))
    state: Mapped[str | None] = mapped_column(String(10))
    postcode: Mapped[str | None] = mapped_column(String(10))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)

    # Timing
    preferred_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    urgency: Mapped[JobUrgency] = mapped_column(SAEnum(JobUrgency), default=JobUrgency.STANDARD)

    # Status
    status: Mapped[JobStatus] = mapped_column(SAEnum(JobStatus), default=JobStatus.OPEN)
    hired_tradesperson_id: Mapped[int | None] = mapped_column(
        ForeignKey("tradesperson_profiles.id"), nullable=True
    )

    # Media
    image_urls: Mapped[list] = mapped_column(JSON, default=list)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Relationships
    customer: Mapped["User"] = relationship(back_populates="job_posts")
    quotes: Mapped[list["Quote"]] = relationship(back_populates="job", cascade="all, delete-orphan")
    hired_tradesperson: Mapped["TradespersonProfile | None"] = relationship(
        foreign_keys=[hired_tradesperson_id]
    )

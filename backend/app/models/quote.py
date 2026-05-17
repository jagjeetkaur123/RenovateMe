import enum
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, DateTime, ForeignKey, JSON, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class QuoteStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    WITHDRAWN = "withdrawn"
    EXPIRED = "expired"


class Quote(Base):
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    job_id: Mapped[int] = mapped_column(ForeignKey("job_posts.id"), index=True)
    tradesperson_id: Mapped[int] = mapped_column(ForeignKey("tradesperson_profiles.id"), index=True)

    # Quote details
    amount: Mapped[float] = mapped_column(Float)
    scope_notes: Mapped[str | None] = mapped_column(Text)
    timeline_days: Mapped[int | None]
    inclusions: Mapped[list] = mapped_column(JSON, default=list)
    exclusions: Mapped[list] = mapped_column(JSON, default=list)
    terms: Mapped[str | None] = mapped_column(Text)

    # Status
    status: Mapped[QuoteStatus] = mapped_column(SAEnum(QuoteStatus), default=QuoteStatus.PENDING)
    customer_message: Mapped[str | None] = mapped_column(Text)

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
    job: Mapped["JobPost"] = relationship(back_populates="quotes")
    tradesperson: Mapped["TradespersonProfile"] = relationship(back_populates="quotes")

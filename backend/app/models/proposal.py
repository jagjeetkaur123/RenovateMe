import enum
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, DateTime, ForeignKey, JSON, Boolean, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class ProposalStatus(str, enum.Enum):
    DRAFT = "draft"
    SENT = "sent"
    VIEWED = "viewed"
    APPROVED = "approved"
    DECLINED = "declined"
    EXPIRED = "expired"


class Proposal(Base):
    __tablename__ = "proposals"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("business_profiles.id"), index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)

    # Content
    title: Mapped[str] = mapped_column(String(255))
    introduction: Mapped[str | None] = mapped_column(Text)

    # Line items: [{"description": "...", "qty": 1, "unit_price": 100, "total": 100}]
    items: Mapped[list] = mapped_column(JSON, default=list)

    # Pricing
    subtotal: Mapped[float] = mapped_column(Float, default=0.0)
    tax_percent: Mapped[float] = mapped_column(Float, default=10.0)
    discount_amount: Mapped[float] = mapped_column(Float, default=0.0)
    total: Mapped[float] = mapped_column(Float, default=0.0)

    # Terms and timeline
    timeline: Mapped[str | None] = mapped_column(Text)
    terms: Mapped[str | None] = mapped_column(Text)

    # Status
    status: Mapped[ProposalStatus] = mapped_column(SAEnum(ProposalStatus), default=ProposalStatus.DRAFT)
    version: Mapped[int] = mapped_column(default=1)

    # Approval
    pdf_url: Mapped[str | None] = mapped_column(String(500))
    signed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    customer_signature: Mapped[str | None] = mapped_column(String(500))

    # Attachments
    attachment_urls: Mapped[list] = mapped_column(JSON, default=list)

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
    business: Mapped["BusinessProfile"] = relationship(back_populates="proposals")
    customer: Mapped["User"] = relationship(foreign_keys=[customer_id])

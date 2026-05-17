from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.user import User
from app.models.tradesperson import TradespersonProfile, VerificationStatus
from app.models.business import BusinessProfile
from app.models.review import Review
from app.schemas.user import UserOut

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
async def platform_stats(
    _: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    from app.models.job import JobPost
    from app.models.booking import Booking

    users_total = (await db.execute(select(func.count(User.id)))).scalar()
    jobs_total = (await db.execute(select(func.count(JobPost.id)))).scalar()
    bookings_total = (await db.execute(select(func.count(Booking.id)))).scalar()
    pending_providers = (
        await db.execute(
            select(func.count(TradespersonProfile.id)).where(
                TradespersonProfile.verification_status == VerificationStatus.PENDING
            )
        )
    ).scalar()

    return {
        "users_total": users_total,
        "jobs_total": jobs_total,
        "bookings_total": bookings_total,
        "pending_provider_approvals": pending_providers,
    }


@router.get("/users", response_model=list[UserOut])
async def list_users(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=200),
    _: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).offset((page - 1) * size).limit(size).order_by(User.created_at.desc())
    )
    return result.scalars().all()


@router.patch("/users/{user_id}/activate", response_model=UserOut)
async def activate_user(
    user_id: int,
    active: bool,
    _: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = active
    await db.flush()
    await db.refresh(user)
    return user


@router.get("/providers/pending")
async def pending_providers(
    _: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(TradespersonProfile).where(
            TradespersonProfile.verification_status == VerificationStatus.PENDING
        )
    )
    return result.scalars().all()


@router.patch("/providers/{profile_id}/verify")
async def verify_provider(
    profile_id: int,
    status: VerificationStatus,
    _: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(TradespersonProfile).where(TradespersonProfile.id == profile_id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile.verification_status = status
    await db.flush()
    return {"id": profile_id, "verification_status": status}


@router.patch("/reviews/{review_id}/flag")
async def flag_review(
    review_id: int,
    flagged: bool,
    _: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.is_flagged = flagged
    await db.flush()
    return {"id": review_id, "is_flagged": flagged}

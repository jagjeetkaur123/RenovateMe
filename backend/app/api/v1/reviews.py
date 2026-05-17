from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewRespond, ReviewOut

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("", response_model=ReviewOut, status_code=201)
async def create_review(
    payload: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not payload.target_tradesperson_id and not payload.target_business_id:
        raise HTTPException(status_code=400, detail="Must target a tradesperson or business")

    review = Review(reviewer_id=current_user.id, **payload.model_dump())
    db.add(review)
    await db.flush()
    await db.refresh(review)
    return review


@router.get("/tradesperson/{profile_id}", response_model=list[ReviewOut])
async def tradesperson_reviews(profile_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Review).where(Review.target_tradesperson_id == profile_id)
    )
    return result.scalars().all()


@router.get("/business/{business_id}", response_model=list[ReviewOut])
async def business_reviews(business_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Review).where(Review.target_business_id == business_id)
    )
    return result.scalars().all()


@router.patch("/{review_id}/respond", response_model=ReviewOut)
async def respond_to_review(
    review_id: int,
    payload: ReviewRespond,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    from datetime import datetime, timezone
    review.response = payload.response
    review.response_at = datetime.now(timezone.utc)

    await db.flush()
    await db.refresh(review)
    return review

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import get_current_user, get_current_tradesperson
from app.models.user import User, UserRole
from app.models.job import JobPost, JobStatus
from app.models.quote import Quote, QuoteStatus
from app.models.tradesperson import TradespersonProfile
from app.schemas.quote import QuoteCreate, QuoteUpdate, QuoteRespond, QuoteOut

router = APIRouter(prefix="/quotes", tags=["Quotes"])


@router.post("", response_model=QuoteOut, status_code=201)
async def submit_quote(
    payload: QuoteCreate,
    current_user: User = Depends(get_current_tradesperson),
    db: AsyncSession = Depends(get_db),
):
    # Get the tradesperson profile
    result = await db.execute(
        select(TradespersonProfile).where(TradespersonProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=400, detail="Complete your tradesperson profile first")

    # Check job exists and is open
    job_result = await db.execute(select(JobPost).where(JobPost.id == payload.job_id))
    job = job_result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status != JobStatus.OPEN:
        raise HTTPException(status_code=400, detail="Job is no longer accepting quotes")

    # Prevent duplicate quotes
    existing = await db.execute(
        select(Quote).where(
            Quote.job_id == payload.job_id, Quote.tradesperson_id == profile.id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="You have already quoted on this job")

    quote = Quote(tradesperson_id=profile.id, **payload.model_dump())
    db.add(quote)
    await db.flush()
    await db.refresh(quote)

    job.status = JobStatus.QUOTED
    return quote


@router.get("/job/{job_id}", response_model=list[QuoteOut])
async def get_job_quotes(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    job_result = await db.execute(select(JobPost).where(JobPost.id == job_id))
    job = job_result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.customer_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")

    result = await db.execute(select(Quote).where(Quote.job_id == job_id))
    return result.scalars().all()


@router.patch("/{quote_id}/respond", response_model=QuoteOut)
async def respond_to_quote(
    quote_id: int,
    payload: QuoteRespond,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Quote).where(Quote.id == quote_id))
    quote = result.scalar_one_or_none()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    job_result = await db.execute(select(JobPost).where(JobPost.id == quote.job_id))
    job = job_result.scalar_one_or_none()

    if job.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    quote.status = payload.status
    quote.customer_message = payload.customer_message

    if payload.status == QuoteStatus.ACCEPTED:
        job.status = JobStatus.HIRED
        job.hired_tradesperson_id = quote.tradesperson_id
        # Decline all other quotes
        other_quotes_result = await db.execute(
            select(Quote).where(Quote.job_id == job.id, Quote.id != quote_id)
        )
        for other in other_quotes_result.scalars().all():
            other.status = QuoteStatus.DECLINED

    await db.flush()
    await db.refresh(quote)
    return quote


@router.get("/my", response_model=list[QuoteOut])
async def my_quotes(
    current_user: User = Depends(get_current_tradesperson),
    db: AsyncSession = Depends(get_db),
):
    profile_result = await db.execute(
        select(TradespersonProfile).where(TradespersonProfile.user_id == current_user.id)
    )
    profile = profile_result.scalar_one_or_none()
    if not profile:
        return []

    result = await db.execute(select(Quote).where(Quote.tradesperson_id == profile.id))
    return result.scalars().all()

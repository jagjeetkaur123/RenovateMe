from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.core.database import get_db
from app.core.deps import get_current_user, get_current_active_customer
from app.models.user import User
from app.models.job import JobPost, JobStatus
from app.schemas.job import JobCreate, JobUpdate, JobOut, JobListOut

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("", response_model=JobOut, status_code=201)
async def create_job(
    payload: JobCreate,
    current_user: User = Depends(get_current_active_customer),
    db: AsyncSession = Depends(get_db),
):
    job = JobPost(customer_id=current_user.id, **payload.model_dump())
    db.add(job)
    await db.flush()
    await db.refresh(job)
    return job


@router.get("", response_model=JobListOut)
async def list_jobs(
    category: str | None = None,
    status: JobStatus | None = None,
    suburb: str | None = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    query = select(JobPost).where(
        or_(JobPost.expires_at == None, JobPost.expires_at > now)
    )
    if category:
        query = query.where(JobPost.category == category)
    if status:
        query = query.where(JobPost.status == status)
    if suburb:
        query = query.where(JobPost.suburb.ilike(f"%{suburb}%"))

    total_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = total_result.scalar()

    query = query.offset((page - 1) * size).limit(size).order_by(JobPost.created_at.desc())
    result = await db.execute(query)
    jobs = result.scalars().all()

    return JobListOut(items=jobs, total=total, page=page, size=size)


@router.get("/my", response_model=JobListOut)
async def my_jobs(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(JobPost).where(JobPost.customer_id == current_user.id)
    total_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = total_result.scalar()

    query = query.offset((page - 1) * size).limit(size).order_by(JobPost.created_at.desc())
    result = await db.execute(query)
    return JobListOut(items=result.scalars().all(), total=total, page=page, size=size)


@router.get("/{job_id}", response_model=JobOut)
async def get_job(job_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(JobPost).where(JobPost.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.patch("/{job_id}", response_model=JobOut)
async def update_job(
    job_id: int,
    payload: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(JobPost).where(JobPost.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your job")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(job, field, value)

    await db.flush()
    await db.refresh(job)
    return job


@router.delete("/{job_id}", status_code=204)
async def cancel_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(JobPost).where(JobPost.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your job")

    job.status = JobStatus.CANCELLED
    await db.flush()

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.deps import get_current_user, get_current_tradesperson
from app.models.user import User
from app.models.tradesperson import TradespersonProfile, VerificationStatus
from app.schemas.tradesperson import TradespersonProfileCreate, TradespersonProfileUpdate, TradespersonProfileOut

router = APIRouter(prefix="/tradespeople", tags=["Tradespeople"])


@router.post("/profile", response_model=TradespersonProfileOut, status_code=201)
async def create_profile(
    payload: TradespersonProfileCreate,
    current_user: User = Depends(get_current_tradesperson),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(
        select(TradespersonProfile).where(TradespersonProfile.user_id == current_user.id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Profile already exists")

    profile = TradespersonProfile(user_id=current_user.id, **payload.model_dump())
    db.add(profile)
    await db.flush()
    await db.refresh(profile)
    return profile


@router.get("/profile/me", response_model=TradespersonProfileOut)
async def get_my_profile(
    current_user: User = Depends(get_current_tradesperson),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(TradespersonProfile).where(TradespersonProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.patch("/profile/me", response_model=TradespersonProfileOut)
async def update_my_profile(
    payload: TradespersonProfileUpdate,
    current_user: User = Depends(get_current_tradesperson),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(TradespersonProfile).where(TradespersonProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(profile, field, value)

    await db.flush()
    await db.refresh(profile)
    return profile


@router.get("", response_model=list[TradespersonProfileOut])
async def search_tradespeople(
    category: str | None = None,
    suburb: str | None = None,
    hire_now: bool = False,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(TradespersonProfile).where(
        TradespersonProfile.verification_status == VerificationStatus.APPROVED
    )
    if category:
        query = query.where(TradespersonProfile.categories.contains([category]))
    if suburb:
        query = query.where(TradespersonProfile.suburb.ilike(f"%{suburb}%"))
    if hire_now:
        query = query.where(
            TradespersonProfile.hire_now_enabled == True,
            TradespersonProfile.is_available == True,
        )

    query = query.order_by(TradespersonProfile.trust_score.desc())
    query = query.offset((page - 1) * size).limit(size)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{profile_id}", response_model=TradespersonProfileOut)
async def get_tradesperson(profile_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TradespersonProfile).where(TradespersonProfile.id == profile_id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Tradesperson not found")
    return profile

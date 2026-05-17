from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import get_current_user, get_current_business_owner
from app.models.user import User
from app.models.business import BusinessProfile, Service, StaffMember
from app.schemas.business import (
    BusinessProfileCreate, BusinessProfileUpdate, BusinessProfileOut,
    ServiceCreate, ServiceOut, StaffCreate, StaffOut,
)

router = APIRouter(prefix="/businesses", tags=["Businesses"])


@router.post("/profile", response_model=BusinessProfileOut, status_code=201)
async def create_business(
    payload: BusinessProfileCreate,
    current_user: User = Depends(get_current_business_owner),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(
        select(BusinessProfile).where(BusinessProfile.user_id == current_user.id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Business profile already exists")

    business = BusinessProfile(user_id=current_user.id, **payload.model_dump())
    db.add(business)
    await db.flush()
    await db.refresh(business)
    return business


@router.get("/profile/me", response_model=BusinessProfileOut)
async def get_my_business(
    current_user: User = Depends(get_current_business_owner),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BusinessProfile).where(BusinessProfile.user_id == current_user.id)
    )
    business = result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business


@router.patch("/profile/me", response_model=BusinessProfileOut)
async def update_my_business(
    payload: BusinessProfileUpdate,
    current_user: User = Depends(get_current_business_owner),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BusinessProfile).where(BusinessProfile.user_id == current_user.id)
    )
    business = result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(business, field, value)

    await db.flush()
    await db.refresh(business)
    return business


@router.get("", response_model=list[BusinessProfileOut])
async def search_businesses(
    category: str | None = None,
    suburb: str | None = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(BusinessProfile).where(BusinessProfile.is_active == True)
    if category:
        query = query.where(BusinessProfile.category == category)
    if suburb:
        query = query.where(BusinessProfile.suburb.ilike(f"%{suburb}%"))

    query = query.order_by(BusinessProfile.is_featured.desc(), BusinessProfile.rating.desc())
    query = query.offset((page - 1) * size).limit(size)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{business_id}", response_model=BusinessProfileOut)
async def get_business(business_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(BusinessProfile).where(BusinessProfile.id == business_id)
    )
    business = result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business


# --- Services ---

@router.post("/{business_id}/services", response_model=ServiceOut, status_code=201)
async def add_service(
    business_id: int,
    payload: ServiceCreate,
    current_user: User = Depends(get_current_business_owner),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BusinessProfile).where(
            BusinessProfile.id == business_id,
            BusinessProfile.user_id == current_user.id,
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Business not found or access denied")

    service = Service(business_id=business_id, **payload.model_dump())
    db.add(service)
    await db.flush()
    await db.refresh(service)
    return service


@router.get("/{business_id}/services", response_model=list[ServiceOut])
async def list_services(business_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Service).where(Service.business_id == business_id, Service.is_active == True)
    )
    return result.scalars().all()


# --- Staff ---

@router.post("/{business_id}/staff", response_model=StaffOut, status_code=201)
async def add_staff(
    business_id: int,
    payload: StaffCreate,
    current_user: User = Depends(get_current_business_owner),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BusinessProfile).where(
            BusinessProfile.id == business_id,
            BusinessProfile.user_id == current_user.id,
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Business not found or access denied")

    staff = StaffMember(business_id=business_id, **payload.model_dump())
    db.add(staff)
    await db.flush()
    await db.refresh(staff)
    return staff


@router.get("/{business_id}/staff", response_model=list[StaffOut])
async def list_staff(business_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(StaffMember).where(
            StaffMember.business_id == business_id, StaffMember.is_active == True
        )
    )
    return result.scalars().all()

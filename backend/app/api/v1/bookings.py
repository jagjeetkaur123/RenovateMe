from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.booking import Booking, BookingStatus
from app.models.business import BusinessProfile, Service
from app.schemas.booking import BookingCreate, BookingUpdate, BookingOut

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("", response_model=BookingOut, status_code=201)
async def create_booking(
    payload: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Validate business exists
    biz_result = await db.execute(
        select(BusinessProfile).where(BusinessProfile.id == payload.business_id)
    )
    business = biz_result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    # Get service duration and price if provided
    duration = 60
    price = None
    if payload.service_id:
        svc_result = await db.execute(
            select(Service).where(Service.id == payload.service_id)
        )
        service = svc_result.scalar_one_or_none()
        if service:
            duration = service.duration_minutes
            price = service.price

    booking = Booking(
        customer_id=current_user.id,
        business_id=payload.business_id,
        service_id=payload.service_id,
        staff_id=payload.staff_id,
        slot_datetime=payload.slot_datetime,
        duration_minutes=duration,
        price=price,
        customer_notes=payload.customer_notes,
        status=BookingStatus.PENDING,
    )
    db.add(booking)
    await db.flush()
    await db.refresh(booking)
    return booking


@router.get("/my", response_model=list[BookingOut])
async def my_bookings(
    status: BookingStatus | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Booking).where(Booking.customer_id == current_user.id)
    if status:
        query = query.where(Booking.status == status)
    query = query.order_by(Booking.slot_datetime.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{booking_id}", response_model=BookingOut)
async def get_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return booking


@router.patch("/{booking_id}", response_model=BookingOut)
async def update_booking(
    booking_id: int,
    payload: BookingUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(booking, field, value)

    await db.flush()
    await db.refresh(booking)
    return booking


@router.delete("/{booking_id}", status_code=204)
async def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    booking.status = BookingStatus.CANCELLED
    await db.flush()

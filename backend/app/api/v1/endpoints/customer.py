from fastapi import APIRouter, Depends
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/customer", tags=["Customer"])

@router.get("/dashboard")
async def get_customer_dashboard(current_user: User = Depends(get_current_user)):
    return {
        "message": f"Welcome Homeowner {current_user.name}",
        "stats": {"posted_jobs": 2, "active_bookings": 1}
    }
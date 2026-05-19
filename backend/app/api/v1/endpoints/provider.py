from fastapi import APIRouter, Depends
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/provider", tags=["Provider"])

@router.get("/dashboard")
async def get_provider_dashboard(current_user: User = Depends(get_current_user)):
    # Yahan tradesperson ka specific data aayega
    return {
        "message": f"Welcome {current_user.name}",
        "stats": {"active_bids": 5, "completed_jobs": 12, "earnings": "₹15,000"}
    }
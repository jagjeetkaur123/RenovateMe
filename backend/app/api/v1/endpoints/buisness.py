from fastapi import APIRouter, Depends
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/business", tags=["Business"])

@router.get("/dashboard")
async def get_business_dashboard(current_user: User = Depends(get_current_user)):
    return {
        "message": f"Welcome Business Owner {current_user.name}",
        "stats": {"total_staff": 8, "active_projects": 3, "revenue": "₹85,000"}
    }
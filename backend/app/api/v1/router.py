from fastapi import APIRouter
from app.api.v1 import auth, jobs, quotes, bookings, reviews, tradespeople, businesses, admin

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(jobs.router)
api_router.include_router(quotes.router)
api_router.include_router(bookings.router)
api_router.include_router(reviews.router)
api_router.include_router(tradespeople.router)
api_router.include_router(businesses.router)
api_router.include_router(admin.router)

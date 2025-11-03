from fastapi import APIRouter
from app.api.v1.endpoints import cases  # health/auth omitted for now

api_router = APIRouter()
api_router.include_router(cases.router, prefix="/cases", tags=["cases"])

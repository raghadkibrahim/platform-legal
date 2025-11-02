from fastapi import FastAPI
from loguru import logger
from app.core.config import settings
from app.api.router import api_router

app = FastAPI(title=settings.PROJECT_NAME)

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.PROJECT_NAME} in {settings.ENV} mode")

app.include_router(api_router, prefix=settings.API_V1_STR)

# root
@app.get("/", tags=["root"])
def read_root():
    return {"name": settings.PROJECT_NAME, "api": settings.API_V1_STR}

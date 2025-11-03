from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from app.api.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting API")
    yield
    logger.info("Shutting down API")

app = FastAPI(title="Platform Legal API", lifespan=lifespan)

# DEV: open CORS fully so we can eliminate CORS as a variable
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API at /api/v1
app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["root"])
def root():
    return {"ok": True}

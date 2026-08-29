from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database.base import Base
from app.database.connection import engine
from app.routers.vehicle import router as vehicle_router
from app.routers.incident import router as incident_router
from app.routers.field_report import router as field_report_router
from app.routers.alert import router as alert_router
from app.routers.route import router as route_router
from app.routers.weather import router as weather_router
from app.api.health import router as health_router


# =========================================================
# LIFESPAN — DB INIT
# =========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup
    Base.metadata.create_all(bind=engine)
    yield


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="NER-SARTHI API",
    version="1.0.0",
    lifespan=lifespan,
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROUTERS
# =========================================================

from app.routers.hospital import router as hospital_router
from app.routers.auth import router as auth_router

app.include_router(vehicle_router)
app.include_router(incident_router)
app.include_router(field_report_router)
app.include_router(alert_router)
app.include_router(route_router)
app.include_router(weather_router)
app.include_router(health_router)
app.include_router(hospital_router)
app.include_router(auth_router)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "NER-SARTHI API is running"
    }

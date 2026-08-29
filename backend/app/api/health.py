from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.connection import get_db


router = APIRouter(
    prefix="/api/health",
    tags=["Health"],
)


@router.get("/")
def health_check(db: Session = Depends(get_db)):
    try:
        postgres = db.execute(
            text("SELECT version()")
        ).scalar()

        # PostGIS is optional
        postgis = None
        try:
            postgis = db.execute(
                text("SELECT PostGIS_Version()")
            ).scalar()
        except Exception:
            pass

        return {
            "status": "healthy",
            "service": "NER-SARTHI API",
            "database": "connected",
            "postgresql": postgres,
            "postgis": postgis,
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
        }
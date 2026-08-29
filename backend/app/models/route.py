from datetime import datetime

from sqlalchemy import DateTime, Float, String, func, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Route(Base):
    __tablename__ = "routes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    name: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "Guwahati to Tezpur Corridor"
    origin: Mapped[str] = mapped_column(String(100), nullable=False)
    destination: Mapped[str] = mapped_column(String(100), nullable=False)
    
    distance_km: Mapped[float] = mapped_column(Float, nullable=False)
    estimated_duration_mins: Mapped[int] = mapped_column(Float, nullable=False)
    
    # Coordinates array: [[lat, lon], [lat, lon], ...]
    waypoints: Mapped[list] = mapped_column(JSON, nullable=False)
    
    risk_level: Mapped[str] = mapped_column(String(20), default="LOW", nullable=False)
    risk_score: Mapped[int] = mapped_column(Float, default=10, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

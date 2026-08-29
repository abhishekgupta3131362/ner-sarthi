from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    
    type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. SYSTEM, WEATHER, TRAFFIC, SECURITY
    severity: Mapped[str] = mapped_column(String(20), default="INFO", nullable=False) # INFO, WARNING, CRITICAL
    region: Mapped[str | None] = mapped_column(String(100), nullable=True)
    
    vehicle_id: Mapped[int | None] = mapped_column(Integer, nullable=True) # Optional link to a specific vehicle
    
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

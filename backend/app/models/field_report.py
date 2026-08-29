from datetime import datetime

from sqlalchemy import DateTime, Float, String, func, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class FieldReport(Base):
    __tablename__ = "field_reports"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    submitted_by: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. Driver, Official, Responder
    
    location_name: Mapped[str] = mapped_column(String(100), nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    
    category: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. Road Block, Delivery Delay
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    status: Mapped[str] = mapped_column(String(30), default="PENDING", nullable=False) # PENDING, REVIEWED, ACTION_TAKEN
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

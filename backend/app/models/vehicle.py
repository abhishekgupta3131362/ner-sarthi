from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    # =========================================================
    # IDENTITY
    # =========================================================

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    vehicle_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )

    vehicle_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    # =========================================================
    # DRIVER
    # =========================================================

    driver_name: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    # =========================================================
    # STATUS
    # =========================================================

    status: Mapped[str] = mapped_column(
        String(30),
        default="IDLE",
        nullable=False,
    )

    assigned: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # =========================================================
    # GPS TELEMETRY
    # =========================================================

    latitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    longitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    speed: Mapped[float] = mapped_column(
        Float,
        default=0,
        nullable=False,
    )

    heading: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    # =========================================================
    # VEHICLE HEALTH
    # =========================================================

    battery: Mapped[float] = mapped_column(
        Float,
        default=100.0,
        nullable=False,
    )

    fuel_level: Mapped[float] = mapped_column(
        Float,
        default=100.0,
        nullable=False,
    )

    # =========================================================
    # RISK
    # =========================================================

    risk_level: Mapped[str] = mapped_column(
        String(20),
        default="LOW",
        nullable=False,
    )

    risk_score: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    # =========================================================
    # MISSION / ASSIGNMENT
    # =========================================================

    current_route: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    cargo_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    eta_minutes: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    # =========================================================
    # TIMESTAMPS
    # =========================================================

    last_seen: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )
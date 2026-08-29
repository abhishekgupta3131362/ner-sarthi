from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class RouteCreate(BaseModel):
    name: str
    origin: str
    destination: str
    distance_km: float
    estimated_duration_mins: float
    waypoints: list[list[float]]
    risk_level: str = "LOW"
    risk_score: float = 10.0


class RouteUpdate(BaseModel):
    name: str | None = None
    risk_level: str | None = None
    risk_score: float | None = None


class RouteResponse(BaseModel):
    id: int
    name: str
    origin: str
    destination: str
    distance_km: float
    estimated_duration_mins: float
    waypoints: list[list[float]]
    risk_level: str
    risk_score: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

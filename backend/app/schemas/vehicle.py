from datetime import datetime

from pydantic import BaseModel, ConfigDict


class VehicleCreate(BaseModel):
    vehicle_number: str
    vehicle_type: str
    driver_name: str | None = None
    status: str = "IDLE"
    assigned: bool = False
    latitude: float | None = None
    longitude: float | None = None
    speed: float = 0
    heading: float | None = None
    battery: float = 100.0
    fuel_level: float = 100.0
    risk_level: str = "LOW"
    risk_score: int = 0
    current_route: str | None = None
    cargo_type: str | None = None
    eta_minutes: int | None = None


class VehicleUpdate(BaseModel):
    vehicle_type: str | None = None
    driver_name: str | None = None
    status: str | None = None
    assigned: bool | None = None
    latitude: float | None = None
    longitude: float | None = None
    speed: float | None = None
    heading: float | None = None
    battery: float | None = None
    fuel_level: float | None = None
    risk_level: str | None = None
    risk_score: int | None = None
    current_route: str | None = None
    cargo_type: str | None = None
    eta_minutes: int | None = None


class VehicleResponse(BaseModel):
    id: int
    vehicle_number: str
    vehicle_type: str
    driver_name: str | None
    status: str
    assigned: bool
    latitude: float | None
    longitude: float | None
    speed: float
    heading: float | None
    battery: float
    fuel_level: float
    risk_level: str
    risk_score: int
    current_route: str | None
    cargo_type: str | None
    eta_minutes: int | None
    last_seen: datetime | None
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
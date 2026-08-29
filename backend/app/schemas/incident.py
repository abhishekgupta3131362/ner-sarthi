from datetime import datetime

from pydantic import BaseModel, ConfigDict


class IncidentCreate(BaseModel):
    title: str
    type: str
    severity: str = "MEDIUM"
    latitude: float
    longitude: float
    location_name: str | None = None
    description: str | None = None
    status: str = "ACTIVE"


class IncidentUpdate(BaseModel):
    title: str | None = None
    type: str | None = None
    severity: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    location_name: str | None = None
    description: str | None = None
    status: str | None = None


class IncidentResponse(BaseModel):
    id: int
    title: str
    type: str
    severity: str
    latitude: float
    longitude: float
    location_name: str | None
    description: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

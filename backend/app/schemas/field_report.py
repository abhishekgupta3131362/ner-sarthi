from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FieldReportCreate(BaseModel):
    submitted_by: str
    role: str
    location_name: str
    latitude: float | None = None
    longitude: float | None = None
    category: str
    description: str
    image_url: str | None = None
    status: str = "PENDING"


class FieldReportUpdate(BaseModel):
    status: str | None = None


class FieldReportResponse(BaseModel):
    id: int
    submitted_by: str
    role: str
    location_name: str
    latitude: float | None
    longitude: float | None
    category: str
    description: str
    image_url: str | None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

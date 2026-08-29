from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AlertCreate(BaseModel):
    title: str
    message: str
    type: str
    severity: str = "INFO"
    region: str | None = None
    vehicle_id: int | None = None
    is_read: bool = False


class AlertUpdate(BaseModel):
    is_read: bool | None = None


class AlertResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    severity: str
    region: str | None
    vehicle_id: int | None
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

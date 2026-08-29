from fastapi import APIRouter

from app.schemas.weather import WeatherRequest, WeatherResponse
from app.services import weather_service

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.post("/", response_model=WeatherResponse)
async def get_weather(req: WeatherRequest):
    return await weather_service.get_weather_for_location(req.latitude, req.longitude)

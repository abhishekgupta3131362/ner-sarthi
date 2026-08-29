from pydantic import BaseModel


class WeatherRequest(BaseModel):
    latitude: float
    longitude: float

class WeatherResponse(BaseModel):
    temperature_celsius: float
    weather_code: int
    weather_description: str
    wind_speed_kmh: float
    precipitation_mm: float
    is_day: bool

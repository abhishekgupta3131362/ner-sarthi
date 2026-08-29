import httpx

from app.schemas.weather import WeatherResponse

WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with light hail",
    99: "Thunderstorm with heavy hail"
}

async def get_weather_for_location(lat: float, lon: float) -> WeatherResponse:
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,is_day,precipitation,weather_code,wind_speed_10m"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=5.0)
            response.raise_for_status()
            data = response.json()
            
            current = data.get("current", {})
            w_code = current.get("weather_code", 0)
            
            return WeatherResponse(
                temperature_celsius=current.get("temperature_2m", 0.0),
                weather_code=w_code,
                weather_description=WEATHER_CODES.get(w_code, "Unknown"),
                wind_speed_kmh=current.get("wind_speed_10m", 0.0),
                precipitation_mm=current.get("precipitation", 0.0),
                is_day=bool(current.get("is_day", 1))
            )
        except Exception as e:
            # Return a fallback if API fails
            print(f"Weather API failed: {e}")
            return WeatherResponse(
                temperature_celsius=25.0,
                weather_code=0,
                weather_description="Clear sky",
                wind_speed_kmh=5.0,
                precipitation_mm=0.0,
                is_day=True
            )

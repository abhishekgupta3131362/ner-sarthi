from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.route import Route
from app.models.incident import Incident
from app.services.weather_service import get_weather_for_location

async def generate_route_prediction(db: Session, route: Route):
    """
    AI Prediction Engine for NER logistics.
    Takes route data, queries real-time weather at the route's origin/destination,
    checks for active incidents along the route, and calculates a final risk score
    and delay prediction.
    """
    # 1. Fetch Weather (we'll just check the origin for simplicity in this demo)
    try:
        origin_lat = route.waypoints[0][0]
        origin_lon = route.waypoints[0][1]
    except (IndexError, TypeError):
        origin_lat = 26.1445  # Default Guwahati
        origin_lon = 91.7362

    weather_data = await get_weather_for_location(origin_lat, origin_lon)
    
    # Base risk starts from distance
    base_risk = min(20.0, route.distance_km / 10.0)
    
    # 2. Weather Risk Multiplier
    weather_risk = 0.0
    if weather_data.precipitation_mm > 10.0:
        weather_risk += 30.0
    elif weather_data.precipitation_mm > 2.0:
        weather_risk += 15.0
        
    if weather_data.wind_speed_kmh > 40.0:
        weather_risk += 20.0
        
    # 3. Active Incidents Impact
    active_incidents = db.scalars(select(Incident).where(Incident.status == "ACTIVE")).all()
    
    incident_risk = 0.0
    delay_minutes = 0
    
    for incident in active_incidents:
        # Simple string match for route name / location for this demo
        # In production, this would use PostGIS ST_DWithin
        if incident.location_name and incident.location_name.lower() in route.name.lower():
            if incident.severity == "CRITICAL":
                incident_risk += 50.0
                delay_minutes += 120
            elif incident.severity == "HIGH":
                incident_risk += 30.0
                delay_minutes += 60
            else:
                incident_risk += 15.0
                delay_minutes += 30

    total_risk = min(100.0, base_risk + weather_risk + incident_risk)
    
    risk_level = "LOW"
    if total_risk > 75.0:
        risk_level = "CRITICAL"
    elif total_risk > 50.0:
        risk_level = "HIGH"
    elif total_risk > 30.0:
        risk_level = "MEDIUM"

    return {
        "route_id": route.id,
        "route_name": route.name,
        "base_risk": round(base_risk, 1),
        "weather_risk": round(weather_risk, 1),
        "incident_risk": round(incident_risk, 1),
        "total_risk_score": round(total_risk, 1),
        "risk_level": risk_level,
        "predicted_delay_minutes": delay_minutes,
        "weather_summary": weather_data.weather_description
    }

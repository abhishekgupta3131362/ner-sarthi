from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.route import RouteCreate, RouteResponse, RouteUpdate
from app.services import route_service

router = APIRouter(prefix="/api/routes", tags=["Routes"])

@router.get("/", response_model=list[RouteResponse])
def get_routes(db: Session = Depends(get_db)):
    return route_service.get_all_routes(db)

@router.post("/", response_model=RouteResponse, status_code=status.HTTP_201_CREATED)
def create_route(data: RouteCreate, db: Session = Depends(get_db)):
    return route_service.create_route(db, data)

@router.patch("/{route_id}", response_model=RouteResponse)
def update_route(route_id: int, data: RouteUpdate, db: Session = Depends(get_db)):
    route = route_service.get_route_by_id(db, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return route_service.update_route(db, route, data)

@router.delete("/{route_id}")
def delete_route(route_id: int, db: Session = Depends(get_db)):
    route = route_service.get_route_by_id(db, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    route_service.delete_route(db, route)
    return {"message": "Route deleted successfully"}

from app.services.ai_prediction import generate_route_prediction

@router.post("/{route_id}/predict")
async def predict_route_risk(route_id: int, db: Session = Depends(get_db)):
    route = route_service.get_route_by_id(db, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    
    prediction = await generate_route_prediction(db, route)
    
    # Optionally update the route with the new risk score
    route_service.update_route(db, route, RouteUpdate(
        risk_level=prediction["risk_level"],
        risk_score=prediction["total_risk_score"]
    ))
    
    return prediction


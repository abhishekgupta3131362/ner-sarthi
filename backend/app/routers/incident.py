from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.incident import IncidentCreate, IncidentResponse, IncidentUpdate
from app.services import incident_service

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

@router.get("/", response_model=list[IncidentResponse])
def get_incidents(db: Session = Depends(get_db)):
    return incident_service.get_all_incidents(db)

@router.post("/", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_incident(data: IncidentCreate, db: Session = Depends(get_db)):
    return incident_service.create_incident(db, data)

@router.patch("/{incident_id}", response_model=IncidentResponse)
def update_incident(incident_id: int, data: IncidentUpdate, db: Session = Depends(get_db)):
    incident = incident_service.get_incident_by_id(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident_service.update_incident(db, incident, data)

@router.delete("/{incident_id}")
def delete_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = incident_service.get_incident_by_id(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    incident_service.delete_incident(db, incident)
    return {"message": "Incident deleted successfully"}

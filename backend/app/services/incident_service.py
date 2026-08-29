from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentUpdate


def get_all_incidents(db: Session):
    return db.scalars(select(Incident).order_by(Incident.created_at.desc())).all()

def get_incident_by_id(db: Session, incident_id: int):
    return db.get(Incident, incident_id)

from app.models.alert import Alert

def create_incident(db: Session, data: IncidentCreate):
    incident = Incident(**data.model_dump())
    db.add(incident)
    db.commit()
    db.refresh(incident)
    
    # Auto-generate alert for critical incidents
    if incident.severity in ["CRITICAL", "HIGH"]:
        alert = Alert(
            type="SYSTEM_ALERT",
            title=f"New {incident.severity} Incident: {incident.category}",
            message=f"{incident.category} reported at {incident.location_name}. Description: {incident.description}",
            severity=incident.severity
        )
        db.add(alert)
        db.commit()
        
    return incident

def update_incident(db: Session, incident: Incident, data: IncidentUpdate):
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(incident, field, value)
    db.commit()
    db.refresh(incident)
    return incident

def delete_incident(db: Session, incident: Incident):
    db.delete(incident)
    db.commit()

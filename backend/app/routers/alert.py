from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.alert import AlertCreate, AlertResponse, AlertUpdate
from app.services import alert_service

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("/", response_model=list[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    return alert_service.get_all_alerts(db)

@router.post("/", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
def create_alert(data: AlertCreate, db: Session = Depends(get_db)):
    return alert_service.create_alert(db, data)

@router.post("/{alert_id}/read", response_model=AlertResponse)
def mark_alert_read(alert_id: int, db: Session = Depends(get_db)):
    alert = alert_service.get_alert_by_id(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert_service.mark_alert_read(db, alert)

@router.delete("/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = alert_service.get_alert_by_id(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert_service.delete_alert(db, alert)
    return {"message": "Alert deleted successfully"}

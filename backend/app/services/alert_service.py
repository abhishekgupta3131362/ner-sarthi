from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.schemas.alert import AlertCreate, AlertUpdate


def get_all_alerts(db: Session):
    return db.scalars(select(Alert).order_by(Alert.created_at.desc())).all()

def get_alert_by_id(db: Session, alert_id: int):
    return db.get(Alert, alert_id)

def create_alert(db: Session, data: AlertCreate):
    alert = Alert(**data.model_dump())
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

def mark_alert_read(db: Session, alert: Alert):
    alert.is_read = True
    db.commit()
    db.refresh(alert)
    return alert

def delete_alert(db: Session, alert: Alert):
    db.delete(alert)
    db.commit()

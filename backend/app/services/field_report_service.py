from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.field_report import FieldReport
from app.schemas.field_report import FieldReportCreate, FieldReportUpdate


def get_all_field_reports(db: Session):
    return db.scalars(select(FieldReport).order_by(FieldReport.created_at.desc())).all()

def get_field_report_by_id(db: Session, report_id: int):
    return db.get(FieldReport, report_id)

def create_field_report(db: Session, data: FieldReportCreate):
    report = FieldReport(**data.model_dump())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def update_field_report(db: Session, report: FieldReport, data: FieldReportUpdate):
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(report, field, value)
    db.commit()
    db.refresh(report)
    return report

def delete_field_report(db: Session, report: FieldReport):
    db.delete(report)
    db.commit()

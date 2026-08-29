from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.field_report import FieldReportCreate, FieldReportResponse, FieldReportUpdate
from app.services import field_report_service

router = APIRouter(prefix="/api/field-reports", tags=["Field Reports"])

@router.get("/", response_model=list[FieldReportResponse])
def get_field_reports(db: Session = Depends(get_db)):
    return field_report_service.get_all_field_reports(db)

@router.post("/", response_model=FieldReportResponse, status_code=status.HTTP_201_CREATED)
def create_field_report(data: FieldReportCreate, db: Session = Depends(get_db)):
    return field_report_service.create_field_report(db, data)

@router.patch("/{report_id}", response_model=FieldReportResponse)
def update_field_report(report_id: int, data: FieldReportUpdate, db: Session = Depends(get_db)):
    report = field_report_service.get_field_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return field_report_service.update_field_report(db, report, data)

@router.delete("/{report_id}")
def delete_field_report(report_id: int, db: Session = Depends(get_db)):
    report = field_report_service.get_field_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    field_report_service.delete_field_report(db, report)
    return {"message": "Report deleted successfully"}


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from typing import List
from app.database.connection import get_db
from app.models.hospital import Hospital, HospitalStatus, HospitalType, DataStatus

router = APIRouter(prefix="/api/hospitals", tags=["Hospitals"])

@router.get("/")
def get_hospitals(db: Session = Depends(get_db)):
    hospitals = db.query(Hospital).options(joinedload(Hospital.status)).all()
    
    result = []
    for h in hospitals:
        s = h.status
        result.append({
            "id": h.id,
            "hfr_id": h.hfr_id,
            "name": h.name,
            "location": f"{h.city}, {h.state}",
            "lat": h.lat,
            "lng": h.lng,
            "type": h.type.value,
            "is_government": h.is_government,
            "facilities": {
                "emergency": h.has_emergency,
                "icu": h.has_icu,
                "trauma": h.has_trauma
            },
            "status": {
                "data_status": s.data_status.value if s else "UNAVAILABLE",
                "data_source": s.data_source if s else "Unknown",
                "last_updated": s.last_updated.isoformat() if s and s.last_updated else None,
                "total_beds": s.total_beds if s else None,
                "available_beds": s.available_beds if s else None,
                "total_icu": s.total_icu if s else None,
                "available_icu": s.available_icu if s else None,
                "ambulances": s.ambulances_available if s else 0
            }
        })
    return result

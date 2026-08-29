
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import uuid
import enum
from datetime import datetime
from app.database.base import Base

class HospitalType(str, enum.Enum):
    MEDICAL_COLLEGE = "MEDICAL_COLLEGE"
    DISTRICT_HOSPITAL = "DISTRICT_HOSPITAL"
    CHC = "CHC"
    PRIVATE = "PRIVATE"

class DataStatus(str, enum.Enum):
    LIVE = "LIVE"
    RECENT = "RECENT"
    STATIC = "STATIC"
    UNAVAILABLE = "UNAVAILABLE"

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hfr_id = Column(String, nullable=True, index=True) # Health Facility Registry ID
    name = Column(String, nullable=False)
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    city = Column(String, nullable=False)
    
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    
    type = Column(Enum(HospitalType), nullable=False, default=HospitalType.DISTRICT_HOSPITAL)
    is_government = Column(Boolean, default=True)
    
    has_emergency = Column(Boolean, default=True)
    has_icu = Column(Boolean, default=False)
    has_trauma = Column(Boolean, default=False)
    
    contact_number = Column(String, nullable=True)
    
    # Relationship to live status
    status = relationship("HospitalStatus", back_populates="hospital", uselist=False, cascade="all, delete-orphan")


class HospitalStatus(Base):
    __tablename__ = "hospital_status"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id = Column(String(36), ForeignKey("hospitals.id"), unique=True)
    
    total_beds = Column(Integer, nullable=True)
    available_beds = Column(Integer, nullable=True)
    
    total_icu = Column(Integer, nullable=True)
    available_icu = Column(Integer, nullable=True)
    
    ambulances_available = Column(Integer, nullable=True)
    
    # The Trust Layer
    data_status = Column(Enum(DataStatus), nullable=False, default=DataStatus.STATIC)
    data_source = Column(String, nullable=False, default="Official Registry")
    last_updated = Column(DateTime, default=datetime.utcnow)

    hospital = relationship("Hospital", back_populates="status")

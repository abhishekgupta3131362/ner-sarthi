"""
Seed script for Phase A (Incidents, Alerts, Field Reports).

Run:  python -m app.seed_phase_a
"""

from datetime import datetime, timezone, timedelta
import random

from app.database.base import Base
from app.database.connection import engine, SessionLocal
from app.models.incident import Incident
from app.models.alert import Alert
from app.models.field_report import FieldReport

# =========================================================
# DATA
# =========================================================

INCIDENTS = [
    {
        "title": "Severe Landslide on NH-27",
        "type": "Landslide",
        "severity": "CRITICAL",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "location_name": "Guwahati-Shillong Highway",
        "description": "Road completely blocked due to heavy rain. Avoid route.",
        "status": "ACTIVE",
    },
    {
        "title": "Bridge Maintenance",
        "type": "Road Damage",
        "severity": "MEDIUM",
        "latitude": 25.5788,
        "longitude": 91.8933,
        "location_name": "Tura Bridge",
        "description": "Single lane traffic only. Expect 30m delays.",
        "status": "ACTIVE",
    },
    {
        "title": "Flash Floods",
        "type": "Flood",
        "severity": "HIGH",
        "latitude": 24.8170,
        "longitude": 93.9368,
        "location_name": "Imphal Valley",
        "description": "Water level rising. Heavy cargo vehicles restricted.",
        "status": "ACTIVE",
    },
]

FIELD_REPORTS = [
    {
        "submitted_by": "Ramesh Kumar (Driver)",
        "role": "Driver",
        "location_name": "NH-27 Landslide Site",
        "latitude": 26.1450,
        "longitude": 91.7360,
        "category": "Road Block",
        "description": "Stuck here for 2 hours. Rocks are still falling. No clearance yet.",
        "status": "PENDING",
    },
    {
        "submitted_by": "Anil Singh (Officer)",
        "role": "Official",
        "location_name": "Tura Bridge",
        "latitude": 25.5788,
        "longitude": 91.8933,
        "category": "Traffic",
        "description": "Clearing debris, expect full opening by evening.",
        "status": "REVIEWED",
    },
]

ALERTS = [
    {
        "title": "ROUTE BLOCKED",
        "message": "NH-27 is blocked due to landslide. Reroute via bypass.",
        "type": "TRAFFIC",
        "severity": "CRITICAL",
        "region": "Assam",
        "is_read": False,
    },
    {
        "title": "Heavy Rainfall Warning",
        "message": "IMD predicts heavy rain in Meghalaya for next 24h.",
        "type": "WEATHER",
        "severity": "WARNING",
        "region": "Meghalaya",
        "is_read": False,
    },
]


def seed():
    print("🌱 Seeding Phase A Data...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Clear existing
        db.query(Incident).delete()
        db.query(FieldReport).delete()
        db.query(Alert).delete()

        for inc in INCIDENTS:
            db.add(Incident(**inc))

        for rep in FIELD_REPORTS:
            db.add(FieldReport(**rep))

        for alt in ALERTS:
            db.add(Alert(**alt))

        db.commit()
        print("✅ Phase A seeding complete!")
    finally:
        db.close()

if __name__ == "__main__":
    seed()

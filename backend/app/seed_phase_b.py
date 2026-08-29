"""
Seed script for Phase B (Routes).

Run:  python -m app.seed_phase_b
"""

from app.database.base import Base
from app.database.connection import engine, SessionLocal
from app.models.route import Route

# =========================================================
# DATA
# =========================================================

ROUTES = [
    {
        "name": "Guwahati-Shillong Corridor",
        "origin": "Guwahati, Assam",
        "destination": "Shillong, Meghalaya",
        "distance_km": 98.5,
        "estimated_duration_mins": 150,
        "waypoints": [
            [26.1445, 91.7362],
            [25.9080, 91.8680],
            [25.5788, 91.8933]
        ],
        "risk_level": "MEDIUM",
        "risk_score": 45.0,
    },
    {
        "name": "Silchar-Imphal Route",
        "origin": "Silchar, Assam",
        "destination": "Imphal, Manipur",
        "distance_km": 250.0,
        "estimated_duration_mins": 420,
        "waypoints": [
            [24.8333, 92.7833],
            [24.8170, 93.9368]
        ],
        "risk_level": "HIGH",
        "risk_score": 75.0,
    },
    {
        "name": "Tezpur-Itanagar Route",
        "origin": "Tezpur, Assam",
        "destination": "Itanagar, Arunachal Pradesh",
        "distance_km": 160.0,
        "estimated_duration_mins": 240,
        "waypoints": [
            [26.6338, 92.8000],
            [27.0833, 93.6167]
        ],
        "risk_level": "LOW",
        "risk_score": 15.0,
    }
]


def seed():
    print("🌱 Seeding Phase B Data...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Clear existing
        db.query(Route).delete()

        for r in ROUTES:
            db.add(Route(**r))

        db.commit()
        print("✅ Phase B seeding complete!")
    finally:
        db.close()

if __name__ == "__main__":
    seed()

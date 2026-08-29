"""
Seed script for NER-SARTHI vehicles.

Run:  python -m app.seed
"""

from datetime import datetime, timezone, timedelta
import random

from app.database.base import Base
from app.database.connection import engine, SessionLocal
from app.models.vehicle import Vehicle


# =========================================================
# NER VEHICLE DATA
# =========================================================

VEHICLES = [
    # ---- ASSAM ----
    {
        "vehicle_number": "AS-01-AB-1234",
        "vehicle_type": "Truck",
        "driver_name": "Rajesh Baruah",
        "status": "LIVE",
        "assigned": True,
        "latitude": 26.1445,
        "longitude": 91.7362,
        "speed": 48.5,
        "heading": 45.0,
        "battery": 82.0,
        "fuel_level": 67.0,
        "risk_level": "LOW",
        "risk_score": 18,
        "current_route": "Guwahati → Tezpur",
        "cargo_type": "Food Grains",
        "eta_minutes": 95,
    },
    {
        "vehicle_number": "AS-01-CD-5678",
        "vehicle_type": "Ambulance",
        "driver_name": "Pranab Kalita",
        "status": "LIVE",
        "assigned": True,
        "latitude": 26.1891,
        "longitude": 91.7982,
        "speed": 62.0,
        "heading": 90.0,
        "battery": 95.0,
        "fuel_level": 88.0,
        "risk_level": "LOW",
        "risk_score": 12,
        "current_route": "Guwahati → Nagaon",
        "cargo_type": "Medical Supplies",
        "eta_minutes": 68,
    },
    {
        "vehicle_number": "AS-02-EF-9012",
        "vehicle_type": "Cargo Van",
        "driver_name": "Bikash Das",
        "status": "IDLE",
        "assigned": False,
        "latitude": 26.7509,
        "longitude": 94.2037,
        "speed": 0,
        "heading": None,
        "battery": 74.0,
        "fuel_level": 55.0,
        "risk_level": "LOW",
        "risk_score": 22,
        "current_route": None,
        "cargo_type": None,
        "eta_minutes": None,
    },
    {
        "vehicle_number": "AS-03-GH-3456",
        "vehicle_type": "Truck",
        "driver_name": "Deepjyoti Nath",
        "status": "LIVE",
        "assigned": True,
        "latitude": 26.3420,
        "longitude": 92.6840,
        "speed": 35.2,
        "heading": 120.0,
        "battery": 45.0,
        "fuel_level": 31.0,
        "risk_level": "MEDIUM",
        "risk_score": 48,
        "current_route": "Nagaon → Jorhat",
        "cargo_type": "Construction Material",
        "eta_minutes": 142,
    },

    # ---- ARUNACHAL PRADESH ----
    {
        "vehicle_number": "AR-01-AB-2001",
        "vehicle_type": "SUV",
        "driver_name": "Tashi Dorji",
        "status": "LIVE",
        "assigned": True,
        "latitude": 27.0844,
        "longitude": 93.6053,
        "speed": 28.0,
        "heading": 200.0,
        "battery": 38.0,
        "fuel_level": 42.0,
        "risk_level": "HIGH",
        "risk_score": 78,
        "current_route": "Itanagar → Ziro",
        "cargo_type": "Emergency Relief",
        "eta_minutes": 210,
    },
    {
        "vehicle_number": "AR-02-CD-3002",
        "vehicle_type": "Truck",
        "driver_name": "Nabam Taki",
        "status": "OFFLINE",
        "assigned": False,
        "latitude": 27.5883,
        "longitude": 91.8600,
        "speed": 0,
        "heading": None,
        "battery": 12.0,
        "fuel_level": 18.0,
        "risk_level": "HIGH",
        "risk_score": 85,
        "current_route": None,
        "cargo_type": None,
        "eta_minutes": None,
    },

    # ---- MEGHALAYA ----
    {
        "vehicle_number": "ML-01-AB-4001",
        "vehicle_type": "Cargo Van",
        "driver_name": "Bah Lyngdoh",
        "status": "LIVE",
        "assigned": True,
        "latitude": 25.5788,
        "longitude": 91.8933,
        "speed": 42.0,
        "heading": 270.0,
        "battery": 68.0,
        "fuel_level": 72.0,
        "risk_level": "MEDIUM",
        "risk_score": 45,
        "current_route": "Shillong → Tura",
        "cargo_type": "Food Grains",
        "eta_minutes": 180,
    },
    {
        "vehicle_number": "ML-02-CD-5002",
        "vehicle_type": "Ambulance",
        "driver_name": "Ri Kynmaw",
        "status": "LIVE",
        "assigned": True,
        "latitude": 25.3400,
        "longitude": 91.7200,
        "speed": 55.0,
        "heading": 180.0,
        "battery": 91.0,
        "fuel_level": 85.0,
        "risk_level": "LOW",
        "risk_score": 15,
        "current_route": "Shillong → Dawki",
        "cargo_type": "Medical Supplies",
        "eta_minutes": 52,
    },

    # ---- MANIPUR ----
    {
        "vehicle_number": "MN-01-AB-6001",
        "vehicle_type": "Truck",
        "driver_name": "Thokchom Singh",
        "status": "LIVE",
        "assigned": True,
        "latitude": 24.8170,
        "longitude": 93.9368,
        "speed": 32.0,
        "heading": 160.0,
        "battery": 56.0,
        "fuel_level": 48.0,
        "risk_level": "HIGH",
        "risk_score": 72,
        "current_route": "Imphal → Moreh",
        "cargo_type": "Emergency Relief",
        "eta_minutes": 155,
    },
    {
        "vehicle_number": "MN-02-CD-7002",
        "vehicle_type": "SUV",
        "driver_name": "Laishram Devi",
        "status": "IDLE",
        "assigned": False,
        "latitude": 24.7990,
        "longitude": 93.9460,
        "speed": 0,
        "heading": None,
        "battery": 88.0,
        "fuel_level": 92.0,
        "risk_level": "LOW",
        "risk_score": 14,
        "current_route": None,
        "cargo_type": None,
        "eta_minutes": None,
    },

    # ---- MIZORAM ----
    {
        "vehicle_number": "MZ-01-AB-8001",
        "vehicle_type": "Truck",
        "driver_name": "Lalchhuanawma",
        "status": "LIVE",
        "assigned": True,
        "latitude": 23.7271,
        "longitude": 92.7176,
        "speed": 38.5,
        "heading": 310.0,
        "battery": 62.0,
        "fuel_level": 57.0,
        "risk_level": "MEDIUM",
        "risk_score": 52,
        "current_route": "Aizawl → Champhai",
        "cargo_type": "Construction Material",
        "eta_minutes": 125,
    },
    {
        "vehicle_number": "MZ-02-CD-9002",
        "vehicle_type": "Cargo Van",
        "driver_name": "Vanlalruata",
        "status": "IDLE",
        "assigned": False,
        "latitude": 23.7368,
        "longitude": 92.7148,
        "speed": 0,
        "heading": None,
        "battery": 79.0,
        "fuel_level": 65.0,
        "risk_level": "LOW",
        "risk_score": 20,
        "current_route": None,
        "cargo_type": None,
        "eta_minutes": None,
    },

    # ---- NAGALAND ----
    {
        "vehicle_number": "NL-01-AB-1101",
        "vehicle_type": "Truck",
        "driver_name": "Neiphiu Sema",
        "status": "LIVE",
        "assigned": True,
        "latitude": 25.6751,
        "longitude": 94.1086,
        "speed": 30.0,
        "heading": 85.0,
        "battery": 71.0,
        "fuel_level": 60.0,
        "risk_level": "MEDIUM",
        "risk_score": 55,
        "current_route": "Kohima → Dimapur",
        "cargo_type": "Food Grains",
        "eta_minutes": 88,
    },
    {
        "vehicle_number": "NL-02-CD-1202",
        "vehicle_type": "SUV",
        "driver_name": "Temsu Longkumer",
        "status": "OFFLINE",
        "assigned": False,
        "latitude": 25.6600,
        "longitude": 94.1100,
        "speed": 0,
        "heading": None,
        "battery": 8.0,
        "fuel_level": 12.0,
        "risk_level": "HIGH",
        "risk_score": 88,
        "current_route": None,
        "cargo_type": None,
        "eta_minutes": None,
    },

    # ---- TRIPURA ----
    {
        "vehicle_number": "TR-01-AB-1301",
        "vehicle_type": "Ambulance",
        "driver_name": "Biplab Debnath",
        "status": "LIVE",
        "assigned": True,
        "latitude": 23.8315,
        "longitude": 91.2868,
        "speed": 58.0,
        "heading": 350.0,
        "battery": 94.0,
        "fuel_level": 90.0,
        "risk_level": "LOW",
        "risk_score": 10,
        "current_route": "Agartala → Udaipur",
        "cargo_type": "Medical Supplies",
        "eta_minutes": 42,
    },
    {
        "vehicle_number": "TR-02-CD-1402",
        "vehicle_type": "Cargo Van",
        "driver_name": "Ratan Tripura",
        "status": "LIVE",
        "assigned": True,
        "latitude": 23.9400,
        "longitude": 91.3200,
        "speed": 44.0,
        "heading": 30.0,
        "battery": 76.0,
        "fuel_level": 68.0,
        "risk_level": "LOW",
        "risk_score": 19,
        "current_route": "Agartala → Dharmanagar",
        "cargo_type": "Food Grains",
        "eta_minutes": 110,
    },

    # ---- SIKKIM ----
    {
        "vehicle_number": "SK-01-AB-1501",
        "vehicle_type": "SUV",
        "driver_name": "Tshering Bhutia",
        "status": "LIVE",
        "assigned": True,
        "latitude": 27.3389,
        "longitude": 88.6065,
        "speed": 25.0,
        "heading": 290.0,
        "battery": 52.0,
        "fuel_level": 45.0,
        "risk_level": "MEDIUM",
        "risk_score": 58,
        "current_route": "Gangtok → Lachung",
        "cargo_type": "Emergency Relief",
        "eta_minutes": 195,
    },
    {
        "vehicle_number": "SK-02-CD-1602",
        "vehicle_type": "Truck",
        "driver_name": "Karma Lepcha",
        "status": "IDLE",
        "assigned": False,
        "latitude": 27.3300,
        "longitude": 88.6200,
        "speed": 0,
        "heading": None,
        "battery": 85.0,
        "fuel_level": 78.0,
        "risk_level": "LOW",
        "risk_score": 16,
        "current_route": None,
        "cargo_type": None,
        "eta_minutes": None,
    },

    # ---- EXTRA VEHICLES ----
    {
        "vehicle_number": "AS-04-IJ-7890",
        "vehicle_type": "Truck",
        "driver_name": "Hemanta Bora",
        "status": "LIVE",
        "assigned": True,
        "latitude": 27.4728,
        "longitude": 94.9120,
        "speed": 40.0,
        "heading": 150.0,
        "battery": 60.0,
        "fuel_level": 52.0,
        "risk_level": "MEDIUM",
        "risk_score": 44,
        "current_route": "Dibrugarh → Tinsukia",
        "cargo_type": "Construction Material",
        "eta_minutes": 35,
    },
    {
        "vehicle_number": "AS-05-KL-2345",
        "vehicle_type": "Cargo Van",
        "driver_name": "Manash Hazarika",
        "status": "LIVE",
        "assigned": True,
        "latitude": 26.4842,
        "longitude": 92.9814,
        "speed": 52.0,
        "heading": 60.0,
        "battery": 89.0,
        "fuel_level": 82.0,
        "risk_level": "LOW",
        "risk_score": 11,
        "current_route": "Nagaon → Lumding",
        "cargo_type": "Food Grains",
        "eta_minutes": 48,
    },
    {
        "vehicle_number": "ML-03-EF-6003",
        "vehicle_type": "SUV",
        "driver_name": "Kynsai Khongwir",
        "status": "OFFLINE",
        "assigned": False,
        "latitude": 25.5100,
        "longitude": 90.2200,
        "speed": 0,
        "heading": None,
        "battery": 5.0,
        "fuel_level": 8.0,
        "risk_level": "HIGH",
        "risk_score": 92,
        "current_route": None,
        "cargo_type": None,
        "eta_minutes": None,
    },
    {
        "vehicle_number": "AR-03-EF-4003",
        "vehicle_type": "Truck",
        "driver_name": "Pema Khandu",
        "status": "LIVE",
        "assigned": True,
        "latitude": 27.1000,
        "longitude": 93.6200,
        "speed": 22.0,
        "heading": 220.0,
        "battery": 33.0,
        "fuel_level": 28.0,
        "risk_level": "HIGH",
        "risk_score": 81,
        "current_route": "Itanagar → Tawang",
        "cargo_type": "Emergency Relief",
        "eta_minutes": 320,
    },
    {
        "vehicle_number": "NL-03-EF-1303",
        "vehicle_type": "Ambulance",
        "driver_name": "Imchen Ao",
        "status": "LIVE",
        "assigned": True,
        "latitude": 25.9100,
        "longitude": 93.7200,
        "speed": 50.0,
        "heading": 140.0,
        "battery": 90.0,
        "fuel_level": 86.0,
        "risk_level": "LOW",
        "risk_score": 13,
        "current_route": "Dimapur → Mokokchung",
        "cargo_type": "Medical Supplies",
        "eta_minutes": 72,
    },
]


# =========================================================
# MAIN
# =========================================================

def seed():
    print("🌱 NER-SARTHI Seed Script")
    print("=" * 50)

    # Drop and recreate tables
    print("📦 Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)

    print("📦 Creating tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        now = datetime.now(timezone.utc)

        for v_data in VEHICLES:
            # Randomize last_seen within the last 30 min
            minutes_ago = random.randint(0, 30)
            last_seen = now - timedelta(minutes=minutes_ago)

            vehicle = Vehicle(
                **v_data,
                last_seen=last_seen,
            )

            db.add(vehicle)

        db.commit()

        count = db.query(Vehicle).count()
        print(f"✅ Seeded {count} vehicles!")

        # Print summary
        live = db.query(Vehicle).filter(
            Vehicle.status == "LIVE"
        ).count()
        idle = db.query(Vehicle).filter(
            Vehicle.status == "IDLE"
        ).count()
        offline = db.query(Vehicle).filter(
            Vehicle.status == "OFFLINE"
        ).count()
        high = db.query(Vehicle).filter(
            Vehicle.risk_level == "HIGH"
        ).count()

        print(f"\n📊 Fleet Summary:")
        print(f"   LIVE:    {live}")
        print(f"   IDLE:    {idle}")
        print(f"   OFFLINE: {offline}")
        print(f"   HIGH RISK: {high}")
        print(f"\n🚀 Ready to go!")

    finally:
        db.close()


if __name__ == "__main__":
    seed()

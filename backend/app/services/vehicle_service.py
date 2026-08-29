from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


# =========================================================
# GET ALL VEHICLES
# =========================================================

def get_all_vehicles(db: Session):
    return db.scalars(
        select(Vehicle).order_by(
            Vehicle.id.desc()
        )
    ).all()


# =========================================================
# GET SINGLE VEHICLE
# =========================================================

def get_vehicle_by_id(db: Session, vehicle_id: int):
    return db.get(Vehicle, vehicle_id)


# =========================================================
# CREATE VEHICLE
# =========================================================

def create_vehicle(db: Session, data: VehicleCreate):
    vehicle = Vehicle(
        **data.model_dump(),
        last_seen=datetime.now(timezone.utc),
    )

    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)

    return vehicle


# =========================================================
# CHECK DUPLICATE
# =========================================================

def get_vehicle_by_number(db: Session, vehicle_number: str):
    return db.scalar(
        select(Vehicle).where(
            Vehicle.vehicle_number == vehicle_number
        )
    )


# =========================================================
# UPDATE VEHICLE
# =========================================================

def update_vehicle(
    db: Session,
    vehicle: Vehicle,
    data: VehicleUpdate,
):
    updates = data.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(vehicle, field, value)

    vehicle.last_seen = datetime.now(timezone.utc)

    db.commit()
    db.refresh(vehicle)

    return vehicle


# =========================================================
# DELETE VEHICLE
# =========================================================

def delete_vehicle(db: Session, vehicle: Vehicle):
    db.delete(vehicle)
    db.commit()


# =========================================================
# DISPATCH VEHICLE
# =========================================================

def dispatch_vehicle(db: Session, vehicle: Vehicle):
    vehicle.status = "LIVE"
    vehicle.assigned = True
    vehicle.last_seen = datetime.now(timezone.utc)

    db.commit()
    db.refresh(vehicle)

    return vehicle


# =========================================================
# MARK IDLE
# =========================================================

def mark_vehicle_idle(db: Session, vehicle: Vehicle):
    vehicle.status = "IDLE"
    vehicle.assigned = False
    vehicle.current_route = None
    vehicle.eta_minutes = None
    vehicle.last_seen = datetime.now(timezone.utc)

    db.commit()
    db.refresh(vehicle)

    return vehicle


# =========================================================
# FLEET STATS
# =========================================================

def get_fleet_stats(db: Session):
    total = db.scalar(
        select(func.count(Vehicle.id))
    ) or 0

    active = db.scalar(
        select(func.count(Vehicle.id)).where(
            Vehicle.status == "LIVE"
        )
    ) or 0

    idle = db.scalar(
        select(func.count(Vehicle.id)).where(
            Vehicle.status == "IDLE"
        )
    ) or 0

    offline = db.scalar(
        select(func.count(Vehicle.id)).where(
            Vehicle.status == "OFFLINE"
        )
    ) or 0

    high_risk = db.scalar(
        select(func.count(Vehicle.id)).where(
            Vehicle.risk_level == "HIGH"
        )
    ) or 0

    avg_risk = db.scalar(
        select(func.avg(Vehicle.risk_score))
    ) or 0

    avg_battery = db.scalar(
        select(func.avg(Vehicle.battery))
    ) or 0

    # Fleet health = % of vehicles that are NOT offline
    # and have battery > 20 and risk != HIGH
    healthy = db.scalar(
        select(func.count(Vehicle.id)).where(
            Vehicle.status != "OFFLINE",
            Vehicle.battery > 20,
            Vehicle.risk_level != "HIGH",
        )
    ) or 0

    fleet_health = round(
        (healthy / total * 100) if total > 0 else 0,
        1,
    )

    return {
        "total": total,
        "active": active,
        "idle": idle,
        "offline": offline,
        "high_risk": high_risk,
        "avg_risk_score": round(float(avg_risk), 1),
        "avg_battery": round(float(avg_battery), 1),
        "fleet_health": fleet_health,
    }

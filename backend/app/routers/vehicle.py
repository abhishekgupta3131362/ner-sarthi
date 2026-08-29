from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleResponse,
    VehicleUpdate,
)
from app.services import vehicle_service


router = APIRouter(
    prefix="/api/vehicles",
    tags=["Vehicles"],
)


# =========================================================
# FLEET STATS
# =========================================================

@router.get("/stats")
def fleet_stats(
    db: Session = Depends(get_db),
):
    return vehicle_service.get_fleet_stats(db)


# =========================================================
# GET ALL VEHICLES
# =========================================================

@router.get(
    "/",
    response_model=list[VehicleResponse],
)
def get_vehicles(
    db: Session = Depends(get_db),
):
    return vehicle_service.get_all_vehicles(db)


# =========================================================
# GET SINGLE VEHICLE
# =========================================================

@router.get(
    "/{vehicle_id}",
    response_model=VehicleResponse,
)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
):
    vehicle = vehicle_service.get_vehicle_by_id(
        db, vehicle_id
    )

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    return vehicle


# =========================================================
# CREATE VEHICLE
# =========================================================

@router.post(
    "/",
    response_model=VehicleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_vehicle(
    data: VehicleCreate,
    db: Session = Depends(get_db),
):
    existing = vehicle_service.get_vehicle_by_number(
        db, data.vehicle_number
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Vehicle number already exists",
        )

    return vehicle_service.create_vehicle(db, data)


# =========================================================
# UPDATE VEHICLE
# =========================================================

@router.patch(
    "/{vehicle_id}",
    response_model=VehicleResponse,
)
def update_vehicle(
    vehicle_id: int,
    data: VehicleUpdate,
    db: Session = Depends(get_db),
):
    vehicle = vehicle_service.get_vehicle_by_id(
        db, vehicle_id
    )

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    return vehicle_service.update_vehicle(
        db, vehicle, data
    )


# =========================================================
# DELETE VEHICLE
# =========================================================

@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
):
    vehicle = vehicle_service.get_vehicle_by_id(
        db, vehicle_id
    )

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    vehicle_service.delete_vehicle(db, vehicle)

    return {
        "message": "Vehicle deleted successfully",
        "vehicle_id": vehicle_id,
    }


# =========================================================
# DISPATCH VEHICLE
# =========================================================

@router.post(
    "/{vehicle_id}/dispatch",
    response_model=VehicleResponse,
)
def dispatch_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
):
    vehicle = vehicle_service.get_vehicle_by_id(
        db, vehicle_id
    )

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    if vehicle.status == "LIVE":
        raise HTTPException(
            status_code=400,
            detail="Vehicle is already dispatched",
        )

    return vehicle_service.dispatch_vehicle(
        db, vehicle
    )


# =========================================================
# MARK IDLE
# =========================================================

@router.post(
    "/{vehicle_id}/mark-idle",
    response_model=VehicleResponse,
)
def mark_idle(
    vehicle_id: int,
    db: Session = Depends(get_db),
):
    vehicle = vehicle_service.get_vehicle_by_id(
        db, vehicle_id
    )

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    if vehicle.status == "IDLE":
        raise HTTPException(
            status_code=400,
            detail="Vehicle is already idle",
        )

    return vehicle_service.mark_vehicle_idle(
        db, vehicle
    )
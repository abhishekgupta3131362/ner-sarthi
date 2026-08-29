from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.route import Route
from app.schemas.route import RouteCreate, RouteUpdate


def get_all_routes(db: Session):
    return db.scalars(select(Route).order_by(Route.id)).all()

def get_route_by_id(db: Session, route_id: int):
    return db.get(Route, route_id)

def create_route(db: Session, data: RouteCreate):
    route = Route(**data.model_dump())
    db.add(route)
    db.commit()
    db.refresh(route)
    return route

def update_route(db: Session, route: Route, data: RouteUpdate):
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(route, field, value)
    db.commit()
    db.refresh(route)
    return route

def delete_route(db: Session, route: Route):
    db.delete(route)
    db.commit()

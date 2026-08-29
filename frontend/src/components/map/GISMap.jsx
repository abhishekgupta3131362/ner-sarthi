import {
  MapContainer,
  TileLayer,
  Polyline,
  LayersControl,
  LayerGroup,
  ZoomControl,
  CircleMarker,
  Tooltip
} from "react-leaflet";

import VehicleMarker from "./VehicleMarker";
import IncidentMarker from "./IncidentMarker";
import RiskZone from "./RiskZone";

import { mapCenter, riskZones } from "../../utils/constants";

function getRouteGeometry(route) {
  if (!route) return [];
  if (Array.isArray(route.geometry)) {
    return route.geometry.map(p => [Number(p[0]), Number(p[1])]).filter(p => Number.isFinite(p[0]) && Number.isFinite(p[1]));
  }
  if (route.geometry && Array.isArray(route.geometry.coordinates)) {
    return route.geometry.coordinates.map(p => [Number(p[1]), Number(p[0])]).filter(p => Number.isFinite(p[0]) && Number.isFinite(p[1]));
  }
  if (Array.isArray(route.coordinates)) {
    return route.coordinates.map(p => [Number(p[0]), Number(p[1])]).filter(p => Number.isFinite(p[0]) && Number.isFinite(p[1]));
  }
  if (Array.isArray(route.waypoints)) {
    return route.waypoints.map(p => [Number(p[0]), Number(p[1])]).filter(p => Number.isFinite(p[0]) && Number.isFinite(p[1]));
  }
  return [];
}

export default function GISMap({
  calculatedRoute = null,
  vehicles = [],
  incidents = [],
  routes = []
}) {
  const calculatedGeometry = getRouteGeometry(calculatedRoute);
  const hasCalculatedRoute = calculatedGeometry.length >= 2;
  const startPoint = hasCalculatedRoute ? calculatedGeometry[0] : null;
  const endPoint = hasCalculatedRoute ? calculatedGeometry[calculatedGeometry.length - 1] : null;

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <MapContainer center={mapCenter} zoom={7} scrollWheelZoom={true} zoomControl={false} className="w-full h-full" style={{ background: "#f8fafc" }}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomControl position="bottomright" />
        <LayersControl position="topright">
          
          <LayersControl.Overlay checked name="Live Vehicles">
            <LayerGroup>
              {vehicles.map(v => <VehicleMarker key={v.id} vehicle={v} />)}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Incidents">
            <LayerGroup>
              {incidents.map(i => <IncidentMarker key={i.id} incident={i} />)}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Risk Zones">
            <LayerGroup>
              {riskZones.map(z => <RiskZone key={z.id} zone={z} />)}
            </LayerGroup>
          </LayersControl.Overlay>

          {hasCalculatedRoute && (
            <LayersControl.Overlay checked name="Calculated Route">
              <LayerGroup>
                <Polyline positions={calculatedGeometry} pathOptions={{ color: "#16a34a", weight: 8, opacity: 0.18, lineCap: "round", lineJoin: "round" }} />
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          {hasCalculatedRoute && (
            <LayersControl.Overlay checked name="Active Recommended Route">
              <LayerGroup>
                <Polyline positions={calculatedGeometry} pathOptions={{ color: "#16a34a", weight: 5, opacity: 0.95, lineCap: "round", lineJoin: "round" }} />
                {startPoint && (
                  <CircleMarker center={startPoint} radius={8} pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#2563eb", fillOpacity: 1 }}>
                    <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                      <span className="font-bold text-slate-800">Start Position</span>
                    </Tooltip>
                  </CircleMarker>
                )}
                {endPoint && (
                  <CircleMarker center={endPoint} radius={8} pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#ef4444", fillOpacity: 1 }}>
                    <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                      <span className="font-bold text-slate-800">Destination</span>
                    </Tooltip>
                  </CircleMarker>
                )}
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          <LayersControl.Overlay checked name="Logistics Corridors">
            <LayerGroup>
              {routes.map(r => (
                <Polyline key={r.id} positions={getRouteGeometry(r)} pathOptions={{ color: "#0284c7", weight: 4, opacity: 0.5, dashArray: "8 8", lineCap: "round" }} />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>
    </div>
  );
}

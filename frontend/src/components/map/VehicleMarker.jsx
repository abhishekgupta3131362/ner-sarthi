import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

export default function VehicleMarker({ vehicle }) {
  if (!vehicle.lat || !vehicle.lng) return null;

  const position = [vehicle.lat, vehicle.lng];
  const statusColor = vehicle.status === "IDLE" ? "text-yellow-500" : vehicle.status === "ACTIVE" ? "text-emerald-500" : "text-slate-500";
  
  const iconHtml = renderToStaticMarkup(
    <div className="relative w-8 h-8 flex items-center justify-center">
      <div className={`absolute w-full h-full rounded-full opacity-20 ${statusColor.replace('text', 'bg')}`} />
      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${statusColor.replace('text', 'bg')}`} />
    </div>
  );

  const customIcon = L.divIcon({
    html: iconHtml,
    className: "bg-transparent",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <Marker position={position} icon={customIcon}>
      <Popup className="rounded-xl overflow-hidden shadow-xl border-none">
        <div className="p-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${statusColor.replace('text', 'bg')}`} />
            <span className="font-bold text-slate-800">{vehicle.registration_number}</span>
          </div>
          <p className="text-xs text-slate-600">Type: {vehicle.type}</p>
          <p className="text-xs text-slate-600">Driver: {vehicle.driver_name || "Unknown"}</p>
          <p className="text-xs text-slate-600 mt-1">Status: {vehicle.status}</p>
        </div>
      </Popup>
    </Marker>
  );
}

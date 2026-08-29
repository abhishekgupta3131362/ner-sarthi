import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { AlertTriangle } from "lucide-react";

export default function IncidentMarker({ incident }) {
  if (!incident.lat || !incident.lng) return null;

  const position = [incident.lat, incident.lng];
  const severityColor = incident.severity === "HIGH" ? "bg-red-500" : incident.severity === "MEDIUM" ? "bg-orange-500" : "bg-yellow-500";
  
  const iconHtml = renderToStaticMarkup(
    <div className="relative w-8 h-8 flex items-center justify-center">
      <div className={`absolute w-full h-full rounded-full opacity-30 animate-ping ${severityColor}`} />
      <div className={`w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${severityColor}`}>
        <AlertTriangle size={12} className="text-white" />
      </div>
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
            <span className="font-bold text-slate-800">{incident.type}</span>
          </div>
          <p className="text-xs text-slate-600">{incident.description}</p>
          <p className="text-[10px] text-slate-400 mt-2">Reported: {new Date(incident.reported_at).toLocaleString()}</p>
        </div>
      </Popup>
    </Marker>
  );
}

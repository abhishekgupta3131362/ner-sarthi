import { Circle, Tooltip } from "react-leaflet";

export default function RiskZone({ zone }) {
  if (!zone.lat || !zone.lng) return null;

  const center = [zone.lat, zone.lng];
  const riskColor = zone.riskLevel === "HIGH" ? "#ef4444" : zone.riskLevel === "MEDIUM" ? "#f97316" : "#eab308";

  return (
    <Circle
      center={center}
      radius={zone.radius || 15000}
      pathOptions={{
        fillColor: riskColor,
        fillOpacity: 0.15,
        color: riskColor,
        weight: 1,
        opacity: 0.5
      }}
    >
      <Tooltip direction="top" opacity={1} className="bg-white border-none shadow-lg rounded-lg text-slate-800 font-bold p-2">
        {zone.name || "Risk Zone"}
      </Tooltip>
    </Circle>
  );
}

import React, { useState, useEffect } from "react";
import { X, Navigation, Clock, Activity } from "lucide-react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";

// Mock command center coordinates (Guwahati)
const COMMAND_CENTER = { lat: 26.1445, lng: 91.7362 };

const hospitalIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "hue-rotate-0"
});

const centerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "hue-rotate-180"
});

export default function HospitalRouteModal({ hospital, onClose }) {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hospital || !hospital.lat || !hospital.lng) return;

    const fetchRoute = async () => {
      try {
        const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
        const url = "https://api.geoapify.com/v1/routing?waypoints=${COMMAND_CENTER.lat},${COMMAND_CENTER.lng}|${hospital.lat},${hospital.lng}&mode=drive&apiKey=${apiKey}";
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.features && data.features.length > 0) {
          const feature = data.features[0];
          const coords = feature.geometry.coordinates[0].map(c => [c[1], c[0]]);
          
          setRouteData({
            coordinates: coords,
            distance: (feature.properties.distance / 1000).toFixed(1),
            time: Math.round(feature.properties.time / 60)
          });
        }
      } catch (err) {
        console.error("Routing error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [hospital]);

  if (!hospital) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Navigation className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Live Navigation Router</h2>
              <p className="text-sm text-slate-500">Command Center ? {hospital.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          
          <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-5 overflow-y-auto flex flex-col">
            <h3 className="font-semibold text-slate-700 mb-4 uppercase text-xs tracking-wider">Route Analytics</h3>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : routeData ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 text-slate-500 mb-1">
                    <Activity size={16} />
                    <span className="text-sm font-medium">Estimated Distance</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">{routeData.distance} <span className="text-sm font-semibold text-slate-500">km</span></p>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 text-slate-500 mb-1">
                    <Clock size={16} />
                    <span className="text-sm font-medium">Estimated Time</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">{routeData.time} <span className="text-sm font-semibold text-slate-500">mins</span></p>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Turn-by-Turn Overview</h4>
                  <div className="relative pl-4 border-l-2 border-slate-200 space-y-6">
                    <div className="relative">
                      <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[23px] top-1 border-2 border-white"></div>
                      <p className="text-sm font-bold text-slate-800">Guwahati Command Center</p>
                      <p className="text-xs text-slate-500">Origin</p>
                    </div>
                    <div className="relative">
                      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[23px] top-1 border-2 border-white"></div>
                      <p className="text-sm font-bold text-slate-800">{hospital.name}</p>
                      <p className="text-xs text-slate-500">Destination</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-auto py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                  <Navigation size={18} />
                  Dispatch Emergency Fleet
                </button>
              </div>
            ) : (
              <div className="text-sm text-slate-500 bg-red-50 p-4 rounded-xl border border-red-100">
                Failed to calculate route. The location might be unreachable by road from the command center.
              </div>
            )}
          </div>
          
          <div className="flex-1 bg-slate-200 relative">
            <MapContainer 
              bounds={
                routeData && routeData.coordinates.length > 0
                  ? [COMMAND_CENTER, {lat: hospital.lat, lng: hospital.lng}] 
                  : undefined
              }
              center={COMMAND_CENTER} 
              zoom={12} 
              className="w-full h-full z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              
              <Marker position={COMMAND_CENTER} icon={centerIcon}>
                <Popup>Command Center</Popup>
              </Marker>
              
              <Marker position={{lat: hospital.lat, lng: hospital.lng}} icon={hospitalIcon}>
                <Popup>{hospital.name}</Popup>
              </Marker>
              
              {routeData && (
                <Polyline 
                  positions={routeData.coordinates} 
                  color="#2563eb" 
                  weight={5} 
                  opacity={0.8}
                />
              )}
            </MapContainer>
          </div>
          
        </div>
      </div>
    </div>
  );
}

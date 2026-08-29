import { useEffect, useState } from "react";
import { Truck, Radio } from "lucide-react";
import { getVehicles } from "../../services/api";

function VehicleTracking() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getVehicles();

        setVehicles(data);
      } catch (err) {
        console.error("Failed to fetch vehicles:", err);
        setError("Unable to load vehicle data");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">

        <div>
          <h3 className="text-white font-semibold">
            Live Vehicle Tracking
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Active fleet monitoring
          </p>
        </div>

        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Radio size={18} className="text-blue-400" />
        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="text-xs text-slate-500 py-6 text-center">
          Loading vehicle data...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-xs text-red-400 py-6 text-center">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && vehicles.length === 0 && (
        <div className="text-xs text-slate-500 py-6 text-center">
          No vehicles available
        </div>
      )}

      {/* Vehicles */}
      {!loading && !error && vehicles.length > 0 && (
        <div className="space-y-3">

          {vehicles.map((vehicle) => {

            const isLive =
              vehicle.status?.toLowerCase() === "active";

            const location =
              vehicle.latitude !== null &&
              vehicle.longitude !== null
                ? `${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}`
                : "Location unavailable";

            return (
              <div
                key={vehicle.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800"
              >

                {/* Vehicle Info */}
                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Truck
                      size={17}
                      className="text-blue-400"
                    />
                  </div>

                  <div>

                    <p className="text-sm font-medium text-white">
                      {vehicle.vehicle_number}
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1">
                      {vehicle.vehicle_type} • {location}
                    </p>

                  </div>

                </div>

                {/* Speed + Status */}
                <div className="text-right">

                  <p className="text-xs text-slate-300">
                    {vehicle.speed ?? 0} km/h
                  </p>

                  <div className="flex items-center justify-end gap-1 mt-1">

                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isLive
                          ? "bg-emerald-400"
                          : "bg-slate-500"
                      }`}
                    />

                    <span
                      className={`text-[10px] ${
                        isLive
                          ? "text-emerald-400"
                          : "text-slate-500"
                      }`}
                    >
                      {isLive ? "LIVE" : vehicle.status?.toUpperCase()}
                    </span>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* Footer */}
      <button className="w-full mt-4 text-xs text-blue-400 hover:text-blue-300 transition">
        View all vehicles →
      </button>

    </div>
  );
}

export default VehicleTracking;
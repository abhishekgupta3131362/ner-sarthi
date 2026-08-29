import {
  Truck,
  MapPin,
  Fuel,
  Gauge,
  Eye,
} from "lucide-react";

function VehicleTable({
  vehicles,
  onSelect,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      {/* Table Header */}
      <div className="px-5 py-4 border-b border-slate-800">

        <h3 className="text-white font-semibold">
          Fleet Vehicles
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          Current vehicle operational status
        </p>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-slate-950/70">

            <tr>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Vehicle
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Driver
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Location
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Speed
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Fuel
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Risk
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Status
              </th>

              <th className="px-5 py-3">
              </th>

            </tr>

          </thead>

          <tbody>

            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-t border-slate-800 hover:bg-slate-800/30 transition"
              >

                {/* Vehicle */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">
                      <Truck
                        size={16}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>

                      <p className="text-sm text-white font-medium">
                        {vehicle.id}
                      </p>

                      <p className="text-[10px] text-slate-600 mt-1">
                        {vehicle.registration}
                      </p>

                    </div>

                  </div>

                </td>

                {/* Driver */}
                <td className="px-5 py-4">

                  <p className="text-xs text-slate-300">
                    {vehicle.driver}
                  </p>

                  <p className="text-[10px] text-slate-600 mt-1">
                    {vehicle.type}
                  </p>

                </td>

                {/* Location */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-1.5">

                    <MapPin
                      size={13}
                      className="text-slate-600"
                    />

                    <span className="text-xs text-slate-400">
                      {vehicle.location}
                    </span>

                  </div>

                </td>

                {/* Speed */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-1.5">

                    <Gauge
                      size={13}
                      className="text-slate-600"
                    />

                    <span className="text-xs text-slate-400">
                      {vehicle.speed} km/h
                    </span>

                  </div>

                </td>

                {/* Fuel */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-2">

                    <Fuel
                      size={13}
                      className={
                        vehicle.fuel < 25
                          ? "text-red-400"
                          : "text-slate-600"
                      }
                    />

                    <div className="w-16">

                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">

                        <div
                          className={`h-full rounded-full ${
                            vehicle.fuel < 25
                              ? "bg-red-500"
                              : vehicle.fuel < 50
                              ? "bg-yellow-500"
                              : "bg-emerald-500"
                          }`}
                          style={{
                            width: `${vehicle.fuel}%`,
                          }}
                        />

                      </div>

                      <p className="text-[9px] text-slate-600 mt-1">
                        {vehicle.fuel}%
                      </p>

                    </div>

                  </div>

                </td>

                {/* Risk */}
                <td className="px-5 py-4">

                  <RiskBadge
                    risk={vehicle.risk}
                  />

                </td>

                {/* Status */}
                <td className="px-5 py-4">

                  <StatusBadge
                    status={vehicle.status}
                  />

                </td>

                {/* Action */}
                <td className="px-5 py-4">

                  <button
                    onClick={() => onSelect(vehicle)}
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-700 transition"
                  >
                    <Eye size={15} />
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function RiskBadge({ risk }) {
  const styles = {
    LOW: "bg-emerald-500/10 text-emerald-400",
    MEDIUM: "bg-yellow-500/10 text-yellow-400",
    HIGH: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`text-[9px] px-2 py-1 rounded-full ${styles[risk]}`}
    >
      {risk}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: "bg-emerald-500/10 text-emerald-400",
    IDLE: "bg-yellow-500/10 text-yellow-400",
    MAINTENANCE: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`text-[9px] px-2 py-1 rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default VehicleTable;
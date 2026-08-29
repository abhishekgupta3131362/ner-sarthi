import {
  AlertTriangle,
  MapPin,
  Clock3,
  Eye,
} from "lucide-react";

function IncidentTable({
  incidents,
  onSelect,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800">

        <h3 className="text-white font-semibold">
          Incident Monitoring
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          Current road incidents and accessibility disruptions
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-slate-950/70">

            <tr>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Incident
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Location
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Road
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Severity
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Impact
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Reported
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Status
              </th>

              <th className="px-5 py-3">
              </th>

            </tr>

          </thead>

          <tbody>

            {incidents.map((incident) => (

              <tr
                key={incident.id}
                className="border-t border-slate-800 hover:bg-slate-800/30 transition"
              >

                {/* Incident */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">

                      <AlertTriangle
                        size={16}
                        className="text-red-400"
                      />

                    </div>

                    <div>

                      <p className="text-sm text-white font-medium">
                        {incident.title}
                      </p>

                      <p className="text-[10px] text-slate-600 mt-1">
                        {incident.id} • {incident.type}
                      </p>

                    </div>

                  </div>

                </td>

                {/* Location */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-1.5">

                    <MapPin
                      size={13}
                      className="text-slate-600"
                    />

                    <span className="text-xs text-slate-400">
                      {incident.location}
                    </span>

                  </div>

                </td>

                {/* Road */}
                <td className="px-5 py-4">

                  <span className="text-xs text-slate-300">
                    {incident.road}
                  </span>

                </td>

                {/* Severity */}
                <td className="px-5 py-4">

                  <SeverityBadge
                    severity={incident.severity}
                  />

                </td>

                {/* Impact */}
                <td className="px-5 py-4">

                  <p className="text-xs text-slate-300">
                    {incident.affectedVehicles} vehicles
                  </p>

                  <p className="text-[10px] text-slate-600 mt-1">
                    +{incident.estimatedDelay}
                  </p>

                </td>

                {/* Time */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-1.5">

                    <Clock3
                      size={13}
                      className="text-slate-600"
                    />

                    <span className="text-xs text-slate-500">
                      {incident.reportedAt}
                    </span>

                  </div>

                </td>

                {/* Status */}
                <td className="px-5 py-4">

                  <StatusBadge
                    status={incident.status}
                  />

                </td>

                {/* Action */}
                <td className="px-5 py-4">

                  <button
                    onClick={() =>
                      onSelect(incident)
                    }
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

      {incidents.length === 0 && (

        <div className="py-16 text-center">

          <AlertTriangle
            size={28}
            className="mx-auto text-slate-700"
          />

          <p className="text-sm text-slate-500 mt-3">
            No incidents found
          </p>

        </div>

      )}

    </div>
  );
}

function SeverityBadge({
  severity,
}) {
  const styles = {
    CRITICAL:
      "bg-red-500/10 text-red-400",

    HIGH:
      "bg-orange-500/10 text-orange-400",

    MEDIUM:
      "bg-yellow-500/10 text-yellow-400",

    LOW:
      "bg-emerald-500/10 text-emerald-400",
  };

  return (
    <span
      className={`text-[9px] px-2 py-1 rounded-full ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

function StatusBadge({
  status,
}) {
  const styles = {
    ACTIVE:
      "bg-red-500/10 text-red-400",

    MONITORING:
      "bg-yellow-500/10 text-yellow-400",

    RESOLVED:
      "bg-emerald-500/10 text-emerald-400",
  };

  return (
    <span
      className={`text-[9px] px-2 py-1 rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default IncidentTable;
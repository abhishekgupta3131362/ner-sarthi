import {
  AlertTriangle,
  Mountain,
  Droplets,
  Construction,
} from "lucide-react";

const incidents = [
  {
    type: "Landslide",
    location: "NH-06, Near Jowai",
    time: "10:20 AM",
    severity: "High",
    icon: Mountain,
  },
  {
    type: "Flooding",
    location: "NH-27, Near Silchar",
    time: "09:45 AM",
    severity: "High",
    icon: Droplets,
  },
  {
    type: "Road Block",
    location: "NH-102, Near Kohima",
    time: "08:30 AM",
    severity: "Medium",
    icon: Construction,
  },
];

function IncidentsOverview() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">

        <div>
          <h3 className="text-white font-semibold">
            Incidents Overview
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Recent road disruptions
          </p>
        </div>

        <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
          <AlertTriangle size={18} className="text-red-400" />
        </div>

      </div>

      {/* Incidents */}
      <div className="space-y-3">

        {incidents.map((incident) => {
          const Icon = incident.icon;

          return (
            <div
              key={incident.type}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800"
            >

              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Icon
                  size={16}
                  className="text-red-400"
                />
              </div>

              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between gap-2">

                  <p className="text-sm text-white font-medium">
                    {incident.type}
                  </p>

                  <span
                    className={`text-[9px] px-2 py-1 rounded-full ${
                      incident.severity === "High"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {incident.severity}
                  </span>

                </div>

                <div className="flex items-center justify-between mt-1">

                  <p className="text-[10px] text-slate-500 truncate">
                    {incident.location}
                  </p>

                  <p className="text-[10px] text-slate-600">
                    {incident.time}
                  </p>

                </div>

              </div>

            </div>
          );
        })}

      </div>

      <button className="w-full mt-4 text-xs text-red-400 hover:text-red-300 transition">
        View all incidents →
      </button>

    </div>
  );
}

export default IncidentsOverview;
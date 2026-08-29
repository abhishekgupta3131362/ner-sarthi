import {
  AlertTriangle,
  MapPin,
  Clock3,
} from "lucide-react";

function IncidentOverview({
  incidents,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      <div className="px-5 py-4 border-b border-slate-800">

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-white font-semibold">
              Recent Incidents
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Latest road disruptions
            </p>

          </div>

          <AlertTriangle
            size={17}
            className="text-slate-600"
          />

        </div>

      </div>

      <div>

        {incidents
          .slice(0, 5)
          .map((incident) => (

            <div
              key={incident.id}
              className="px-5 py-4 border-b border-slate-800 last:border-b-0"
            >

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">

                  <AlertTriangle
                    size={14}
                    className="text-red-400"
                  />

                </div>

                <div className="flex-1 min-w-0">

                  <div className="flex items-start justify-between gap-2">

                    <p className="text-xs text-white font-medium">
                      {incident.title}
                    </p>

                    <span
                      className={`text-[8px] px-2 py-1 rounded-full ${
                        incident.severity ===
                        "CRITICAL"
                          ? "bg-red-500/10 text-red-400"
                          : incident.severity ===
                            "HIGH"
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {incident.severity}
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-3 mt-2">

                    <div className="flex items-center gap-1">

                      <MapPin
                        size={10}
                        className="text-slate-600"
                      />

                      <span className="text-[9px] text-slate-600">
                        {incident.location}
                      </span>

                    </div>

                    <div className="flex items-center gap-1">

                      <Clock3
                        size={10}
                        className="text-slate-600"
                      />

                      <span className="text-[9px] text-slate-600">
                        {incident.reportedAt}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))}

      </div>

    </div>
  );
}

export default IncidentOverview;
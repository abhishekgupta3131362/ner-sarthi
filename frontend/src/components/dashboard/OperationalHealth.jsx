import {
  Activity,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

function OperationalHealth({
  score,
  criticalIncidents,
  delayedDeliveries,
}) {
  const getStatus = () => {
    if (score >= 80) {
      return {
        label: "STABLE",
        color: "text-emerald-400",
        background:
          "bg-emerald-500/10",
      };
    }

    if (score >= 60) {
      return {
        label: "MODERATE",
        color: "text-yellow-400",
        background:
          "bg-yellow-500/10",
      };
    }

    return {
      label: "HIGH RISK",
      color: "text-red-400",
      background:
        "bg-red-500/10",
    };
  };

  const status = getStatus();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs text-slate-500">
            Operational Health
          </p>

          <h3 className="text-lg font-semibold text-white mt-1">
            Network Status
          </h3>

        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${status.background}`}
        >

          {score >= 80 ? (
            <ShieldCheck
              size={19}
              className={status.color}
            />
          ) : (
            <AlertTriangle
              size={19}
              className={status.color}
            />
          )}

        </div>

      </div>

      <div className="flex items-center gap-6 mt-6">

        {/* Circle */}
        <div
          className="relative w-28 h-28 rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(rgb(16 185 129) ${score}%, rgb(30 41 59) ${score}% 100%)`,
          }}
        >

          <div className="absolute w-20 h-20 rounded-full bg-slate-900 flex flex-col items-center justify-center">

            <span className="text-2xl font-bold text-white">
              {score}
            </span>

            <span className="text-[9px] text-slate-600">
              SCORE
            </span>

          </div>

        </div>

        {/* Status */}
        <div>

          <span
            className={`text-[10px] px-2 py-1 rounded-full ${status.background} ${status.color}`}
          >
            {status.label}
          </span>

          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Current network condition based on
            active incidents and delivery delays.
          </p>

        </div>

      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

          <div className="flex items-center gap-2">

            <Activity
              size={14}
              className="text-red-400"
            />

            <span className="text-[10px] text-slate-600">
              Critical Incidents
            </span>

          </div>

          <p className="text-lg font-semibold text-white mt-2">
            {criticalIncidents}
          </p>

        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

          <div className="flex items-center gap-2">

            <Activity
              size={14}
              className="text-yellow-400"
            />

            <span className="text-[10px] text-slate-600">
              Delayed Deliveries
            </span>

          </div>

          <p className="text-lg font-semibold text-white mt-2">
            {delayedDeliveries}
          </p>

        </div>

      </div>

    </div>
  );
}

export default OperationalHealth;
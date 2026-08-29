import {
  Route,
  Clock3,
  ShieldCheck,
  Fuel,
  ArrowRight,
} from "lucide-react";

function RouteOptimization() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-[520px]">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">

        <div>
          <h3 className="text-white font-semibold">
            Route Optimization
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            AI-powered route recommendation
          </p>
        </div>

        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <Route size={18} className="text-emerald-400" />
        </div>

      </div>

      {/* Recommended */}
      <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs text-emerald-400 font-medium">
              RECOMMENDED
            </p>

            <h4 className="text-white font-semibold mt-1">
              Route B
            </h4>
          </div>

          <ShieldCheck
            size={22}
            className="text-emerald-400"
          />

        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">

          <div>
            <p className="text-[10px] text-slate-500">
              Distance
            </p>

            <p className="text-sm text-white mt-1">
              145 km
            </p>
          </div>

          <div>
            <p className="text-[10px] text-slate-500">
              ETA
            </p>

            <p className="text-sm text-white mt-1">
              4h 20m
            </p>
          </div>

          <div>
            <p className="text-[10px] text-slate-500">
              Risk
            </p>

            <p className="text-sm text-emerald-400 mt-1">
              LOW
            </p>
          </div>

        </div>

      </div>

      {/* Current Route */}
      <div className="mt-4 border border-slate-800 rounded-xl p-4">

        <div className="flex justify-between">

          <div>
            <p className="text-xs text-slate-500">
              CURRENT ROUTE
            </p>

            <h4 className="text-white font-medium mt-1">
              Route A
            </h4>
          </div>

          <span className="text-xs text-red-400">
            HIGH RISK
          </span>

        </div>

        <div className="flex items-center gap-5 mt-4">

          <div className="flex items-center gap-2">
            <Clock3 size={14} className="text-slate-500" />

            <span className="text-xs text-slate-400">
              3h 25m
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Fuel size={14} className="text-slate-500" />

            <span className="text-xs text-slate-400">
              ₹4,920
            </span>
          </div>

        </div>

      </div>

      {/* Alternative */}
      <div className="mt-4 border border-slate-800 rounded-xl p-4">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs text-slate-500">
              ALTERNATIVE
            </p>

            <h4 className="text-white font-medium mt-1">
              Route C
            </h4>
          </div>

          <ArrowRight size={18} className="text-slate-500" />

        </div>

        <p className="text-xs text-slate-500 mt-3">
          Moderate risk • 3h 50m • 132 km
        </p>

      </div>

      {/* Action */}
      <button className="w-full mt-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition">
        Assign Recommended Route
      </button>

    </div>
  );
}

export default RouteOptimization;

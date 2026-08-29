import {
  CheckCircle2,
  Route,
  ShieldCheck,
  Clock3,
  MapPin,
  Eye,
  Navigation,
} from "lucide-react";


function RouteComparison({
  routes = [],
  bestRoute = null,
  onRouteAssigned,
  onRoutePreview,
}) {

  if (!routes || routes.length === 0) {
    return null;
  }


  const handlePreview = (route) => {

    if (!route) {
      return;
    }

    console.log("Preview route:", route);

    if (onRoutePreview) {
      onRoutePreview(route);
    }

  };


  const handleAssign = (route) => {

    if (!route) {
      return;
    }

    console.log("Assign route:", route);

    localStorage.setItem(
      "selectedRoute",
      JSON.stringify(route)
    );

    if (onRouteAssigned) {
      onRouteAssigned(route);
    }

  };


  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[9px] uppercase tracking-widest text-slate-600">
            Optimization Engine
          </p>

          <h3 className="text-white font-semibold mt-1">
            Route Comparison
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Compare available routes using distance, ETA and risk
          </p>

        </div>

        <Route
          size={19}
          className="text-emerald-400"
        />

      </div>


      {/* =====================================================
          ROUTES
      ====================================================== */}

      <div className="space-y-3 mt-5">

        {routes.map((route, index) => {

          const isBest =
            bestRoute?.id === route?.id;


          const riskScore =
            route?.risk?.riskScore ??
            route?.riskScore ??
            "—";


          return (

            <div
              key={
                route?.id ||
                `route-${index}`
              }
              className={`rounded-xl border p-4 transition ${
                isBest
                  ? "bg-emerald-500/5 border-emerald-500/30"
                  : "bg-slate-950 border-slate-800 hover:border-slate-700"
              }`}
            >

              {/* =================================================
                  ROUTE HEADER
              ================================================== */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isBest
                        ? "bg-emerald-500/10"
                        : "bg-slate-900"
                    }`}
                  >

                    <Route
                      size={15}
                      className={
                        isBest
                          ? "text-emerald-400"
                          : "text-slate-500"
                      }
                    />

                  </div>


                  <div>

                    <p className="text-xs font-medium text-white">
                      {route?.name ||
                        `Route ${index + 1}`}
                    </p>


                    {isBest && (

                      <span className="text-[8px] text-emerald-400">
                        RECOMMENDED
                      </span>

                    )}

                  </div>

                </div>


                {/* =================================================
                    OPTIMIZATION SCORE
                ================================================== */}

                <div className="text-right">

                  <p className="text-[9px] text-slate-600">
                    OPTIMIZATION
                  </p>

                  <p
                    className={`text-lg font-bold ${
                      isBest
                        ? "text-emerald-400"
                        : "text-white"
                    }`}
                  >

                    {route?.optimizationScore ??
                      "—"}

                  </p>

                </div>

              </div>


              {/* =================================================
                  METRICS
              ================================================== */}

              <div className="grid grid-cols-3 gap-2 mt-4">

                <Metric
                  icon={MapPin}
                  label="Distance"
                  value={
                    route?.distanceText ||
                    "—"
                  }
                />


                <Metric
                  icon={Clock3}
                  label="ETA"
                  value={
                    route?.durationText ||
                    "—"
                  }
                />


                <Metric
                  icon={ShieldCheck}
                  label="Risk"
                  value={riskScore}
                />

              </div>


              {/* =================================================
                  RECOMMENDATION
              ================================================== */}

              {isBest && (

                <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-emerald-500/10">

                  <CheckCircle2
                    size={13}
                    className="text-emerald-400"
                  />

                  <span className="text-[9px] text-emerald-400">
                    Best balance of safety, distance
                    and travel time
                  </span>

                </div>

              )}


              {/* =================================================
                  ACTION BUTTONS
              ================================================== */}

              <div className="grid grid-cols-2 gap-2 mt-3">

                {/* PREVIEW */}

                <button
                  type="button"
                  onClick={() =>
                    handlePreview(route)
                  }
                  className="py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500/40 hover:bg-slate-800 text-[9px] font-medium flex items-center justify-center gap-2 transition"
                >

                  <Eye
                    size={12}
                  />

                  Preview Route

                </button>


                {/* ASSIGN */}

                <button
                  type="button"
                  onClick={() =>
                    handleAssign(route)
                  }
                  className={`py-2.5 rounded-lg text-[9px] font-bold flex items-center justify-center gap-2 transition ${
                    isBest
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                >

                  <Navigation
                    size={12}
                  />

                  Assign Route

                </button>

              </div>


              {/* =================================================
                  ASSIGNED INDICATOR
              ================================================== */}

              {isBest && (

                <div className="flex items-center gap-2 mt-3">

                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[7px] uppercase tracking-wider text-slate-600">
                    AI recommended route
                  </span>

                </div>

              )}

            </div>

          );

        })}

      </div>

    </div>

  );
}


/* =========================================================
   METRIC
========================================================= */

function Metric({
  icon: Icon,
  label,
  value,
}) {

  return (

    <div className="bg-slate-900 rounded-lg p-2">

      <div className="flex items-center gap-1">

        <Icon
          size={10}
          className="text-slate-600"
        />

        <span className="text-[8px] text-slate-600">
          {label}
        </span>

      </div>


      <p className="text-[10px] text-white mt-1">
        {value}
      </p>

    </div>

  );

}


export default RouteComparison;
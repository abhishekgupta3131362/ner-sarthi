import { useEffect, useMemo, useState } from "react";

import {
  Route,
  Clock3,
  ShieldCheck,
  Fuel,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  Eye,
} from "lucide-react";


function RouteResult({
  route,
  loading = false,
  onRouteAssigned,
  onRoutePreview,
}) {

  const [assigned, setAssigned] = useState(false);


  /* =========================================================
     RESET ASSIGNMENT WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    setAssigned(false);
  }, [route?.id]);


  /* =========================================================
     NORMALIZE RISK
  ========================================================= */

  const riskScore = useMemo(() => {

    if (!route) {
      return null;
    }

    if (
      typeof route.risk === "number"
    ) {
      return route.risk;
    }

    if (
      typeof route.risk?.riskScore === "number"
    ) {
      return route.risk.riskScore;
    }

    if (
      typeof route.riskScore === "number"
    ) {
      return route.riskScore;
    }

    return null;

  }, [route]);


  /* =========================================================
     RISK LABEL
  ========================================================= */

  const riskLabel = useMemo(() => {

    if (riskScore === null) {
      return "UNKNOWN";
    }

    if (riskScore <= 25) {
      return "LOW";
    }

    if (riskScore <= 50) {
      return "MEDIUM";
    }

    if (riskScore <= 75) {
      return "HIGH";
    }

    return "CRITICAL";

  }, [riskScore]);


  /* =========================================================
     DISTANCE
  ========================================================= */

  const distanceValue = useMemo(() => {

    if (!route) {
      return "—";
    }

    if (route.distanceText) {
      return route.distanceText;
    }

    if (
      typeof route.distance === "number"
    ) {

      /*
        OSRM returns distance in meters.
        If value is large, convert to km.
      */

      if (route.distance > 1000) {

        return `${(
          route.distance / 1000
        ).toFixed(1)} km`;

      }

      return `${route.distance} m`;

    }

    return "—";

  }, [route]);


  /* =========================================================
     ETA
  ========================================================= */

  const etaValue = useMemo(() => {

    if (!route) {
      return "—";
    }

    if (route.durationText) {
      return route.durationText;
    }

    if (route.eta) {
      return route.eta;
    }

    if (
      typeof route.duration === "number"
    ) {

      const totalMinutes =
        Math.round(
          route.duration / 60
        );

      const hours =
        Math.floor(
          totalMinutes / 60
        );

      const minutes =
        totalMinutes % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }

      return `${minutes}m`;

    }

    return "—";

  }, [route]);


  /* =========================================================
     FUEL COST
  ========================================================= */

  const fuelCost = useMemo(() => {

    if (!route) {
      return "—";
    }

    if (
      route.fuelCost !== undefined &&
      route.fuelCost !== null
    ) {
      return `₹${route.fuelCost}`;
    }

    /*
      Prototype estimation:
      ₹8 per km.
    */

    if (
      typeof route.distance === "number"
    ) {

      const distanceKm =
        route.distance > 1000
          ? route.distance / 1000
          : route.distance;

      return `₹${Math.round(
        distanceKm * 8
      ).toLocaleString("en-IN")}`;

    }

    return "—";

  }, [route]);


  /* =========================================================
     ASSIGN ROUTE
  ========================================================= */

  const handleAssign = () => {

    if (!route) {
      return;
    }


    console.log(
      "Assigning route:",
      route
    );


    /*
      Save locally for prototype.
    */

    localStorage.setItem(
      "assignedRoute",
      JSON.stringify(route)
    );


    setAssigned(true);


    /*
      Send route to parent.
    */

    if (onRouteAssigned) {

      onRouteAssigned(route);

    }

  };


  /* =========================================================
     PREVIEW ROUTE
  ========================================================= */

  const handlePreview = () => {

    if (!route) {
      return;
    }


    console.log(
      "Previewing route:",
      route
    );


    if (onRoutePreview) {

      onRoutePreview(route);

    }

  };


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[400px] flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 mx-auto border-2 border-slate-700 border-t-emerald-400 rounded-full animate-spin" />

          <p className="text-sm text-white mt-4">
            Optimizing route...
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Analyzing distance, time and risk
          </p>

        </div>

      </div>

    );

  }


  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (!route) {

    return (

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[400px] flex items-center justify-center">

        <div className="text-center max-w-sm">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center">

            <Route
              size={26}
              className="text-slate-500"
            />

          </div>


          <h3 className="text-white font-semibold mt-5">
            No Route Generated
          </h3>


          <p className="text-xs text-slate-500 mt-2">
            Select your source, destination and
            route preferences, then click
            Optimize Route.
          </p>

        </div>

      </div>

    );

  }


  /* =========================================================
     MAIN RESULT
  ========================================================= */

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-medium">
            AI Recommendation
          </p>


          <h3 className="text-xl font-bold text-white mt-1">
            {route.name || "Recommended Route"}
          </h3>


          <p className="text-xs text-slate-500 mt-1">
            Optimized for current accessibility conditions
          </p>

        </div>


        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">

          <ShieldCheck
            size={20}
            className="text-emerald-400"
          />

        </div>

      </div>


      {/* =====================================================
          MAIN RISK SCORE
      ====================================================== */}

      <div className="mt-6 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs text-slate-500">
              Overall Risk
            </p>


            <p className="text-3xl font-bold text-emerald-400 mt-1">

              {riskScore !== null
                ? `${riskScore}/100`
                : "—"}

            </p>

          </div>


          <div className="text-right">

            <p className="text-xs text-slate-500">
              Status
            </p>


            <div className="flex items-center gap-2 mt-1">

              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

              <p className="text-xs text-emerald-400 font-medium">
                {route.status ||
                  riskLabel}
              </p>

            </div>

          </div>

        </div>


        {/* RISK BAR */}

        {riskScore !== null && (

          <div className="mt-4">

            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(
                    Math.max(
                      riskScore,
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

        )}

      </div>


      {/* =====================================================
          METRICS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-3 mt-5">

        <Metric
          icon={Navigation}
          label="Distance"
          value={distanceValue}
        />


        <Metric
          icon={Clock3}
          label="Estimated Time"
          value={etaValue}
        />


        <Metric
          icon={Fuel}
          label="Estimated Fuel"
          value={fuelCost}
        />


        <Metric
          icon={AlertTriangle}
          label="Risk Score"
          value={
            riskScore !== null
              ? `${riskScore}/100`
              : "—"
          }
        />

      </div>


      {/* =====================================================
          ROUTE DETAILS
      ====================================================== */}

      <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800">

        <div className="flex items-center gap-2">

          <Route
            size={14}
            className="text-emerald-400"
          />

          <p className="text-xs font-medium text-white">
            Route Analysis
          </p>

        </div>


        <p className="text-xs text-slate-500 mt-2 leading-relaxed">

          This route provides the best available
          balance between travel time, road
          accessibility, estimated fuel cost and
          current risk conditions.

        </p>


        {/* RISK DETAILS */}

        {route.risk &&
          typeof route.risk === "object" && (

            <div className="grid grid-cols-3 gap-2 mt-4">

              <MiniStat
                label="Weather"
                value={
                  route.risk.weatherRisk ??
                  "—"
                }
              />

              <MiniStat
                label="Road"
                value={
                  route.risk.roadRisk ??
                  "—"
                }
              />

              <MiniStat
                label="Incidents"
                value={
                  route.risk.incidentRisk ??
                  "—"
                }
              />

            </div>

          )}

      </div>


      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-2 mt-5">

        {/* PREVIEW */}

        <button
          type="button"
          onClick={handlePreview}
          className="py-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
        >

          <Eye
            size={15}
          />

          Preview Route

        </button>


        {/* ASSIGN */}

        <button
          type="button"
          onClick={handleAssign}
          disabled={assigned}
          className={`py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition ${
            assigned
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
          }`}
        >

          {assigned ? (

            <>
              <CheckCircle2
                size={15}
              />

              Route Assigned
            </>

          ) : (

            <>
              <Navigation
                size={15}
              />

              Assign This Route
            </>

          )}

        </button>

      </div>


      {/* =====================================================
          ASSIGNMENT STATUS
      ====================================================== */}

      {assigned && (

        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">

          <CheckCircle2
            size={12}
            className="text-emerald-400"
          />

          <p className="text-[9px] text-emerald-400">
            Route assigned successfully and saved locally.
          </p>

        </div>

      )}

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

    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

      <Icon
        size={15}
        className="text-slate-500"
      />


      <p className="text-[10px] text-slate-600 mt-3">
        {label}
      </p>


      <p className="text-sm text-white font-medium mt-1">
        {value}
      </p>

    </div>

  );

}


/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  label,
  value,
}) {

  return (

    <div className="bg-slate-900 rounded-lg p-2">

      <p className="text-[7px] uppercase text-slate-600">
        {label}
      </p>

      <p className="text-[10px] text-white mt-1">
        {value}
      </p>

    </div>

  );

}


export default RouteResult;
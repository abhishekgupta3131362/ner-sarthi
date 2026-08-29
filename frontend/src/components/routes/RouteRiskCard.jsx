import {
  ShieldCheck,
  AlertTriangle,
  CloudRain,
  Route,
  Construction,
  Activity,
  CheckCircle2,
  Navigation2,
} from "lucide-react";


function RouteRiskCard({
  risk,
  distanceText,
  durationText,
}) {

  /* =========================================================
     SAFETY GUARD
  ========================================================= */

  if (!risk || typeof risk !== "object") {
    return null;
  }


  /* =========================================================
     NORMALIZE RISK DATA
  ========================================================= */

  const riskScore = clamp(
    Number(
      risk.riskScore ??
      risk.score ??
      0
    ),
    0,
    100
  );


  /*
    If safetyScore exists, use it.

    Otherwise derive safety from risk.
    Lower risk = higher safety.
  */

  const safetyScore = clamp(
    Number(
      risk.safetyScore ??
      (100 - riskScore)
    ),
    0,
    100
  );


  const riskLevel = String(
    risk.riskLevel ||
    getRiskLevel(riskScore)
  ).toUpperCase();


  const breakdown =
    risk.breakdown &&
    typeof risk.breakdown === "object"
      ? risk.breakdown
      : {};


  /* =========================================================
     RISK CONFIG
  ========================================================= */

  const riskConfig = getRiskConfig(
    riskLevel
  );


  /* =========================================================
     ROUTE DECISION
  ========================================================= */

  const routeDecision =
    getRouteDecision(
      riskLevel,
      safetyScore
    );


  /* =========================================================
     BREAKDOWN VALUES
  ========================================================= */

  const factors = [

    {
      icon: Route,
      label: "Distance Risk",
      value:
        breakdown.distanceRisk ??
        risk.distanceRisk ??
        0,
    },

    {
      icon: AlertTriangle,
      label: "Incident Risk",
      value:
        breakdown.incidentRisk ??
        risk.incidentRisk ??
        0,
    },

    {
      icon: CloudRain,
      label: "Weather Risk",
      value:
        breakdown.weatherRisk ??
        risk.weatherRisk ??
        0,
    },

    {
      icon: Construction,
      label: "Road Risk",
      value:
        breakdown.roadRisk ??
        risk.roadRisk ??
        0,
    },

  ];


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">


      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div
            className={`w-10 h-10 rounded-xl ${riskConfig.iconBg} flex items-center justify-center`}
          >

            {riskLevel === "LOW" ? (

              <ShieldCheck
                size={18}
                className={riskConfig.color}
              />

            ) : (

              <AlertTriangle
                size={18}
                className={riskConfig.color}
              />

            )}

          </div>


          <div>

            <p className="text-[8px] uppercase tracking-[0.2em] text-slate-600">
              Route Intelligence
            </p>

            <h3 className="text-white font-semibold text-sm mt-1">
              Safety Assessment
            </h3>

          </div>

        </div>


        {/* RISK BADGE */}

        <div
          className={`px-2.5 py-1 rounded-full border text-[8px] font-semibold ${riskConfig.background} ${riskConfig.color}`}
        >
          {riskLevel}
        </div>

      </div>


      {/* =====================================================
          SCORE AREA
      ====================================================== */}

      <div className="grid grid-cols-[110px_1fr] gap-5 items-center mt-6">


        {/* SAFETY RING */}

        <div className="relative w-[105px] h-[105px] flex items-center justify-center">

          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                `conic-gradient(
                  #10b981 ${safetyScore}%,
                  #1e293b ${safetyScore}%
                )`,
            }}
          />


          <div className="absolute inset-[6px] rounded-full bg-slate-900 flex flex-col items-center justify-center">

            <span className="text-2xl font-bold text-white">
              {Math.round(safetyScore)}
            </span>

            <span className="text-[7px] tracking-widest text-slate-600">
              SAFETY
            </span>

          </div>

        </div>


        {/* SCORE DETAILS */}

        <div>

          <p className="text-[8px] uppercase tracking-widest text-slate-600">
            Overall Route Risk
          </p>


          <p
            className={`text-3xl font-bold mt-1 ${riskConfig.color}`}
          >
            {Math.round(riskScore)}

            <span className="text-sm text-slate-600">
              /100
            </span>

          </p>


          <div className="flex items-center gap-2 mt-3">

            {routeDecision.icon === "check" ? (

              <CheckCircle2
                size={13}
                className="text-emerald-400"
              />

            ) : (

              <AlertTriangle
                size={13}
                className={riskConfig.color}
              />

            )}


            <span
              className={`text-[9px] font-medium ${routeDecision.color}`}
            >
              {routeDecision.title}
            </span>

          </div>


          <p className="text-[8px] text-slate-600 mt-1 leading-4">
            {routeDecision.description}
          </p>

        </div>

      </div>


      {/* =====================================================
          ROUTE SUMMARY
      ====================================================== */}

      {(distanceText || durationText) && (

        <div className="grid grid-cols-2 gap-2 mt-6">

          <SummaryBox
            icon={Navigation2}
            label="Distance"
            value={
              distanceText ||
              "Calculated"
            }
          />


          <SummaryBox
            icon={Activity}
            label="ETA"
            value={
              durationText ||
              "Calculated"
            }
          />

        </div>

      )}


      {/* =====================================================
          RISK BREAKDOWN
      ====================================================== */}

      <div className="mt-6">

        <div className="mb-4">

          <p className="text-[8px] uppercase tracking-widest text-slate-600">
            Risk Breakdown
          </p>

          <p className="text-[8px] text-slate-700 mt-1">
            Route conditions contributing to the assessment
          </p>

        </div>


        <div className="space-y-4">

          {factors.map((factor) => {

            const value = clamp(
              Number(factor.value || 0),
              0,
              100
            );


            return (

              <RiskFactor
                key={factor.label}
                icon={factor.icon}
                label={factor.label}
                value={value}
              />

            );

          })}

        </div>

      </div>


      {/* =====================================================
          DECISION FOOTER
      ====================================================== */}

      <div
        className={`mt-6 rounded-xl border p-4 ${riskConfig.background}`}
      >

        <div className="flex items-center gap-2">

          {riskLevel === "LOW" ? (

            <ShieldCheck
              size={15}
              className={riskConfig.color}
            />

          ) : (

            <AlertTriangle
              size={15}
              className={riskConfig.color}
            />

          )}


          <span
            className={`text-[9px] font-semibold ${riskConfig.color}`}
          >
            {routeDecision.footer}
          </span>

        </div>


        <p className="text-[8px] text-slate-500 leading-4 mt-2">

          {riskLevel === "LOW"
            ? "Route conditions are favorable for normal logistics operations."

            : riskLevel === "MEDIUM"
            ? "Route remains usable, but operational teams should monitor changing conditions."

            : riskLevel === "HIGH"
            ? "Dispatch should consider an alternative corridor and verify current field conditions."

            : "Route requires immediate operational review before dispatch."}

        </p>

      </div>

    </div>

  );
}


/* =========================================================
   RISK LEVEL
========================================================= */

function getRiskLevel(score) {

  if (score <= 25) {
    return "LOW";
  }

  if (score <= 50) {
    return "MEDIUM";
  }

  if (score <= 75) {
    return "HIGH";
  }

  return "CRITICAL";
}


/* =========================================================
   RISK CONFIG
========================================================= */

function getRiskConfig(level) {

  switch (level) {

    case "CRITICAL":

      return {
        color: "text-red-400",

        background:
          "bg-red-500/10 border-red-500/20",

        iconBg:
          "bg-red-500/10",
      };


    case "HIGH":

      return {
        color: "text-orange-400",

        background:
          "bg-orange-500/10 border-orange-500/20",

        iconBg:
          "bg-orange-500/10",
      };


    case "MEDIUM":

      return {
        color: "text-yellow-400",

        background:
          "bg-yellow-500/10 border-yellow-500/20",

        iconBg:
          "bg-yellow-500/10",
      };


    default:

      return {
        color: "text-emerald-400",

        background:
          "bg-emerald-500/10 border-emerald-500/20",

        iconBg:
          "bg-emerald-500/10",
      };

  }
}


/* =========================================================
   ROUTE DECISION
========================================================= */

function getRouteDecision(
  level,
  safety
) {

  if (
    level === "CRITICAL" ||
    safety < 40
  ) {

    return {

      title:
        "Avoid if possible",

      description:
        "High operational exposure detected.",

      footer:
        "ROUTE REQUIRES REVIEW",

      color:
        "text-red-400",

      icon:
        "alert",

    };
  }


  if (
    level === "HIGH" ||
    safety < 60
  ) {

    return {

      title:
        "Use with caution",

      description:
        "Additional monitoring is recommended.",

      footer:
        "CAUTION ADVISED",

      color:
        "text-orange-400",

      icon:
        "alert",

    };
  }


  if (
    level === "MEDIUM" ||
    safety < 80
  ) {

    return {

      title:
        "Operationally usable",

      description:
        "Monitor conditions during dispatch.",

      footer:
        "MONITOR CONDITIONS",

      color:
        "text-yellow-400",

      icon:
        "check",

    };
  }


  return {

    title:
      "Recommended route",

    description:
      "Current route conditions are favorable.",

    footer:
      "ROUTE APPROVED FOR DISPATCH",

    color:
      "text-emerald-400",

    icon:
      "check",

  };
}


/* =========================================================
   RISK FACTOR
========================================================= */

function RiskFactor({
  icon: Icon,
  label,
  value,
}) {

  const safeValue = clamp(
    Number(value || 0),
    0,
    100
  );


  const color =
    safeValue >= 70
      ? "bg-red-400"
      : safeValue >= 40
      ? "bg-yellow-400"
      : "bg-emerald-400";


  return (

    <div>

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <Icon
            size={13}
            className="text-slate-600"
          />

          <span className="text-[9px] text-slate-500">
            {label}
          </span>

        </div>


        <span className="text-[9px] font-medium text-slate-400">
          {Math.round(safeValue)}
        </span>

      </div>


      <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">

        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{
            width: `${safeValue}%`,
          }}
        />

      </div>

    </div>

  );
}


/* =========================================================
   SUMMARY BOX
========================================================= */

function SummaryBox({
  icon: Icon,
  label,
  value,
}) {

  return (

    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

      <div className="flex items-center gap-2">

        <Icon
          size={12}
          className="text-cyan-400"
        />

        <span className="text-[7px] uppercase tracking-wider text-slate-600">
          {label}
        </span>

      </div>


      <p className="text-sm font-semibold text-white mt-2">
        {String(value)}
      </p>

    </div>

  );
}


/* =========================================================
   CLAMP
========================================================= */

function clamp(
  value,
  min,
  max
) {

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    Math.max(value, min),
    max
  );
}


export default RouteRiskCard;
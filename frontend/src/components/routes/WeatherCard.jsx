import {
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";


function WeatherCard({ weather }) {
  if (!weather) {
    return null;
  }


  const risk = clamp(
    Number(weather.risk),
    0,
    100
  );


  const riskConfig =
    getRiskConfig(risk);


  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">

            <CloudRain
              size={18}
              className="text-blue-400"
            />

          </div>

          <div>

            <p className="text-[8px] uppercase tracking-widest text-slate-600">
              Live Weather Intelligence
            </p>

            <h3 className="text-sm font-semibold text-white mt-1">
              Current Conditions
            </h3>

          </div>

        </div>


        {/* RISK */}

        <div
          className={`px-3 py-1.5 rounded-full border text-[8px] font-semibold ${riskConfig.background} ${riskConfig.color}`}
        >
          {riskConfig.label}
        </div>

      </div>


      {/* =====================================================
          MAIN WEATHER
      ====================================================== */}

      <div className="mt-5 flex items-center justify-between">

        <div>

          <p className="text-4xl font-bold text-white">
            {Number.isFinite(
              Number(weather.temperature)
            )
              ? Math.round(
                  Number(weather.temperature)
                )
              : "—"}
            <span className="text-lg text-slate-500">
              °C
            </span>
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {weather.condition ||
              "Unknown conditions"}
          </p>

        </div>


        <div className="text-right">

          <p className="text-[8px] uppercase tracking-widest text-slate-600">
            Weather Risk
          </p>

          <p
            className={`text-3xl font-bold mt-1 ${riskConfig.color}`}
          >
            {Math.round(risk)}
            <span className="text-sm text-slate-600">
              /100
            </span>
          </p>

        </div>

      </div>


      {/* =====================================================
          WEATHER METRICS
      ====================================================== */}

      <div className="grid grid-cols-3 gap-2 mt-5">

        <WeatherMetric
          icon={CloudRain}
          label="Rain"
          value={`${safeValue(
            weather.rain
          )} mm`}
        />


        <WeatherMetric
          icon={Droplets}
          label="Humidity"
          value={`${safeValue(
            weather.humidity
          )}%`}
        />


        <WeatherMetric
          icon={Wind}
          label="Wind"
          value={`${safeValue(
            weather.windSpeed
          )} km/h`}
        />

      </div>


      {/* =====================================================
          RISK BAR
      ====================================================== */}

      <div className="mt-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            {risk >= 60 ? (

              <AlertTriangle
                size={13}
                className={riskConfig.color}
              />

            ) : (

              <ShieldCheck
                size={13}
                className={riskConfig.color}
              />

            )}

            <span className="text-[9px] text-slate-400">
              Weather impact on logistics
            </span>

          </div>

          <span
            className={`text-[9px] font-semibold ${riskConfig.color}`}
          >
            {Math.round(risk)}%
          </span>

        </div>


        <div className="h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">

          <div
            className={`h-full rounded-full transition-all duration-700 ${riskConfig.bar}`}
            style={{
              width: `${risk}%`,
            }}
          />

        </div>

      </div>


      {/* =====================================================
          OPERATIONAL MESSAGE
      ====================================================== */}

      <div
        className={`mt-5 rounded-xl border p-4 ${riskConfig.background}`}
      >

        <p
          className={`text-[9px] font-semibold ${riskConfig.color}`}
        >
          {riskConfig.title}
        </p>

        <p className="text-[8px] text-slate-500 leading-4 mt-2">
          {riskConfig.description}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   WEATHER METRIC
========================================================= */

function WeatherMetric({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

      <Icon
        size={14}
        className="text-slate-500"
      />

      <p className="text-[8px] uppercase text-slate-600 mt-3">
        {label}
      </p>

      <p className="text-xs font-semibold text-white mt-1">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   RISK CONFIG
========================================================= */

function getRiskConfig(risk) {

  if (risk >= 80) {
    return {
      label: "CRITICAL",
      color: "text-red-400",
      background:
        "bg-red-500/10 border-red-500/20",
      bar: "bg-red-400",
      title:
        "Severe weather conditions",
      description:
        "Dispatch should be reviewed immediately. Heavy rainfall, strong winds or severe weather may significantly affect logistics accessibility.",
    };
  }


  if (risk >= 60) {
    return {
      label: "HIGH RISK",
      color: "text-orange-400",
      background:
        "bg-orange-500/10 border-orange-500/20",
      bar: "bg-orange-400",
      title:
        "High weather impact",
      description:
        "Transport operations should proceed with caution and changing weather conditions should be monitored.",
    };
  }


  if (risk >= 35) {
    return {
      label: "MEDIUM RISK",
      color: "text-yellow-400",
      background:
        "bg-yellow-500/10 border-yellow-500/20",
      bar: "bg-yellow-400",
      title:
        "Moderate weather impact",
      description:
        "The route remains operational, but weather conditions may affect travel time and road accessibility.",
    };
  }


  return {
    label: "LOW RISK",
    color: "text-emerald-400",
    background:
      "bg-emerald-500/10 border-emerald-500/20",
    bar: "bg-emerald-400",
    title:
      "Favorable weather conditions",
    description:
      "Current weather conditions are favorable for normal logistics operations.",
  };
}


/* =========================================================
   SAFE VALUE
========================================================= */

function safeValue(value) {

  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return Number.isInteger(number)
    ? number
    : number.toFixed(1);
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
    Math.max(
      value,
      min
    ),
    max
  );
}


export default WeatherCard;
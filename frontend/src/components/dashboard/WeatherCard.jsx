import {
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
} from "lucide-react";

function WeatherCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-white font-semibold">
            Weather Overview
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Current regional conditions
          </p>
        </div>

        <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center">
          <CloudRain size={18} className="text-sky-400" />
        </div>

      </div>

      {/* Main Weather */}
      <div className="flex items-center gap-5 mt-6">

        <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center">
          <CloudRain
            size={38}
            className="text-sky-400"
          />
        </div>

        <div>

          <div className="flex items-start">

            <span className="text-4xl font-bold text-white">
              22°
            </span>

            <span className="text-sm text-slate-500 mt-1">
              C
            </span>

          </div>

          <p className="text-sm text-slate-400 mt-1">
            Light Rain
          </p>

        </div>

      </div>

      {/* Weather Stats */}
      <div className="grid grid-cols-3 gap-2 mt-6">

        <WeatherStat
          icon={Droplets}
          label="Rainfall"
          value="32 mm"
        />

        <WeatherStat
          icon={Thermometer}
          label="Humidity"
          value="89%"
        />

        <WeatherStat
          icon={Wind}
          label="Wind"
          value="12 km/h"
        />

      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">

        <p className="text-[10px] text-slate-600">
          Location: Guwahati
        </p>

        <button className="text-xs text-sky-400 hover:text-sky-300">
          Full forecast →
        </button>

      </div>

    </div>
  );
}

function WeatherStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-950/60 rounded-xl p-3">

      <Icon
        size={14}
        className="text-slate-500 mb-2"
      />

      <p className="text-[10px] text-slate-600">
        {label}
      </p>

      <p className="text-xs text-white font-medium mt-1">
        {value}
      </p>

    </div>
  );
}

export default WeatherCard;
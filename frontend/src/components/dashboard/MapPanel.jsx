import {
  MapPin,
  Navigation,
  Layers,
  Plus,
  Minus,
} from "lucide-react";

function MapPanel() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-[520px] relative">

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-slate-950/90 to-transparent">
        
        <div>
          <h3 className="text-white font-semibold">
            Live Operations Map
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Real-time accessibility intelligence
          </p>
        </div>

        <button className="p-2 rounded-lg bg-slate-800/90 text-slate-300 hover:text-white">
          <Layers size={18} />
        </button>

      </div>

      {/* Fake Map */}
      <div className="absolute inset-0 bg-slate-950">

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />

        {/* Roads */}
        <div className="absolute w-[80%] h-[3px] bg-slate-600 rotate-[18deg] top-[45%] left-[8%]" />

        <div className="absolute w-[75%] h-[3px] bg-slate-600 rotate-[-12deg] top-[55%] left-[15%]" />

        <div className="absolute w-[3px] h-[70%] bg-slate-600 rotate-[25deg] top-[15%] left-[48%]" />

        {/* Route */}
        <div className="absolute w-[65%] h-[5px] bg-emerald-500 rotate-[18deg] top-[48%] left-[17%] shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

        {/* Vehicle */}
        <div className="absolute top-[41%] left-[44%] w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
          <Navigation size={18} className="text-emerald-400 rotate-45" />
        </div>

        {/* Risk location */}
        <div className="absolute top-[31%] right-[25%]">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center animate-pulse">
            <MapPin size={20} className="text-red-400" />
          </div>

          <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-[10px] px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
              HIGH RISK
            </span>
          </div>
        </div>

        {/* Hospital */}
        <div className="absolute bottom-[20%] right-[20%] w-9 h-9 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center">
          <span className="text-blue-400 font-bold">
            +
          </span>
        </div>

      </div>

      {/* Map Controls */}
      <div className="absolute bottom-5 right-5 flex flex-col gap-2">

        <button className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white">
          <Plus size={18} />
        </button>

        <button className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white">
          <Minus size={18} />
        </button>

      </div>

      {/* Legend */}
      <div className="absolute bottom-5 left-5 bg-slate-900/95 border border-slate-800 rounded-xl p-3">

        <p className="text-xs font-medium text-white mb-2">
          Risk Level
        </p>

        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Safe
          </span>

          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            Medium
          </span>

          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            High
          </span>
        </div>

      </div>

    </div>
  );
}

export default MapPanel;
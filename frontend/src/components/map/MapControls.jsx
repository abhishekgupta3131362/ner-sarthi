import {
  Search,
  Truck,
  Hospital,
  Warehouse,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

function MapControls({
  layers,
  setLayers,
}) {
  const toggleLayer = (layer) => {
    setLayers((current) => ({
      ...current,
      [layer]: !current[layer],
    }));
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] w-72">

      {/* Search */}
      <div className="bg-slate-950/95 border border-slate-700 rounded-xl p-2 shadow-xl">

        <div className="flex items-center gap-2 px-2">

          <Search
            size={17}
            className="text-slate-500"
          />

          <input
            type="text"
            placeholder="Search location..."
            className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-600"
          />

        </div>

      </div>

      {/* Layers */}
      <div className="mt-3 bg-slate-950/95 border border-slate-700 rounded-xl p-4 shadow-xl">

        <p className="text-xs font-semibold text-white mb-3">
          Map Layers
        </p>

        <LayerToggle
          icon={Truck}
          label="Vehicles"
          active={layers.vehicles}
          onClick={() => toggleLayer("vehicles")}
        />

        <LayerToggle
          icon={Hospital}
          label="Hospitals"
          active={layers.hospitals}
          onClick={() => toggleLayer("hospitals")}
        />

        <LayerToggle
          icon={Warehouse}
          label="Warehouses"
          active={layers.warehouses}
          onClick={() => toggleLayer("warehouses")}
        />

        <LayerToggle
          icon={AlertTriangle}
          label="Incidents"
          active={layers.incidents}
          onClick={() => toggleLayer("incidents")}
        />

        <LayerToggle
          icon={ShieldAlert}
          label="Risk Zones"
          active={layers.riskZones}
          onClick={() => toggleLayer("riskZones")}
        />

      </div>

    </div>
  );
}

function LayerToggle({
  icon: Icon,
  label,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-2.5 group"
    >

      <div className="flex items-center gap-3">

        <Icon
          size={16}
          className={
            active
              ? "text-emerald-400"
              : "text-slate-600"
          }
        />

        <span
          className={
            active
              ? "text-sm text-white"
              : "text-sm text-slate-500"
          }
        >
          {label}
        </span>

      </div>

      <div
        className={`w-8 h-4 rounded-full transition ${
          active
            ? "bg-emerald-500"
            : "bg-slate-700"
        }`}
      >
        <div
          className={`w-3 h-3 mt-0.5 rounded-full bg-white transition ${
            active
              ? "translate-x-4"
              : "translate-x-0.5"
          }`}
        />
      </div>

    </button>
  );
}

export default MapControls;
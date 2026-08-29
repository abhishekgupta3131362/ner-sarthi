import {
  X,
  Truck,
  User,
  MapPin,
  Gauge,
  Fuel,
  Package,
  ShieldAlert,
} from "lucide-react";

function VehicleDetails({
  vehicle,
  onClose,
}) {
  if (!vehicle) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5">

      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Truck
                size={20}
                className="text-emerald-400"
              />
            </div>

            <div>

              <h3 className="text-white font-semibold">
                {vehicle.id}
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                {vehicle.registration}
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 hover:text-white"
          >
            <X size={17} />
          </button>

        </div>

        {/* Details */}
        <div className="p-5">

          <div className="grid grid-cols-2 gap-3">

            <Detail
              icon={User}
              label="Driver"
              value={vehicle.driver}
            />

            <Detail
              icon={MapPin}
              label="Location"
              value={vehicle.location}
            />

            <Detail
              icon={Gauge}
              label="Speed"
              value={`${vehicle.speed} km/h`}
            />

            <Detail
              icon={Fuel}
              label="Fuel"
              value={`${vehicle.fuel}%`}
            />

            <Detail
              icon={Package}
              label="Cargo"
              value={vehicle.cargo}
            />

            <Detail
              icon={ShieldAlert}
              label="Risk"
              value={vehicle.risk}
            />

          </div>

          {/* Cargo */}
          <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">

            <p className="text-[10px] text-slate-600 uppercase tracking-wider">
              Cargo Information
            </p>

            <div className="flex items-center justify-between mt-3">

              <div>

                <p className="text-sm text-white">
                  {vehicle.cargo}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Weight: {vehicle.cargoWeight}
                </p>

              </div>

              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                IN TRANSIT
              </span>

            </div>

          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mt-5">

            <button className="py-3 rounded-xl border border-slate-800 text-sm text-slate-300 hover:bg-slate-900 transition">
              View on Map
            </button>

            <button className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-slate-950 transition">
              Track Vehicle
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">

      <Icon
        size={15}
        className="text-slate-500"
      />

      <p className="text-[10px] text-slate-600 mt-3">
        {label}
      </p>

      <p className="text-sm text-white mt-1">
        {value}
      </p>

    </div>
  );
}

export default VehicleDetails;
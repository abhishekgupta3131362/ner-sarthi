import {
  X,
  Package,
  MapPin,
  Truck,
  User,
  Clock3,
  ShieldAlert,
  Navigation,
} from "lucide-react";

function DeliveryDetails({
  delivery,
  onClose,
}) {
  if (!delivery) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5">

      <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">

              <Package
                size={20}
                className="text-blue-400"
              />

            </div>

            <div>

              <h3 className="text-white font-semibold">
                {delivery.id}
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Shipment details
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

        {/* Body */}
        <div className="p-5">

          {/* Route */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Delivery Route
            </p>

            <div className="mt-4 flex items-start gap-3">

              <div className="flex flex-col items-center">

                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <MapPin
                    size={15}
                    className="text-emerald-400"
                  />
                </div>

                <div className="h-10 border-l border-dashed border-slate-700" />

                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <MapPin
                    size={15}
                    className="text-red-400"
                  />
                </div>

              </div>

              <div className="space-y-7">

                <div>

                  <p className="text-[10px] text-slate-600">
                    ORIGIN
                  </p>

                  <p className="text-sm text-white mt-1">
                    {delivery.origin}
                  </p>

                </div>

                <div>

                  <p className="text-[10px] text-slate-600">
                    DESTINATION
                  </p>

                  <p className="text-sm text-white mt-1">
                    {delivery.destination}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 mt-4">

            <Detail
              icon={Package}
              label="Cargo"
              value={delivery.cargo}
            />

            <Detail
              icon={Truck}
              label="Vehicle"
              value={delivery.vehicle}
            />

            <Detail
              icon={User}
              label="Driver"
              value={delivery.driver}
            />

            <Detail
              icon={Clock3}
              label="ETA"
              value={delivery.eta}
            />

            <Detail
              icon={ShieldAlert}
              label="Risk"
              value={delivery.risk}
            />

            <Detail
              icon={Navigation}
              label="Progress"
              value={`${delivery.progress}%`}
            />

          </div>

          {/* Progress */}
          <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">

            <div className="flex items-center justify-between">

              <p className="text-xs text-slate-400">
                Delivery Progress
              </p>

              <p className="text-xs text-emerald-400">
                {delivery.progress}%
              </p>

            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mt-3">

              <div
                className={`h-full rounded-full ${
                  delivery.status === "DELAYED"
                    ? "bg-red-500"
                    : "bg-emerald-500"
                }`}
                style={{
                  width: `${delivery.progress}%`,
                }}
              />

            </div>

          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mt-5">

            <button className="py-3 rounded-xl border border-slate-800 text-sm text-slate-300 hover:bg-slate-900 transition">
              View Route
            </button>

            <button className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-slate-950 transition">
              Track Shipment
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

      <p className="text-sm text-white mt-1 truncate">
        {value}
      </p>

    </div>
  );
}

export default DeliveryDetails;
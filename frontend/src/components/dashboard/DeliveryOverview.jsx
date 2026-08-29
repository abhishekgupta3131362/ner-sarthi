import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

function DeliveryOverview({
  deliveries,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      <div className="px-5 py-4 border-b border-slate-800">

        <h3 className="text-white font-semibold">
          Delivery Performance
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          Current shipment activity
        </p>

      </div>

      <div className="p-5">

        <div className="space-y-4">

          {deliveries
            .slice(0, 5)
            .map((delivery) => (

              <div
                key={delivery.id}
                className="flex items-center gap-3"
              >

                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    delivery.status ===
                    "DELAYED"
                      ? "bg-red-500/10"
                      : delivery.status ===
                        "DELIVERED"
                      ? "bg-emerald-500/10"
                      : "bg-blue-500/10"
                  }`}
                >

                  {delivery.status ===
                  "DELAYED" ? (
                    <AlertTriangle
                      size={15}
                      className="text-red-400"
                    />
                  ) : delivery.status ===
                    "DELIVERED" ? (
                    <CheckCircle2
                      size={15}
                      className="text-emerald-400"
                    />
                  ) : (
                    <Truck
                      size={15}
                      className="text-blue-400"
                    />
                  )}

                </div>

                <div className="flex-1 min-w-0">

                  <div className="flex justify-between gap-3">

                    <p className="text-xs text-white">
                      {delivery.id}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      {delivery.progress}%
                    </p>

                  </div>

                  <p className="text-[10px] text-slate-600 mt-1 truncate">
                    {delivery.origin} →{" "}
                    {delivery.destination}
                  </p>

                  <div className="h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">

                    <div
                      className={`h-full rounded-full ${
                        delivery.status ===
                        "DELAYED"
                          ? "bg-red-500"
                          : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${delivery.progress}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            ))}

        </div>

      </div>

    </div>
  );
}

export default DeliveryOverview;
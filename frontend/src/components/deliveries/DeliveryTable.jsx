import {
  Package,
  MapPin,
  Truck,
  Clock3,
  Eye,
} from "lucide-react";

function DeliveryTable({
  deliveries,
  onSelect,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800">

        <h3 className="text-white font-semibold">
          Shipment Management
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          Current delivery and shipment status
        </p>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-slate-950/70">

            <tr>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Shipment
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Route
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Cargo
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Vehicle
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Progress
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                ETA
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Priority
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Risk
              </th>

              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-600">
                Status
              </th>

              <th className="px-5 py-3">
              </th>

            </tr>

          </thead>

          <tbody>

            {deliveries.map((delivery) => (

              <tr
                key={delivery.id}
                className="border-t border-slate-800 hover:bg-slate-800/30 transition"
              >

                {/* Shipment */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">

                      <Package
                        size={16}
                        className="text-blue-400"
                      />

                    </div>

                    <div>

                      <p className="text-sm text-white font-medium">
                        {delivery.id}
                      </p>

                      <p className="text-[10px] text-slate-600 mt-1">
                        {delivery.createdAt}
                      </p>

                    </div>

                  </div>

                </td>

                {/* Route */}
                <td className="px-5 py-4 min-w-[230px]">

                  <div className="flex items-start gap-2">

                    <MapPin
                      size={13}
                      className="text-slate-600 mt-0.5 shrink-0"
                    />

                    <div>

                      <p className="text-xs text-slate-300">
                        {delivery.origin}
                      </p>

                      <div className="h-2 border-l border-dashed border-slate-700 ml-1.5" />

                      <p className="text-xs text-slate-400">
                        {delivery.destination}
                      </p>

                    </div>

                  </div>

                </td>

                {/* Cargo */}
                <td className="px-5 py-4">

                  <p className="text-xs text-slate-300">
                    {delivery.cargo}
                  </p>

                  <p className="text-[10px] text-slate-600 mt-1">
                    {delivery.weight}
                  </p>

                </td>

                {/* Vehicle */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-2">

                    <Truck
                      size={13}
                      className="text-slate-600"
                    />

                    <div>

                      <p className="text-xs text-slate-300">
                        {delivery.vehicle}
                      </p>

                      <p className="text-[10px] text-slate-600 mt-1">
                        {delivery.driver}
                      </p>

                    </div>

                  </div>

                </td>

                {/* Progress */}
                <td className="px-5 py-4 min-w-[130px]">

                  <div className="flex items-center justify-between mb-1">

                    <span className="text-[10px] text-slate-500">
                      {delivery.progress}%
                    </span>

                  </div>

                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">

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

                </td>

                {/* ETA */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-1.5">

                    <Clock3
                      size={13}
                      className={
                        delivery.status === "DELAYED"
                          ? "text-red-400"
                          : "text-slate-600"
                      }
                    />

                    <span className="text-xs text-slate-400">
                      {delivery.eta}
                    </span>

                  </div>

                </td>

                {/* Priority */}
                <td className="px-5 py-4">

                  <PriorityBadge
                    priority={delivery.priority}
                  />

                </td>

                {/* Risk */}
                <td className="px-5 py-4">

                  <RiskBadge
                    risk={delivery.risk}
                  />

                </td>

                {/* Status */}
                <td className="px-5 py-4">

                  <StatusBadge
                    status={delivery.status}
                  />

                </td>

                {/* Action */}
                <td className="px-5 py-4">

                  <button
                    onClick={() => onSelect(delivery)}
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-700 transition"
                  >
                    <Eye size={15} />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {deliveries.length === 0 && (

        <div className="py-16 text-center">

          <Package
            size={28}
            className="mx-auto text-slate-700"
          />

          <p className="text-sm text-slate-500 mt-3">
            No deliveries found
          </p>

        </div>

      )}

    </div>
  );
}

function PriorityBadge({
  priority,
}) {
  const styles = {
    NORMAL:
      "bg-slate-800 text-slate-400",

    IMPORTANT:
      "bg-yellow-500/10 text-yellow-400",

    CRITICAL:
      "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`text-[9px] px-2 py-1 rounded-full ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function RiskBadge({
  risk,
}) {
  const styles = {
    LOW:
      "bg-emerald-500/10 text-emerald-400",

    MEDIUM:
      "bg-yellow-500/10 text-yellow-400",

    HIGH:
      "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`text-[9px] px-2 py-1 rounded-full ${styles[risk]}`}
    >
      {risk}
    </span>
  );
}

function StatusBadge({
  status,
}) {
  const styles = {
    "IN TRANSIT":
      "bg-blue-500/10 text-blue-400",

    DELIVERED:
      "bg-emerald-500/10 text-emerald-400",

    DELAYED:
      "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`text-[9px] px-2 py-1 rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default DeliveryTable;
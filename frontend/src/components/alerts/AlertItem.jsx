import {
  AlertTriangle,
  CloudRain,
  Truck,
  Package,
  Info,
  CheckCircle2,
  MapPin,
  Clock3,
} from "lucide-react";

function AlertItem({
  alert,
  onRead,
}) {
  const config = getAlertConfig(
    alert.type
  );

  const Icon = config.icon;

  return (
    <div
      className={`p-4 border-b border-slate-800 transition ${
        !alert.read
          ? "bg-slate-800/20"
          : "bg-transparent"
      }`}
    >

      <div className="flex gap-4">

        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.background}`}
        >
          <Icon
            size={18}
            className={config.color}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          <div className="flex items-start justify-between gap-3">

            <div>

              <div className="flex items-center gap-2">

                <h4 className="text-sm font-medium text-white">
                  {alert.title}
                </h4>

                {!alert.read && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}

              </div>

              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {alert.message}
              </p>

            </div>

            <span
              className={`text-[9px] px-2 py-1 rounded-full shrink-0 ${config.badge}`}
            >
              {alert.type}
            </span>

          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-3">

            <div className="flex items-center gap-1.5">

              <MapPin
                size={12}
                className="text-slate-600"
              />

              <span className="text-[10px] text-slate-600">
                {alert.location}
              </span>

            </div>

            <div className="flex items-center gap-1.5">

              <Clock3
                size={12}
                className="text-slate-600"
              />

              <span className="text-[10px] text-slate-600">
                {alert.time}
              </span>

            </div>

          </div>

          {/* Action */}
          <div className="flex items-center gap-3 mt-4">

            <button
              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium"
            >
              {alert.action}
            </button>

            {!alert.read && (
              <button
                onClick={() => onRead(alert.id)}
                className="text-[10px] text-slate-600 hover:text-white"
              >
                Mark as read
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

function getAlertConfig(type) {
  const config = {
    CRITICAL: {
      icon: AlertTriangle,
      color: "text-red-400",
      background: "bg-red-500/10",
      badge: "bg-red-500/10 text-red-400",
    },

    WARNING: {
      icon: CloudRain,
      color: "text-yellow-400",
      background: "bg-yellow-500/10",
      badge: "bg-yellow-500/10 text-yellow-400",
    },

    INFO: {
      icon: Info,
      color: "text-blue-400",
      background: "bg-blue-500/10",
      badge: "bg-blue-500/10 text-blue-400",
    },

    SUCCESS: {
      icon: CheckCircle2,
      color: "text-emerald-400",
      background: "bg-emerald-500/10",
      badge: "bg-emerald-500/10 text-emerald-400",
    },
  };

  return (
    config[type] || config.INFO
  );
}

export default AlertItem;
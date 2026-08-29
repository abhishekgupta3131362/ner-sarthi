import { TrendingUp, Clock3, AlertCircle } from "lucide-react";

const deliveryData = [
  { day: "Mon", value: 84 },
  { day: "Tue", value: 88 },
  { day: "Wed", value: 86 },
  { day: "Thu", value: 91 },
  { day: "Fri", value: 89 },
  { day: "Sat", value: 94 },
  { day: "Sun", value: 92 },
];

function DeliveryPerformance() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-white font-semibold">
            Delivery Performance
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Weekly delivery efficiency
          </p>
        </div>

        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <TrendingUp
            size={18}
            className="text-emerald-400"
          />
        </div>

      </div>

      {/* Chart */}
      <div className="mt-6">

        <div className="flex items-end justify-between h-32 gap-2">

          {deliveryData.map((item) => (
            <div
              key={item.day}
              className="flex-1 h-full flex flex-col justify-end items-center gap-2"
            >

              {/* Bar */}
              <div
                className="w-full max-w-7 rounded-t-md bg-emerald-500/70 hover:bg-emerald-400 transition"
                style={{
                  height: `${item.value}%`,
                }}
              />

              <span className="text-[9px] text-slate-600">
                {item.day}
              </span>

            </div>
          ))}

        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-6">

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">

          <div className="flex items-center gap-2">

            <Clock3
              size={14}
              className="text-emerald-400"
            />

            <span className="text-[10px] text-slate-500">
              On-Time Delivery
            </span>

          </div>

          <p className="text-2xl font-bold text-white mt-2">
            92%
          </p>

          <p className="text-[10px] text-emerald-400 mt-1">
            +4.2% this week
          </p>

        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">

          <div className="flex items-center gap-2">

            <AlertCircle
              size={14}
              className="text-red-400"
            />

            <span className="text-[10px] text-slate-500">
              Delayed
            </span>

          </div>

          <p className="text-2xl font-bold text-white mt-2">
            8%
          </p>

          <p className="text-[10px] text-red-400 mt-1">
            -2.1% this week
          </p>

        </div>

      </div>

    </div>
  );
}

export default DeliveryPerformance;
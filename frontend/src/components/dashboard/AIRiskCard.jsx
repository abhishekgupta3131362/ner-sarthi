import { Brain, Droplets, Mountain, Car, CloudRain } from "lucide-react";

function AIRiskCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold">
            AI Risk Prediction
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Current accessibility risk
          </p>
        </div>

        <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Brain size={18} className="text-purple-400" />
        </div>
      </div>

      {/* Risk Score */}
      <div className="flex items-center gap-5">

        <div className="relative w-28 h-28 flex items-center justify-center">

          <div className="absolute inset-0 rounded-full border-[10px] border-slate-800" />

          <div
            className="absolute inset-0 rounded-full border-[10px] border-red-500"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 72%, 0 72%)",
            }}
          />

          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              72%
            </p>

            <p className="text-[10px] text-red-400 font-medium">
              HIGH
            </p>
          </div>

        </div>

        {/* Factors */}
        <div className="flex-1 space-y-3">

          <RiskItem
            icon={Droplets}
            label="Flood Risk"
            value="68%"
            color="text-blue-400"
          />

          <RiskItem
            icon={Mountain}
            label="Landslide Risk"
            value="52%"
            color="text-orange-400"
          />

          <RiskItem
            icon={Car}
            label="Traffic Risk"
            value="34%"
            color="text-yellow-400"
          />

          <RiskItem
            icon={CloudRain}
            label="Weather Impact"
            value="HIGH"
            color="text-red-400"
          />

        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-slate-800">
        <p className="text-[11px] text-slate-600">
          Updated 2 minutes ago
        </p>
      </div>

    </div>
  );
}

function RiskItem({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2">

        <Icon
          size={14}
          className={color}
        />

        <span className="text-xs text-slate-400">
          {label}
        </span>

      </div>

      <span className={`text-xs font-medium ${color}`}>
        {value}
      </span>

    </div>
  );
}

export default AIRiskCard;
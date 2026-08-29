import {
  Brain,
  Route,
  Radio,
  Map,
  WifiOff,
  Bell,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI/ML Prediction",
    description: "Risk forecasting",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Route,
    title: "Route Optimization",
    description: "Multi-criteria routing",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Radio,
    title: "Real-time Tracking",
    description: "Live GPS & ETA",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Map,
    title: "GIS & Mapping",
    description: "Geospatial intelligence",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: WifiOff,
    title: "Offline Support",
    description: "Sync when online",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Bell,
    title: "Alerts",
    description: "Multi-channel alerts",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Scalable & Secure",
    description: "Role-based access",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
];

function FeatureStrip() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">

        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/60 transition"
            >

              <div
                className={`w-9 h-9 rounded-lg ${feature.bg} flex items-center justify-center shrink-0`}
              >
                <Icon
                  size={17}
                  className={feature.color}
                />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-medium text-white truncate">
                  {feature.title}
                </p>

                <p className="text-[9px] text-slate-600 mt-1 truncate">
                  {feature.description}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default FeatureStrip;
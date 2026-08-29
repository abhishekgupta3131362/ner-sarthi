import { ArrowUpRight } from "lucide-react";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
      
      {/* Top */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="text-3xl font-bold text-white mt-2">
            {value}
          </h3>
        </div>

        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
          <Icon size={20} className="text-slate-300" />
        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between mt-5">
        <p className="text-xs text-slate-500">
          {description}
        </p>

        {trend && (
          <div className="flex items-center gap-1 text-xs text-emerald-400">
            <ArrowUpRight size={14} />
            {trend}
          </div>
        )}
      </div>

    </div>
  );
}

export default StatCard;
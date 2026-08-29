function IntelligenceStat({
  label,
  value,
  description,
  icon: Icon,
  iconColor,
  trend,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs text-slate-500">
            {label}
          </p>

          <p className="text-3xl font-bold text-white mt-2">
            {value}
          </p>

        </div>

        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">

          <Icon
            size={19}
            className={iconColor}
          />

        </div>

      </div>

      <div className="flex items-center justify-between mt-4">

        <p className="text-[10px] text-slate-600">
          {description}
        </p>

        {trend && (
          <span className="text-[10px] text-emerald-400">
            {trend}
          </span>
        )}

      </div>

    </div>
  );
}

export default IntelligenceStat;
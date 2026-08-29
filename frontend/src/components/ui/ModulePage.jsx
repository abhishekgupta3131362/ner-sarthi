import {
  Map,
  Truck,
  Package,
  Route,
  AlertTriangle,
  Bell,
  FileText,
  Warehouse,
  Hospital,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";

const pageIcons = {
  "Live Map": Map,
  Vehicles: Truck,
  Deliveries: Package,
  Routes: Route,
  Incidents: AlertTriangle,
  Alerts: Bell,
  "Field Reports": FileText,
  Warehouses: Warehouse,
  Hospitals: Hospital,
  Analytics: BarChart3,
  Users: Users,
  Settings: Settings,
};

function ModulePage({ title, description }) {
  const Icon = pageIcons[title] || Settings;

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">

        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Icon
            size={24}
            className="text-emerald-400"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            {title}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {description}
          </p>
        </div>

      </div>

      {/* Temporary content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl min-h-[400px] flex items-center justify-center">

        <div className="text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center mb-5">
            <Icon
              size={30}
              className="text-slate-500"
            />
          </div>

          <h3 className="text-lg font-semibold text-white">
            {title} Module
          </h3>

          <p className="text-sm text-slate-500 mt-2 max-w-md">
            This module will be developed in the next phase of
            SmartRoute AI.
          </p>

        </div>

      </div>

    </div>
  );
}

export default ModulePage;
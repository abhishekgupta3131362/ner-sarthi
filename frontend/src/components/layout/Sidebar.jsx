import {
  LayoutDashboard,
  Map,
  Route,
  Truck,
  AlertTriangle,
  FileText,
  Bell,
  Hospital,
  Settings,
  LogOut,
  ShieldCheck,
  Activity,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";


const navigation = [
  {
    labelKey: "sidebar.overview",
    items: [
      {
        nameKey: "common.dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    labelKey: "sidebar.operations",
    items: [
      {
        nameKey: "common.gisMonitoring",
        path: "/gis",
        icon: Map,
      },
      {
        nameKey: "common.routes",
        path: "/routes",
        icon: Route,
      },
      {
        nameKey: "common.vehicles",
        path: "/vehicles",
        icon: Truck,
      },
      {
        nameKey: "common.deliveries",
        path: "/deliveries",
        icon: Activity,
      },
    ],
  },

  {
    labelKey: "sidebar.intelligence",
    items: [
      {
        nameKey: "common.incidents",
        path: "/incidents",
        icon: AlertTriangle,
      },
      {
        nameKey: "common.fieldReports",
        path: "/reports",
        icon: FileText,
      },
      {
        nameKey: "common.alerts",
        path: "/alerts",
        icon: Bell,
      },
    ],
  },

  {
    labelKey: "sidebar.emergency",
    items: [
      {
        nameKey: "common.hospitals",
        path: "/hospitals",
        icon: Hospital,
      },
    ],
  },
];


function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-slate-200 flex-col">

      {/* =====================================================
          BRAND
      ====================================================== */}

      <div className="h-16 px-5 border-b border-slate-200 flex items-center">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">

            <ShieldCheck
              size={19}
              className="text-white"
            />

          </div>

          <div>

            <h1 className="text-sm font-bold text-slate-900">
              NER Logistics
            </h1>

            <p className="text-[8px] uppercase tracking-[0.18em] text-slate-400 mt-0.5">
              {t("sidebar.platform")}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          SYSTEM STATUS
      ====================================================== */}

      <div className="px-4 pt-5">

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">

          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-emerald-500" />

            <span className="text-[9px] font-semibold text-emerald-700">
              {t("sidebar.systemOnline")}
            </span>

          </div>

          <p className="text-[8px] text-emerald-600/70 mt-1">
            {t("sidebar.servicesOperational")}
          </p>

        </div>

      </div>


      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav className="flex-1 px-3 py-5 overflow-y-auto">

        {navigation.map((section) => (

          <div
            key={section.labelKey}
            className="mb-6"
          >

            <p className="px-3 mb-2 text-[8px] uppercase tracking-[0.2em] font-semibold text-slate-400">
              {t(section.labelKey)}
            </p>

            <div className="space-y-1">

              {section.items.map((item) => (

                <NavItem
                  key={item.path}
                  item={item}
                />

              ))}

            </div>

          </div>

        ))}


        {/* ===================================================
            SETTINGS
        ==================================================== */}

        <div className="mt-4 pt-4 border-t border-slate-200">

                    <NavItem
            item={{
              nameKey: "common.settings",
              path: "/settings",
              icon: Settings,
            }}
          />

          <button
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              localStorage.removeItem("user");
              window.location.reload();
            }}
            className="flex items-center justify-between px-3 py-2 w-full text-left rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition group mt-2"
          >
            <div className="flex items-center gap-2">
              <LogOut size={16} className="text-red-500 group-hover:text-red-600" />
              <span className="text-[11px] font-medium">Logout</span>
            </div>
          </button>

        </div>

      </nav>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="p-4 border-t border-slate-200">

        <div className="flex items-center gap-3">

          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">

            <Activity
              size={14}
              className="text-slate-500"
            />

          </div>

          <div className="min-w-0">

            <p className="text-[9px] font-semibold text-slate-700">
              {t("sidebar.controlCentre")}
            </p>

            <p className="text-[8px] text-slate-400 truncate">
              {t("sidebar.northeastRegion")}
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}


/* =========================================================
   NAV ITEM
========================================================= */

function NavItem({ item }) {

  const { t } = useTranslation();

  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `group flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
          isActive
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">

            <Icon
              size={16}
              className={
                isActive
                  ? "text-emerald-600"
                  : "text-slate-400 group-hover:text-slate-600"
              }
            />

            <span className="text-[11px] font-medium">
              {t(item.nameKey)}
            </span>

          </div>

          {isActive && (
            <ChevronRight
              size={13}
              className="text-emerald-500"
            />
          )}

        </>
      )}
    </NavLink>
  );
}


export default Sidebar;

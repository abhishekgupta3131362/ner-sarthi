import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN APPLICATION */}
        <main className="flex-1 min-w-0 bg-slate-50">

          {/* TOP HEADER */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">

            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-emerald-600 font-semibold">
                Logistics Intelligence Platform
              </p>

              <h2 className="text-sm font-semibold text-slate-900 mt-0.5">
                Northeast Regional Operations
              </h2>
            </div>

            <div className="flex items-center gap-4">

              {/* SYSTEM STATUS */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100">

                <span className="w-2 h-2 rounded-full bg-emerald-500" />

                <span className="text-[10px] font-medium text-emerald-700">
                  Systems Operational
                </span>

              </div>

              {/* USER */}
              <div className="flex items-center gap-3">

                <div className="text-right hidden sm:block">

                  <p className="text-xs font-semibold text-slate-800">
                    Operations Manager
                  </p>

                  <p className="text-[9px] text-slate-400">
                    Control Centre
                  </p>

                </div>

                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center">

                  <span className="text-xs font-bold text-white">
                    OM
                  </span>

                </div>

              </div>

            </div>

          </header>


          {/* PAGE CONTENT */}

          <div className="min-h-[calc(100vh-64px)]">
            <Outlet />
          </div>

        </main>

      </div>

    </div>
  );
}

export default Layout;
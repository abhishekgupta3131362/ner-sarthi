import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

// Pages
import { ErrorBoundary } from "./components/ErrorBoundary";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LiveMap from "./pages/LiveMap";
import Vehicles from "./pages/Vehicles";
import Deliveries from "./pages/Deliveries";
import RoutesPage from "./pages/Routes";
import Incidents from "./pages/Incidents";
import Alerts from "./pages/Alerts";
import FieldReports from "./pages/FieldReports";
import Warehouses from "./pages/Warehouses";
import Hospitals from "./pages/Hospitals";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Settings from "./pages/Settings";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>

      <div className="min-h-screen bg-slate-50 text-slate-900 flex">

        {/* =====================================================
            SIDEBAR
        ====================================================== */}

        <Sidebar />


        {/* =====================================================
            MAIN APPLICATION
        ====================================================== */}

        <div className="flex-1 min-w-0 flex flex-col">

          {/* ===================================================
              TOPBAR
          ==================================================== */}

          <Topbar />


          {/* ===================================================
              PAGE CONTENT
          ==================================================== */}

          <main className="flex-1 min-w-0">

            <ErrorBoundary>
            <Routes>

              {/* =================================================
                  DEFAULT
              ================================================= */}

              <Route
                path="/"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />


              {/* =================================================
                  DASHBOARD
                  Overview / Command Center
              ================================================= */}

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />


              {/* =================================================
                  GIS MONITORING
                  Actual GIS / Leaflet Map
              ================================================= */}

              <Route
                path="/gis"
                element={<LiveMap />}
              />


              {/* =================================================
                  OLD GIS URL SUPPORT

                  If any old button still uses /live-map,
                  automatically redirect it to /gis.
              ================================================= */}

              <Route
                path="/live-map"
                element={
                  <Navigate
                    to="/gis"
                    replace
                  />
                }
              />


              {/* =================================================
                  ROUTES
              ================================================= */}

              <Route
                path="/routes"
                element={<RoutesPage />}
              />


              {/* =================================================
                  VEHICLES
              ================================================= */}

              <Route
                path="/vehicles"
                element={<Vehicles />}
              />


              {/* =================================================
                  DELIVERIES
              ================================================= */}

              <Route
                path="/deliveries"
                element={<Deliveries />}
              />


              {/* =================================================
                  INCIDENTS
              ================================================= */}

              <Route
                path="/incidents"
                element={<Incidents />}
              />


              {/* =================================================
                  FIELD REPORTS
              ================================================= */}

              <Route
                path="/reports"
                element={<FieldReports />}
              />


              {/* =================================================
                  OLD FIELD REPORTS URL SUPPORT
              ================================================= */}

              <Route
                path="/field-reports"
                element={
                  <Navigate
                    to="/reports"
                    replace
                  />
                }
              />


              {/* =================================================
                  ALERTS
              ================================================= */}

              <Route
                path="/alerts"
                element={<Alerts />}
              />


              {/* =================================================
                  HOSPITALS
              ================================================= */}

              <Route
                path="/hospitals"
                element={<Hospitals />}
              />


              {/* =================================================
                  WAREHOUSES
              ================================================= */}

              <Route
                path="/warehouses"
                element={<Warehouses />}
              />


              {/* =================================================
                  ANALYTICS
              ================================================= */}

              <Route
                path="/analytics"
                element={<Analytics />}
              />


              {/* =================================================
                  USERS
              ================================================= */}

              <Route
                path="/users"
                element={<Users />}
              />


              {/* =================================================
                  SETTINGS
              ================================================= */}

              <Route
                path="/settings"
                element={<Settings />}
              />


              {/* =================================================
                  UNKNOWN URL
              ================================================= */}

              <Route
                path="*"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />

            </Routes>
            </ErrorBoundary>

          </main>

        </div>

      </div>

    </BrowserRouter>
  );
}


export default App;


import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getFleetStats } from "../services/api";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  CloudRain,
  ExternalLink,
  Gauge,
  Hospital,
  Layers,
  Map,
  Navigation2,
  Radio,
  RefreshCw,
  Route,
  ShieldAlert,
  Truck,
  X,
} from "lucide-react";


/* =========================================================
   NER STATES
========================================================= */

const states = [
  {
    code: "AS",
    name: "Assam",
    accessibility: 87,
    risk: "LOW",
    roads: 94,
    emergency: 92,
    incidents: 3,
  },
  {
    code: "AR",
    name: "Arunachal Pradesh",
    accessibility: 61,
    risk: "HIGH",
    roads: 71,
    emergency: 64,
    incidents: 8,
  },
  {
    code: "ML",
    name: "Meghalaya",
    accessibility: 76,
    risk: "MEDIUM",
    roads: 82,
    emergency: 79,
    incidents: 5,
  },
  {
    code: "MN",
    name: "Manipur",
    accessibility: 59,
    risk: "HIGH",
    roads: 67,
    emergency: 61,
    incidents: 7,
  },
  {
    code: "MZ",
    name: "Mizoram",
    accessibility: 68,
    risk: "MEDIUM",
    roads: 77,
    emergency: 70,
    incidents: 4,
  },
  {
    code: "NL",
    name: "Nagaland",
    accessibility: 72,
    risk: "MEDIUM",
    roads: 80,
    emergency: 74,
    incidents: 4,
  },
  {
    code: "TR",
    name: "Tripura",
    accessibility: 91,
    risk: "LOW",
    roads: 95,
    emergency: 94,
    incidents: 2,
  },
  {
    code: "SK",
    name: "Sikkim",
    accessibility: 83,
    risk: "LOW",
    roads: 88,
    emergency: 85,
    incidents: 3,
  },
];


/* =========================================================
   HIGH RISK CORRIDORS
========================================================= */

const corridors = [
  {
    id: 1,
    route: "Guwahati → Tawang",
    state: "Arunachal Pradesh",
    risk: "HIGH",
    accessibility: 58,
    distance: "438 km",
    eta: "10h 40m",
    issue: "Landslide probability",
  },
  {
    id: 2,
    route: "Shillong → Imphal",
    state: "Meghalaya → Manipur",
    risk: "HIGH",
    accessibility: 62,
    distance: "490 km",
    eta: "12h 15m",
    issue: "Heavy rainfall",
  },
  {
    id: 3,
    route: "Aizawl → Silchar",
    state: "Mizoram → Assam",
    risk: "MEDIUM",
    accessibility: 71,
    distance: "185 km",
    eta: "5h 20m",
    issue: "Road condition",
  },
  {
    id: 4,
    route: "Guwahati → Kohima",
    state: "Assam → Nagaland",
    risk: "MEDIUM",
    accessibility: 74,
    distance: "340 km",
    eta: "8h 05m",
    issue: "Weather impact",
  },
];


/* =========================================================
   LIVE INCIDENTS
========================================================= */

const incidents = [
  {
    id: 1,
    type: "Landslide",
    location: "NH-13 · Near Tawang",
    severity: "CRITICAL",
    time: "12 min ago",
  },
  {
    id: 2,
    type: "Heavy Rainfall",
    location: "East Khasi Hills",
    severity: "HIGH",
    time: "24 min ago",
  },
  {
    id: 3,
    type: "Road Block",
    location: "NH-2 · Near Imphal",
    severity: "HIGH",
    time: "38 min ago",
  },
  {
    id: 4,
    type: "Flood Warning",
    location: "Barpeta · Assam",
    severity: "MEDIUM",
    time: "51 min ago",
  },
];


/* =========================================================
   MAIN DASHBOARD
========================================================= */

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedState, setSelectedState] = useState("ALL");
  const [liveSystem, setLiveSystem] = useState(true);
  const [weatherMonitoring, setWeatherMonitoring] = useState(true);

  const [selectedCorridor, setSelectedCorridor] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [showLayers, setShowLayers] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Just now");

  const [fleetStats, setFleetStats] = useState(null);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    getFleetStats()
      .then(stats => {
        if (mounted) setFleetStats(stats);
      })
      .catch(err => {
        console.error("Failed to load fleet stats on dashboard:", err);
      });
    return () => { mounted = false; };
  }, []);

  /* =======================================================
     TOAST
  ======================================================= */

  const notify = (message, type = "success") => {
    setToast({
      message,
      type,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 2600);
  };


  /* =======================================================
     REFRESH
  ======================================================= */

  const refreshSystem = () => {
    if (refreshing) return;

    setRefreshing(true);

    window.setTimeout(() => {
      setRefreshing(false);
      setLastUpdated("Just now");

      notify(
        "NER intelligence data refreshed successfully."
      );
    }, 900);
  };


  /* =======================================================
     SELECTED STATE
  ======================================================= */

  const selectedStateData =
    selectedState === "ALL"
      ? null
      : states.find(
          (state) =>
            state.code === selectedState
        );


  /* =======================================================
     ACCESSIBILITY
  ======================================================= */

  const overallAccessibility = useMemo(() => {
    if (selectedStateData) {
      return selectedStateData.accessibility;
    }

    const total = states.reduce(
      (sum, state) =>
        sum + state.accessibility,
      0
    );

    return Math.round(
      total / states.length
    );
  }, [selectedStateData]);


  /* =======================================================
     EMERGENCY ACCESS
  ======================================================= */

  const emergencyAccess = useMemo(() => {
    if (selectedStateData) {
      return selectedStateData.emergency;
    }

    const total = states.reduce(
      (sum, state) =>
        sum + state.emergency,
      0
    );

    return Math.round(
      total / states.length
    );
  }, [selectedStateData]);


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const openLiveMap = () => {
    navigate("/live-map");
  };


  const openIncidents = () => {
    navigate("/incidents");
  };


  const openReports = () => {
    navigate("/reports");
  };


  const openAnalytics = () => {
    navigate("/analytics");
  };


  const openVehicles = () => {
    navigate("/vehicles");
  };


  const openFacilities = (type) => {
    if (type === "hospital") {
      navigate("/hospitals");
    } else {
      navigate("/warehouses");
    }
  };


  const openCapability = (label) => {
    const routes = {
      "AI Risk Prediction": "/analytics",
      "Smart Routing": "/routes",
      "GIS Intelligence": "/live-map",
      "Real-Time Tracking": "/vehicles",
      "Weather Analysis": "/live-map",
      "Risk Monitoring": "/alerts",
    };

    if (routes[label]) {
      navigate(routes[label]);
    }
  };


  return (
    <div className="min-h-full bg-slate-50 text-slate-900 p-5 lg:p-6">

      {/* =====================================================
          TOAST
      ====================================================== */}

      {toast && (
        <div className="fixed right-5 bottom-5 z-[9999]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-emerald-200 shadow-2xl">

            <CheckCircle2
              size={16}
              className={
                toast.type === "error"
                  ? "text-red-500"
                  : "text-emerald-500"
              }
            />

            <span className="text-xs text-slate-700">
              {toast.message}
            </span>

          </div>
        </div>
      )}


      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-6">

        <div>

          <div className="flex items-center gap-2 mb-2">

            <span className="relative flex w-2 h-2">

              <span
                className={`absolute inset-0 rounded-full ${
                  liveSystem
                    ? "bg-emerald-500 animate-ping"
                    : "bg-slate-400"
                } opacity-40`}
              />

              <span
                className={`relative w-2 h-2 rounded-full ${
                  liveSystem
                    ? "bg-emerald-500"
                    : "bg-slate-400"
                }`}
              />

            </span>

            <span
              className={`text-[9px] uppercase tracking-[0.25em] ${
                liveSystem
                  ? "text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              NER Intelligence Network ·{" "}
              {liveSystem ? "Live" : "Paused"}
            </span>

          </div>


          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
  {t("dashboard.title")}
</h1>

<p className="text-sm text-slate-500 mt-2 max-w-2xl">
  {t("dashboard.subtitle")}
</p>

        </div>


        {/* HEADER CONTROLS */}

        <div className="flex flex-wrap items-center gap-2">

          <button
            onClick={() => {
              setLiveSystem(
                (previous) =>
                  !previous
              );

              notify(
                liveSystem
                  ? "Live monitoring paused."
                  : "Live monitoring resumed."
              );
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
              liveSystem
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-slate-200 text-slate-500"
            }`}
          >

            <Radio size={13} />

            <span className="text-[9px] font-semibold">
              {liveSystem
                ? "LIVE SYSTEM"
                : "SYSTEM PAUSED"}
            </span>

          </button>


          <button
            onClick={() => {
              setWeatherMonitoring(
                (previous) =>
                  !previous
              );

              notify(
                weatherMonitoring
                  ? "Weather monitoring disabled."
                  : "Weather monitoring enabled."
              );
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
              weatherMonitoring
                ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                : "bg-white border-slate-200 text-slate-500"
            }`}
          >

            <CloudRain size={13} />

            <span className="text-[9px] font-semibold">
              {weatherMonitoring
                ? "WEATHER LIVE"
                : "WEATHER PAUSED"}
            </span>

          </button>


          <button
            onClick={refreshSystem}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition"
          >

            <RefreshCw
              size={13}
              className={
                refreshing
                  ? "animate-spin text-cyan-600"
                  : "text-slate-500"
              }
            />

            <span className="text-[9px] text-slate-500">
              Updated {lastUpdated}
            </span>

          </button>


          <button
            onClick={() =>
              setShowLayers(
                (previous) =>
                  !previous
              )
            }
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
              showLayers
                ? "bg-purple-50 border-purple-200 text-purple-700"
                : "bg-white border-slate-200 text-slate-500"
            }`}
          >

            <Layers size={13} />

            <span className="text-[9px] font-semibold">
              Layers
            </span>

          </button>

        </div>

      </div>


      {/* =====================================================
          LAYER PANEL
      ====================================================== */}

      {showLayers && (
        <div className="mb-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

          <div className="flex items-center justify-between mb-4">

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Intelligence Layers
              </h3>

              <p className="text-[8px] text-slate-400 mt-1">
                Configure operational information visible across the command center.
              </p>
            </div>

            <button
              onClick={() =>
                setShowLayers(false)
              }
              className="text-slate-400 hover:text-slate-800"
            >
              <X size={15} />
            </button>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">

            {[
              "Accessibility",
              "Vehicles",
              "Incidents",
              "Flood Risk",
              "Landslide Risk",
              "Weather",
            ].map((layer) => (

              <button
                key={layer}
                onClick={() =>
                  notify(
                    `${layer} layer selected.`
                  )
                }
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 text-left transition"
              >

                <Layers
                  size={13}
                  className="text-slate-500"
                />

                <p className="text-[8px] mt-2 text-slate-700">
                  {layer}
                </p>

              </button>

            ))}

          </div>

        </div>
      )}


      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 mb-5">

        <IntelligenceCard
          icon={Gauge}
          label={t("dashboard.nerAccessibility")}
          value={`${overallAccessibility}%`}
          detail={
            selectedStateData
              ? selectedStateData.name
              : "Overall region"
          }
          trend="+4.8%"
          trendUp
          accent="emerald"
          onClick={openAnalytics}
        />


        <IntelligenceCard
          icon={Truck}
          label={t("dashboard.activeVehicles")}
          value={fleetStats ? fleetStats.active.toString() : "..."}
          detail={`Out of ${fleetStats ? fleetStats.total : "..."} total`}
          trend="+8.2%"
          trendUp
          accent="cyan"
          onClick={openVehicles}
        />


        <IntelligenceCard
          icon={ShieldAlert}
          label={t("dashboard.riskCorridors")}
          value="07"
          detail="Require attention"
          trend="-4.5%"
          trendUp
          accent="red"
          onClick={() =>
            navigate("/routes")
          }
        />


        <IntelligenceCard
          icon={AlertTriangle}
          label={t("dashboard.blockedRoads")}
          value="04"
          detail="Currently affected"
          trend="+2"
          trendUp={false}
          accent="orange"
          onClick={openIncidents}
        />


        <IntelligenceCard
          icon={Hospital}
          label={t("dashboard.emergencyAccess")}
          value={`${emergencyAccess}%`}
          detail="Critical facilities"
          trend="+6.1%"
          trendUp
          accent="purple"
          onClick={() =>
            openFacilities("hospital")
          }
        />

      </div>


      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.75fr)] gap-5 mb-5">


        {/* ===================================================
            MAP
        ==================================================== */}

        <div className="relative min-h-[540px] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">

          {/* Grid */}

          <div
            className="absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.12) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />


          {/* Fake regional map */}

          <div className="absolute inset-0 flex items-center justify-center">

            <div className="relative w-[75%] h-[65%]">

              <div className="absolute inset-[10%] rounded-[46%_54%_55%_45%] rotate-[12deg] border border-cyan-400/30 bg-cyan-400/[0.04]" />


              <div className="absolute left-[8%] top-[50%] w-[84%] h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent rotate-[12deg]" />

              <div className="absolute left-[23%] top-[29%] w-[57%] h-[2px] bg-gradient-to-r from-emerald-400/60 to-transparent rotate-[48deg]" />

              <div className="absolute left-[37%] top-[30%] w-[44%] h-[2px] bg-orange-400/50 rotate-[105deg]" />

              <div className="absolute left-[35%] top-[65%] w-[50%] h-[2px] bg-red-400/40 rotate-[-25deg]" />


              <MapPoint
                left="18%"
                top="50%"
                label="Guwahati"
                type="safe"
              />

              <MapPoint
                left="39%"
                top="28%"
                label="Shillong"
                type="medium"
              />

              <MapPoint
                left="62%"
                top="20%"
                label="Tawang"
                type="high"
              />

              <MapPoint
                left="70%"
                top="46%"
                label="Kohima"
                type="medium"
              />

              <MapPoint
                left="58%"
                top="68%"
                label="Imphal"
                type="high"
              />

              <MapPoint
                left="37%"
                top="76%"
                label="Aizawl"
                type="medium"
              />


              {/* VEHICLE */}

              <div className="absolute left-[31%] top-[45%]">

                <div className="relative">

                  <div className="absolute -inset-3 rounded-full bg-cyan-400/10 animate-pulse" />

                  <button
                    onClick={openVehicles}
                    className="relative w-9 h-9 rounded-full bg-white border border-cyan-400/50 flex items-center justify-center shadow-sm hover:scale-110 transition"
                  >

                    <Truck
                      size={15}
                      className="text-cyan-600"
                    />

                  </button>

                </div>

              </div>


              {/* INCIDENT */}

              <button
                onClick={openIncidents}
                className="absolute right-[20%] top-[30%]"
              >

                <div className="relative">

                  <div className="absolute -inset-3 rounded-full bg-red-500/10 animate-ping" />

                  <div className="w-8 h-8 rounded-full bg-red-50 border border-red-300 flex items-center justify-center hover:bg-red-100 transition">

                    <AlertTriangle
                      size={14}
                      className="text-red-500"
                    />

                  </div>

                </div>

              </button>

            </div>

          </div>


          {/* MAP HEADER */}

          <div className="absolute top-5 left-5 z-20">

            <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-4 py-3 shadow-sm">

              <div className="flex items-center gap-2">

                <Map
                  size={15}
                  className="text-cyan-600"
                />

                <div>

                  <p className="text-xs font-semibold text-slate-900">{t("gis.title")}</p>

                  <p className="text-[8px] text-slate-400 mt-1">
                    Accessibility · Risk · Logistics
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* MAP ACTIONS */}

          <div className="absolute top-5 right-5 z-20 flex gap-2">

            <button
              onClick={() =>
                setShowLayers(true)
              }
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:border-cyan-300 hover:text-cyan-600 transition shadow-sm"
            >
              <Layers size={14} />
            </button>


            <button
              onClick={openLiveMap}
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:border-cyan-300 hover:text-cyan-600 transition shadow-sm"
            >
              <Navigation2 size={14} />
            </button>

          </div>


          {/* LEGEND */}

          <div className="absolute left-5 bottom-5 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-sm">

            <p className="text-[8px] uppercase tracking-widest text-slate-400 mb-3">
              Accessibility
            </p>

            <div className="grid grid-cols-2 gap-x-5 gap-y-2">

              <LegendItem
                color="bg-emerald-400"
                label="Accessible"
              />

              <LegendItem
                color="bg-yellow-400"
                label="Moderate"
              />

              <LegendItem
                color="bg-orange-400"
                label="Restricted"
              />

              <LegendItem
                color="bg-red-500"
                label="Critical"
              />

            </div>

          </div>


          {/* COVERAGE */}

          <button
            onClick={openLiveMap}
            className="absolute right-5 bottom-5 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-4 py-3 hover:border-cyan-300 transition text-left shadow-sm"
          >

            <p className="text-[8px] text-slate-400">
              MAP COVERAGE
            </p>

            <p className="text-lg font-bold mt-1 text-slate-900">
              8 States
            </p>

            <p className="text-[7px] text-emerald-600 mt-1">
              Open full intelligence map →
            </p>

          </button>

        </div>


        {/* ===================================================
            RIGHT PANEL
        ==================================================== */}

        <div className="space-y-4">


          {/* AI ROUTE */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">

                  <BrainCircuit
                    size={18}
                    className="text-emerald-600"
                  />

                </div>

                <div>

                  <h2 className="font-semibold text-slate-900">{t("dashboard.aiRouteIntelligence")}</h2>

                  <p className="text-[8px] text-slate-400 mt-1">
                    Accessibility-aware recommendation
                  </p>

                </div>

              </div>


              <span className="px-2 py-1 rounded-md bg-emerald-50 text-[7px] text-emerald-700 border border-emerald-100">
                AI ACTIVE
              </span>

            </div>


            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[7px] uppercase text-emerald-600 tracking-widest">
                    Recommended
                  </p>

                  <p className="text-xl font-bold mt-2 text-slate-900">
                    Route B
                  </p>

                </div>


                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">

                  <Navigation2
                    size={19}
                    className="text-emerald-600"
                  />

                </div>

              </div>


              <div className="grid grid-cols-2 gap-3 mt-5">

                <MiniMetric
                  label="Distance"
                  value="452 km"
                />

                <MiniMetric
                  label="ETA"
                  value="10h 55m"
                />

                <MiniMetric
                  label="Risk"
                  value="LOW"
                  valueClass="text-emerald-600"
                />

                <MiniMetric
                  label="Accessibility"
                  value="91/100"
                  valueClass="text-emerald-600"
                />

              </div>


              <div className="mt-4 p-3 rounded-lg bg-white border border-emerald-100">

                <div className="flex items-start gap-2">

                  <BrainCircuit
                    size={13}
                    className="text-emerald-600 mt-0.5 shrink-0"
                  />

                  <p className="text-[8px] leading-4 text-slate-500">
                    Avoids two high-risk corridors and active landslide zones.
                  </p>

                </div>

              </div>


              <button
                onClick={() =>
                  navigate("/routes")
                }
                className="w-full mt-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold transition flex items-center justify-center gap-2"
              >

                <Route size={13} />

                View Recommended Route

                <ExternalLink size={11} />

              </button>

            </div>

          </div>


          {/* EMERGENCY */}

          <button
            onClick={() =>
              openFacilities("hospital")
            }
            className="w-full text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-purple-300 transition shadow-sm"
          >

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">

                <Hospital
                  size={15}
                  className="text-purple-600"
                />

              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-sm text-slate-900">
                  Emergency Accessibility
                </h3>

                <p className="text-[8px] text-slate-400 mt-1">
                  Critical facility connectivity
                </p>

              </div>

              <ExternalLink
                size={12}
                className="text-slate-400"
              />

            </div>


            <div className="flex items-end justify-between mt-4">

              <div>

                <p className="text-3xl font-bold text-slate-900">
                  {emergencyAccess}%
                </p>

                <p className="text-[8px] text-emerald-600 mt-1">
                  +6.1% this week
                </p>

              </div>


              <div className="w-28 h-2 rounded-full bg-slate-100 overflow-hidden">

                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${emergencyAccess}%`,
                  }}
                />

              </div>

            </div>

          </button>

        </div>

      </div>


      {/* =====================================================
          LOWER SECTION
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_0.8fr] gap-5 mt-5">


        {/* STATE ACCESSIBILITY */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="font-semibold text-slate-900">{t("dashboard.accessibilityIndex")}</h2>

              <p className="text-[8px] text-slate-400 mt-1">
                Click a state to inspect its intelligence
              </p>

            </div>

            <button
              onClick={openAnalytics}
              className="text-[8px] text-cyan-600 hover:text-cyan-700"
            >
              Analytics →
            </button>

          </div>


          <div className="space-y-3">

            <button
              onClick={() => {
                setSelectedState("ALL");

                notify(
                  "Overall NER region selected."
                );
              }}
              className={`w-full text-left rounded-xl p-2 transition ${
                selectedState === "ALL"
                  ? "bg-cyan-50 border border-cyan-100"
                  : "hover:bg-slate-50"
              }`}
            >

              <div className="flex items-center justify-between">

                <span className="text-[9px] font-medium text-slate-700">
                  Overall NER
                </span>

                <span className="text-[9px] font-semibold text-cyan-600">
                  {Math.round(
                    states.reduce(
                      (sum, state) =>
                        sum + state.accessibility,
                      0
                    ) / states.length
                  )}
                </span>

              </div>

            </button>


            {states.map((state) => (

              <StateRow
                key={state.code}
                state={state}
                selected={
                  selectedState ===
                  state.code
                }
                onClick={() => {

                  setSelectedState(
                    state.code
                  );

                  notify(
                    `${state.name} selected.`
                  );

                }}
              />

            ))}

          </div>

        </div>


        {/* CORRIDORS */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="font-semibold text-slate-900">
                High-Risk Corridors
              </h2>

              <p className="text-[8px] text-slate-400 mt-1">
                Click for route intelligence
              </p>

            </div>

            <ShieldAlert
              size={16}
              className="text-red-500"
            />

          </div>


          <div className="space-y-3">

            {corridors.map(
              (corridor) => (

                <button
                  key={corridor.id}
                  onClick={() =>
                    setSelectedCorridor(
                      corridor
                    )
                  }
                  className="w-full text-left"
                >

                  <CorridorRow
                    corridor={
                      corridor
                    }
                  />

                </button>

              )
            )}

          </div>

        </div>


        {/* INCIDENTS */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="font-semibold text-slate-900">{t("dashboard.liveIncidents")}</h2>

              <p className="text-[8px] text-slate-400 mt-1">
                Click for details
              </p>

            </div>

            <button
              onClick={openIncidents}
              className="text-[7px] text-emerald-600 font-semibold"
            >
              VIEW ALL
            </button>

          </div>


          <div className="space-y-3">

            {incidents.map(
              (incident) => (

                <button
                  key={incident.id}
                  onClick={() =>
                    setSelectedIncident(
                      incident
                    )
                  }
                  className="w-full text-left"
                >

                  <IncidentRow
                    incident={
                      incident
                    }
                  />

                </button>

              )
            )}

          </div>


          <button
            onClick={openIncidents}
            className="w-full mt-4 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[8px] text-slate-500 hover:text-slate-800 transition"
          >
            View All Incidents
          </button>


          <button
            onClick={openReports}
            className="w-full mt-2 py-2.5 rounded-lg border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-[8px] text-emerald-700 transition"
          >
            Submit Field Report
          </button>

        </div>

      </div>


      {/* =====================================================
          CAPABILITIES
      ====================================================== */}

      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">

        {[
          {
            icon: BrainCircuit,
            label: "AI Risk Prediction",
          },
          {
            icon: Route,
            label: "Smart Routing",
          },
          {
            icon: Map,
            label: "GIS Intelligence",
          },
          {
            icon: Activity,
            label: "Real-Time Tracking",
          },
          {
            icon: CloudRain,
            label: "Weather Analysis",
          },
          {
            icon: ShieldAlert,
            label: "Risk Monitoring",
          },
        ].map((item) => (

          <Capability
            key={item.label}
            icon={item.icon}
            label={item.label}
            onClick={() =>
              openCapability(
                item.label
              )
            }
          />

        ))}

      </div>


      {/* =====================================================
          CORRIDOR MODAL
      ====================================================== */}

      {selectedCorridor && (

        <Modal
          title="Corridor Intelligence"
          onClose={() =>
            setSelectedCorridor(
              null
            )
          }
        >

          <div className="space-y-4">

            <div>

              <p className="text-lg font-semibold text-slate-900">
                {selectedCorridor.route}
              </p>

              <p className="text-[9px] text-slate-400 mt-1">
                {selectedCorridor.state}
              </p>

            </div>


            <div className="grid grid-cols-2 gap-3">

              <MiniMetric
                label="Risk"
                value={
                  selectedCorridor.risk
                }
                valueClass="text-red-600"
              />

              <MiniMetric
                label="Accessibility"
                value={`${selectedCorridor.accessibility}/100`}
              />

              <MiniMetric
                label="Distance"
                value={
                  selectedCorridor.distance
                }
              />

              <MiniMetric
                label="ETA"
                value={
                  selectedCorridor.eta
                }
              />

            </div>


            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">

              <p className="text-[8px] text-orange-600">
                PRIMARY RISK
              </p>

              <p className="text-xs text-slate-600 mt-1">
                {selectedCorridor.issue}
              </p>

            </div>


            <button
              onClick={() => {
                setSelectedCorridor(
                  null
                );

                navigate("/routes");
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              Open Route Intelligence
            </button>

          </div>

        </Modal>

      )}


      {/* =====================================================
          INCIDENT MODAL
      ====================================================== */}

      {selectedIncident && (

        <Modal
          title="Incident Intelligence"
          onClose={() =>
            setSelectedIncident(
              null
            )
          }
        >

          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">

                <AlertTriangle
                  size={18}
                  className="text-red-500"
                />

              </div>

              <div>

                <p className="font-semibold text-slate-900">
                  {selectedIncident.type}
                </p>

                <p className="text-[8px] text-slate-400 mt-1">
                  {selectedIncident.time}
                </p>

              </div>

            </div>


            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

              <p className="text-[8px] uppercase text-slate-400">
                Location
              </p>

              <p className="text-sm mt-1 text-slate-800">
                {selectedIncident.location}
              </p>

            </div>


            <div className="flex items-center justify-between">

              <span className="text-[8px] text-slate-400">
                Severity
              </span>

              <span className="text-[8px] text-red-600 font-semibold">
                {selectedIncident.severity}
              </span>

            </div>


            <button
              onClick={() => {
                setSelectedIncident(
                  null
                );

                openIncidents();
              }}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
            >
              Open Incident Center
            </button>

          </div>

        </Modal>

      )}


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-5 px-1">

        <div className="flex items-center gap-2">

          <span
            className={`w-2 h-2 rounded-full ${
              liveSystem
                ? "bg-emerald-500 animate-pulse"
                : "bg-slate-300"
            }`}
          />

          <span className="text-[8px] text-slate-400">
            NER Intelligence Network{" "}
            {liveSystem
              ? "operational"
              : "paused"}
          </span>

        </div>


        <div className="flex items-center gap-4">

          <span className="text-[8px] text-slate-400">
            8 States monitored
          </span>

          <span className="text-[8px] text-slate-400">
            24 Active vehicles
          </span>

          <span className="text-[8px] text-slate-400">
            32 Live signals
          </span>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   INTELLIGENCE CARD
========================================================= */

function IntelligenceCard({
  icon: Icon,
  label,
  value,
  detail,
  trend,
  trendUp,
  accent,
  onClick,
}) {
  const accentClasses = {
    emerald:
      "text-emerald-600 bg-emerald-50 border-emerald-100",

    cyan:
      "text-cyan-600 bg-cyan-50 border-cyan-100",

    red:
      "text-red-600 bg-red-50 border-red-100",

    orange:
      "text-orange-600 bg-orange-50 border-orange-100",

    purple:
      "text-purple-600 bg-purple-50 border-purple-100",
  };


  return (
    <button
      onClick={onClick}
      className="text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:-translate-y-0.5 transition w-full shadow-sm"
    >

      <div className="flex items-start justify-between">

        <div
          className={`w-9 h-9 rounded-lg border flex items-center justify-center ${accentClasses[accent]}`}
        >
          <Icon size={15} />
        </div>


        <div
          className={`flex items-center gap-1 text-[7px] ${
            trendUp
              ? "text-emerald-600"
              : "text-red-600"
          }`}
        >

          {trendUp ? (
            <ArrowUpRight size={10} />
          ) : (
            <ArrowDownRight size={10} />
          )}

          {trend}

        </div>

      </div>


      <p className="text-[8px] uppercase text-slate-400 mt-4">
        {label}
      </p>


      <p className="text-2xl font-bold mt-1 text-slate-900">
        {value}
      </p>


      <p className="text-[7px] text-slate-400 mt-1">
        {detail}
      </p>

    </button>
  );
}


/* =========================================================
   MAP POINT
========================================================= */

function MapPoint({
  left,
  top,
  label,
  type,
}) {
  const styles = {
    safe: {
      dot: "bg-emerald-500",
      ring: "border-emerald-400/40",
    },

    medium: {
      dot: "bg-yellow-500",
      ring: "border-yellow-400/40",
    },

    high: {
      dot: "bg-red-500",
      ring: "border-red-400/40",
    },
  };


  return (
    <div
      className="absolute"
      style={{
        left,
        top,
      }}
    >

      <div className="relative">

        <div
          className={`absolute -inset-2 rounded-full border ${styles[type].ring}`}
        />

        <div
          className={`w-3 h-3 rounded-full ${styles[type].dot}`}
        />

        <span className="absolute left-5 top-[-4px] whitespace-nowrap text-[7px] text-slate-500">
          {label}
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   LEGEND
========================================================= */

function LegendItem({
  color,
  label,
}) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`w-2 h-2 rounded-full ${color}`}
      />

      <span className="text-[7px] text-slate-500">
        {label}
      </span>

    </div>
  );
}


/* =========================================================
   MINI METRIC
========================================================= */

function MiniMetric({
  label,
  value,
  valueClass = "text-slate-900",
}) {
  return (
    <div>

      <p className="text-[7px] uppercase text-slate-400">
        {label}
      </p>

      <p
        className={`text-sm font-semibold mt-1 ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   STATE ROW
========================================================= */

function StateRow({
  state,
  selected,
  onClick,
}) {
  const statusClass = {
    LOW: "text-emerald-600",
    MEDIUM: "text-yellow-600",
    HIGH: "text-red-600",
  };


  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl p-2 transition ${
        selected
          ? "bg-cyan-50 border border-cyan-100"
          : "hover:bg-slate-50"
      }`}
    >

      <div className="flex items-center gap-3">

        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">

          <span className="text-[7px] font-bold text-slate-500">
            {state.code}
          </span>

        </div>


        <div className="min-w-0 flex-1">

          <div className="flex items-center justify-between">

            <span className="text-[9px] text-slate-700 truncate">
              {state.name}
            </span>

            <span
              className={`text-[8px] font-semibold ${statusClass[state.risk]}`}
            >
              {state.accessibility}
            </span>

          </div>


          <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">

            <div
              className={`h-full rounded-full ${
                state.accessibility >= 80
                  ? "bg-emerald-500"
                  : state.accessibility >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${state.accessibility}%`,
              }}
            />

          </div>

        </div>


        <span
          className={`text-[6px] w-12 text-right ${statusClass[state.risk]}`}
        >
          {state.risk}
        </span>

      </div>

    </button>
  );
}


/* =========================================================
   CORRIDOR
========================================================= */

function CorridorRow({
  corridor,
}) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition">

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <p className="text-[9px] font-medium truncate text-slate-800">
            {corridor.route}
          </p>

          <p className="text-[7px] text-slate-400 mt-1">
            {corridor.issue}
          </p>

        </div>


        <span
          className={`text-[6px] px-2 py-1 rounded-md ${
            corridor.risk === "HIGH"
              ? "text-red-600 bg-red-50"
              : "text-yellow-600 bg-yellow-50"
          }`}
        >
          {corridor.risk}
        </span>

      </div>


      <div className="flex items-center justify-between mt-3">

        <span className="text-[7px] text-slate-400">
          {corridor.distance} ·{" "}
          {corridor.eta}
        </span>

        <span className="text-[7px] text-slate-500">
          Access{" "}
          <span className="text-slate-900 font-semibold">
            {corridor.accessibility}/100
          </span>
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   INCIDENT
========================================================= */

function IncidentRow({
  incident,
}) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition">

      <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">

        <AlertTriangle
          size={12}
          className={
            incident.severity ===
            "CRITICAL"
              ? "text-red-500"
              : "text-orange-500"
          }
        />

      </div>


      <div className="min-w-0 flex-1">

        <div className="flex items-center justify-between gap-2">

          <p className="text-[8px] font-medium truncate text-slate-800">
            {incident.type}
          </p>

          <span className="text-[6px] text-slate-400 whitespace-nowrap">
            {incident.time}
          </span>

        </div>


        <p className="text-[7px] text-slate-400 mt-1 truncate">
          {incident.location}
        </p>


        <span
          className={`inline-block text-[5px] px-1.5 py-0.5 rounded mt-1 ${
            incident.severity ===
            "CRITICAL"
              ? "text-red-600 bg-red-50"
              : incident.severity ===
                "HIGH"
              ? "text-orange-600 bg-orange-50"
              : "text-yellow-600 bg-yellow-50"
          }`}
        >
          {incident.severity}
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   CAPABILITY
========================================================= */

function Capability({
  icon: Icon,
  label,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 transition text-left shadow-sm"
    >

      <Icon
        size={13}
        className="text-slate-500"
      />

      <span className="text-[7px] text-slate-600">
        {label}
      </span>

    </button>
  );
}


/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  children,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[5000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-5">

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl">

        <div className="flex items-center justify-between p-5 border-b border-slate-200">

          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800"
          >
            <X size={14} />
          </button>

        </div>


        <div className="p-5">
          {children}
        </div>

      </div>

    </div>
  );
}


export default Dashboard;

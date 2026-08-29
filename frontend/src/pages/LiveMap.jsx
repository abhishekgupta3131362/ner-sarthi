import RouteRiskCard from "../components/routes/RouteRiskCard";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  CloudRain,
  Crosshair,
  Gauge,
  Hospital,
  Layers,
  Map,
  MapPin,
  Mountain,
  RefreshCw,
  Radio,
  Route,
  ShieldAlert,
  Truck,
  Warehouse,
  Waves,
  X,
} from "lucide-react";

import GISMap from "../components/map/GISMap";
import RoutePlanner from "../components/routes/RoutePlanner";

import { riskZones } from "../utils/constants";


/* =========================================================
   NER STATES
========================================================= */

const states = [
  {
    code: "ALL",
    name: "All NER",
    accessibility: 78,
    risk: 42,
    emergency: 86,
  },
  {
    code: "AS",
    name: "Assam",
    accessibility: 87,
    risk: 28,
    emergency: 92,
  },
  {
    code: "AR",
    name: "Arunachal Pradesh",
    accessibility: 61,
    risk: 67,
    emergency: 64,
  },
  {
    code: "ML",
    name: "Meghalaya",
    accessibility: 76,
    risk: 43,
    emergency: 79,
  },
  {
    code: "MN",
    name: "Manipur",
    accessibility: 59,
    risk: 69,
    emergency: 61,
  },
  {
    code: "MZ",
    name: "Mizoram",
    accessibility: 68,
    risk: 55,
    emergency: 70,
  },
  {
    code: "NL",
    name: "Nagaland",
    accessibility: 72,
    risk: 49,
    emergency: 74,
  },
  {
    code: "TR",
    name: "Tripura",
    accessibility: 91,
    risk: 22,
    emergency: 94,
  },
  {
    code: "SK",
    name: "Sikkim",
    accessibility: 83,
    risk: 34,
    emergency: 85,
  },
];


/* =========================================================
   LAYERS
========================================================= */

const layers = [
  {
    id: "ACCESSIBILITY",
    label: "Accessibility",
    icon: Activity,
  },
  {
    id: "VEHICLES",
    label: "Vehicles",
    icon: Truck,
  },
  {
    id: "INCIDENTS",
    label: "Incidents",
    icon: AlertTriangle,
  },
  {
    id: "FLOOD",
    label: "Flood Risk",
    icon: Waves,
  },
  {
    id: "LANDSLIDE",
    label: "Landslide",
    icon: Mountain,
  },
  {
    id: "WEATHER",
    label: "Weather",
    icon: CloudRain,
  },
];


/* =========================================================
   MAIN COMPONENT
========================================================= */

function LiveMap() {

  const navigate = useNavigate();

  const [selectedState, setSelectedState] =
    useState("ALL");

  const [activeLayers, setActiveLayers] =
    useState([
      "ACCESSIBILITY",
      "VEHICLES",
      "INCIDENTS",
    ]);

  const [liveMode, setLiveMode] =
    useState(true);

  const [weatherMode, setWeatherMode] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [lastUpdated, setLastUpdated] =
    useState("Just now");

  const [calculatedRoute, setCalculatedRoute] =
    useState(null);

  const [selectedVehicle, setSelectedVehicle] =
    useState(null);

  const [selectedIncident, setSelectedIncident] =
    useState(null);

  const [selectedRiskZone, setSelectedRiskZone] =
    useState(null);

  const [showLayers, setShowLayers] =
    useState(false);

  const [toast, setToast] =
    useState(null);


  /* =======================================================
     NOTIFICATION
  ======================================================= */

  const notify = (
    message,
    type = "success"
  ) => {

    setToast({
      message,
      type,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 2500);
  };


  /* =======================================================
     LAYER TOGGLE
  ======================================================= */

  const toggleLayer = (layerId) => {

    setActiveLayers((previous) => {

      if (
        previous.includes(layerId)
      ) {

        const next =
          previous.filter(
            (layer) =>
              layer !== layerId
          );

        notify(
          `${layerId} layer disabled.`
        );

        return next;
      }

      notify(
        `${layerId} layer enabled.`
      );

      return [
        ...previous,
        layerId,
      ];
    });
  };


  /* =======================================================
     REFRESH
  ======================================================= */

  const refreshMap = () => {

    setRefreshing(true);

    window.setTimeout(() => {

      setRefreshing(false);

      setLastUpdated(
        "Just now"
      );

      notify(
        "NER map intelligence refreshed."
      );

    }, 900);
  };


  /* =======================================================
     RESET
  ======================================================= */

  const resetMap = () => {

    setSelectedState("ALL");

    setActiveLayers([
      "ACCESSIBILITY",
      "VEHICLES",
      "INCIDENTS",
    ]);

    setSelectedVehicle(null);

    setSelectedIncident(null);

    setSelectedRiskZone(null);

    setCalculatedRoute(null);

    notify(
      "Map filters have been reset."
    );
  };


  /* =======================================================
     CURRENT STATE
  ======================================================= */

  const currentState =
    useMemo(() => {

      return (
        states.find(
          (state) =>
            state.code ===
            selectedState
        ) ||
        states[0]
      );

    }, [selectedState]);


  /* =======================================================
     API DATA LOAD
  ======================================================= */
  const [dbVehicles, setDbVehicles] = useState([]);
  const [dbIncidents, setDbIncidents] = useState([]);
  const [dbRoutes, setDbRoutes] = useState([]);

  useEffect(() => {
    import("../services/api").then((api) => {
      Promise.all([
        api.getVehicles(),
        api.getIncidents(),
        api.getRoutes()
      ]).then(([vData, iData, rData]) => {
        setDbVehicles(vData.map(v => ({
          ...v,
          id: String(v.id),
          name: v.license_plate,
          status: v.status === "ACTIVE" ? "LIVE" : "IDLE",
          risk: v.risk_level,
          position: [v.current_lat, v.current_lon]
        })));
        
        setDbIncidents(iData.map(i => ({
          ...i,
          id: String(i.id),
          type: i.type,
          severity: i.severity,
          location: i.location_name,
          position: [i.latitude, i.longitude]
        })));

        setDbRoutes(rData);
      }).catch(console.error);
    });
  }, []);

  /* =======================================================
     VEHICLES
  ======================================================= */

  const liveVehicles =
    dbVehicles.filter(
      (vehicle) =>
        vehicle.status === "LIVE"
    );


  const highRiskVehicles =
    dbVehicles.filter(
      (vehicle) =>
        vehicle.risk === "HIGH"
    );


  /* =======================================================
     INCIDENTS
  ======================================================= */

  const criticalIncidents =
    dbIncidents.filter(
      (incident) =>
        incident.severity ===
        "CRITICAL"
    );


  /* =======================================================
     ROUTE CALLBACK
  ======================================================= */

  const handleRouteFound = (
    route
  ) => {

    setCalculatedRoute(route);

    notify(
      "Recommended route calculated successfully."
    );
  };


  /* =======================================================
     SAFE ROUTE RISK DISPLAY
  ======================================================= */

  const routeRisk =
    calculatedRoute?.risk;


  const routeRiskLevel =
    typeof routeRisk ===
      "object"
      ? (
          routeRisk.riskLevel ??
          routeRisk.level ??
          "Evaluated"
        )
      : (
          routeRisk ??
          "Evaluated"
        );


  const routeRiskScore =
    typeof routeRisk ===
      "object"
      ? routeRisk.riskScore
      : null;


  const routeSafetyScore =
    typeof routeRisk ===
      "object"
      ? routeRisk.safetyScore
      : null;


  return (

    <div className="min-h-full bg-slate-50 text-slate-900 p-5 lg:p-6">


      {/* ===================================================
          TOAST
      ==================================================== */}

      {toast && (

        <div className="fixed right-5 bottom-5 z-[5000]">

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-emerald-200 shadow-2xl">

            <CheckCircle2
              size={16}
              className="text-emerald-600"
            />

            <span className="text-xs text-slate-600">
              {toast.message}
            </span>

          </div>

        </div>

      )}


      {/* ===================================================
          HEADER
      ==================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">

        <div>

          <div className="flex items-center gap-2">

            <span
              className={`w-2 h-2 rounded-full ${
                liveMode
                  ? "bg-emerald-400 animate-pulse"
                  : "bg-slate-600"
              }`}
            />

            <span
              className={`text-[9px] uppercase tracking-[0.25em] ${
                liveMode
                  ? "text-emerald-600"
                  : "text-slate-600"
              }`}
            >
              NER GIS Intelligence ·{" "}
              {liveMode
                ? "Live"
                : "Paused"}
            </span>

          </div>

          <h1 className="text-2xl lg:text-3xl font-bold mt-2">
            NER Accessibility Map
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Real-time logistics, accessibility and regional risk intelligence
          </p>

        </div>


        <div className="flex flex-wrap items-center gap-2">

          {/* LIVE */}

          <button
            onClick={() => {

              setLiveMode(
                (previous) =>
                  !previous
              );

              notify(
                liveMode
                  ? "Live map monitoring paused."
                  : "Live map monitoring resumed."
              );

            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
              liveMode
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-white border-slate-200 text-slate-400"
            }`}
          >

            <Radio size={13} />

            <span className="text-[9px]">
              {liveMode
                ? "LIVE SYSTEM"
                : "SYSTEM PAUSED"}
            </span>

          </button>


          {/* WEATHER */}

          <button
            onClick={() => {

              setWeatherMode(
                (previous) =>
                  !previous
              );

              notify(
                weatherMode
                  ? "Weather monitoring paused."
                  : "Weather monitoring enabled."
              );

            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
              weatherMode
                ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-600"
                : "bg-white border-slate-200 text-slate-400"
            }`}
          >

            <CloudRain size={13} />

            <span className="text-[9px]">
              {weatherMode
                ? "Weather monitored"
                : "Weather paused"}
            </span>

          </button>


          {/* REFRESH */}

          <button
            onClick={refreshMap}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition"
          >

            <RefreshCw
              size={13}
              className={
                refreshing
                  ? "animate-spin text-cyan-600"
                  : "text-slate-400"
              }
            />

            <span className="text-[9px] text-slate-400">
              {lastUpdated}
            </span>

          </button>

        </div>

      </div>


      {/* ===================================================
          FILTER BAR
      ==================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-3 mb-5">

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3">

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">

            <div className="flex items-center gap-2">

              <MapPin
                size={14}
                className="text-cyan-600"
              />

              <span className="text-[8px] uppercase tracking-widest text-slate-600">
                Operational Region
              </span>

            </div>


            <select
              value={selectedState}
              onChange={(event) => {

                setSelectedState(
                  event.target.value
                );

                const selected =
                  states.find(
                    (state) =>
                      state.code ===
                      event.target.value
                  );

                notify(
                  `${selected?.name || "All NER"} selected.`
                );

              }}
              className="flex-1 sm:max-w-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-cyan-400/40"
            >

              {states.map(
                (state) => (

                  <option
                    key={state.code}
                    value={state.code}
                  >
                    {state.name}
                  </option>

                )
              )}

            </select>


            <div className="flex items-center gap-2">

              <span className="text-[8px] text-slate-600">
                Accessibility
              </span>

              <span className="text-sm font-bold text-emerald-600">
                {currentState.accessibility}
                /100
              </span>

            </div>

          </div>

        </div>


        <button
          onClick={() =>
            setShowLayers(
              (previous) =>
                !previous
            )
          }
          className={`px-4 py-3 rounded-xl border flex items-center justify-center gap-2 transition ${
            showLayers
              ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-600"
              : "bg-white border-slate-200 text-slate-400 hover:text-slate-900"
          }`}
        >

          <Layers size={14} />

          <span className="text-[9px]">
            Map Layers
          </span>

          <span className="text-[7px] opacity-60">
            {activeLayers.length}
          </span>

        </button>

      </div>


      {/* ===================================================
          LAYER PANEL
      ==================================================== */}

      {showLayers && (

        <div className="bg-white border border-cyan-500/20 rounded-2xl p-4 mb-5">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h3 className="font-semibold text-sm">
                Intelligence Layers
              </h3>

              <p className="text-[8px] text-slate-600 mt-1">
                Select the information you want to display.
              </p>

            </div>

            <button
              onClick={() =>
                setShowLayers(false)
              }
              className="text-slate-600 hover:text-slate-900"
            >
              <X size={15} />
            </button>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">

            {layers.map(
              (layer) => {

                const Icon =
                  layer.icon;

                const active =
                  activeLayers.includes(
                    layer.id
                  );

                return (

                  <button
                    key={layer.id}
                    onClick={() =>
                      toggleLayer(
                        layer.id
                      )
                    }
                    className={`p-3 rounded-xl border text-left transition ${
                      active
                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-600"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <Icon size={14} />

                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          active
                            ? "bg-emerald-400"
                            : "bg-slate-700"
                        }`}
                      />

                    </div>

                    <p className="text-[8px] mt-3">
                      {layer.label}
                    </p>

                  </button>

                );

              }
            )}

          </div>


          <button
            onClick={resetMap}
            className="mt-3 text-[8px] text-slate-600 hover:text-slate-900"
          >
            Reset map controls
          </button>

        </div>

      )}


      {/* ===================================================
          STATISTICS
      ==================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">

        <MapStat
          icon={Gauge}
          label="Accessibility"
          value={`${currentState.accessibility}%`}
          detail={currentState.name}
          color="text-emerald-600"
        />

        <MapStat
          icon={ShieldAlert}
          label="Regional Risk"
          value={`${currentState.risk}%`}
          detail="Current risk index"
          color="text-red-600"
        />

        <MapStat
          icon={Truck}
          label="Live Vehicles"
          value={liveVehicles.length}
          detail={`${highRiskVehicles.length} high risk`}
          color="text-cyan-600"
        />

        <MapStat
          icon={Hospital}
          label="Emergency Access"
          value={`${currentState.emergency}%`}
          detail="Critical facilities"
          color="text-purple-600"
        />

      </div>


      {/* ===================================================
          MAIN CONTENT
      ==================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5">


        {/* MAP */}

        <div className="relative min-h-[650px] rounded-2xl overflow-hidden border border-slate-200 bg-[#020817]">

          <GISMap
            calculatedRoute={calculatedRoute}
            vehicles={dbVehicles}
            incidents={dbIncidents}
            routes={dbRoutes}
          />


          <div className="absolute left-4 top-4 z-[1000]">

            <div className="bg-slate-50/90 backdrop-blur-md border border-slate-300 rounded-xl px-4 py-3">

              <div className="flex items-center gap-2">

                <Map
                  size={15}
                  className="text-cyan-600"
                />

                <div>

                  <p className="text-xs font-semibold">
                    {currentState.name}
                  </p>

                  <p className="text-[8px] text-slate-600 mt-1">
                    NER Accessibility Intelligence
                  </p>

                </div>

              </div>

            </div>

          </div>


          <div className="absolute right-4 top-4 z-[1000] flex gap-2">

            <button
              onClick={() =>
                setShowLayers(true)
              }
              className="w-9 h-9 rounded-lg bg-slate-50/90 border border-slate-300 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-400/30 transition"
              title="Map layers"
            >
              <Layers size={14} />
            </button>


            <button
              onClick={() =>
                notify(
                  "Map centered on active NER region."
                )
              }
              className="w-9 h-9 rounded-lg bg-slate-50/90 border border-slate-300 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-400/30 transition"
              title="Locate"
            >
              <Crosshair size={14} />
            </button>

          </div>


          <div className="absolute top-20 right-4 z-[1000]">

            <div className="bg-slate-50/90 backdrop-blur-md border border-slate-300 rounded-xl p-3">

              <p className="text-[7px] uppercase tracking-widest text-slate-600">
                Active Layers
              </p>

              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[180px]">

                {activeLayers.map(
                  (layer) => (

                    <span
                      key={layer}
                      className="px-2 py-1 rounded-md bg-cyan-500/10 text-[6px] text-cyan-600 border border-cyan-500/10"
                    >
                      {layer}
                    </span>

                  )
                )}

              </div>

            </div>

          </div>


          <div className="absolute left-4 bottom-4 z-[1000]">

            <div className="bg-slate-50/90 backdrop-blur-md border border-slate-300 rounded-xl p-4">

              <p className="text-[8px] uppercase tracking-widest text-slate-600 mb-3">
                Accessibility
              </p>

              <div className="space-y-2">

                <LegendRow
                  color="bg-emerald-400"
                  label="Highly Accessible"
                  value="80–100"
                />

                <LegendRow
                  color="bg-yellow-400"
                  label="Moderate"
                  value="60–79"
                />

                <LegendRow
                  color="bg-orange-400"
                  label="Restricted"
                  value="40–59"
                />

                <LegendRow
                  color="bg-red-500"
                  label="Critical"
                  value="0–39"
                />

              </div>

            </div>

          </div>


          <button
            onClick={() =>
              notify(
                "You are already viewing the full operational map."
              )
            }
            className="absolute right-4 bottom-4 z-[1000] bg-slate-50/90 backdrop-blur-md border border-slate-300 rounded-xl px-4 py-3 hover:border-cyan-400/30 transition text-left"
          >

            <p className="text-[7px] text-slate-600">
              NER COVERAGE
            </p>

            <p className="text-lg font-bold mt-1">
              8 States
            </p>

            <p className="text-[7px] text-emerald-600 mt-1">
              ● Monitoring active
            </p>

          </button>


          <div className="absolute left-1/2 bottom-5 -translate-x-1/2 z-[1000]">

            <div className="flex items-center gap-1 bg-slate-50/90 backdrop-blur-md border border-slate-300 rounded-xl p-1">

              <MapAction
                active={activeLayers.includes(
                  "VEHICLES"
                )}
                icon={Truck}
                label="Vehicles"
                onClick={() =>
                  toggleLayer(
                    "VEHICLES"
                  )
                }
              />

              <MapAction
                active={activeLayers.includes(
                  "INCIDENTS"
                )}
                icon={AlertTriangle}
                label="Incidents"
                onClick={() =>
                  toggleLayer(
                    "INCIDENTS"
                  )
                }
              />

              <MapAction
                active={activeLayers.includes(
                  "FLOOD"
                )}
                icon={Waves}
                label="Flood"
                onClick={() =>
                  toggleLayer(
                    "FLOOD"
                  )
                }
              />

              <MapAction
                active={activeLayers.includes(
                  "LANDSLIDE"
                )}
                icon={Mountain}
                label="Landslide"
                onClick={() =>
                  toggleLayer(
                    "LANDSLIDE"
                  )
                }
              />

            </div>

          </div>

        </div>


        {/* =================================================
            INTELLIGENCE PANEL
        ================================================== */}

        <div className="space-y-4">


          {/* ACCESSIBILITY */}

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] uppercase tracking-widest text-slate-600">
                  Accessibility Score
                </p>

                <p className="text-4xl font-bold mt-2">

                  {currentState.accessibility}

                  <span className="text-lg text-slate-600">
                    /100
                  </span>

                </p>

              </div>


              <div className="w-14 h-14 rounded-full border-4 border-emerald-400/20 flex items-center justify-center">

                <Activity
                  size={19}
                  className="text-emerald-600"
                />

              </div>

            </div>


            <div className="h-2 bg-slate-50 rounded-full mt-5 overflow-hidden">

              <div
                className={`h-full rounded-full ${
                  currentState.accessibility >=
                  80
                    ? "bg-emerald-400"
                    : currentState.accessibility >=
                      60
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
                style={{
                  width: `${currentState.accessibility}%`,
                }}
              />

            </div>


            <p className="text-[8px] text-emerald-600 mt-3">

              ●{" "}

              {currentState.accessibility >=
              80
                ? "HIGHLY ACCESSIBLE"
                : currentState.accessibility >=
                  60
                ? "MODERATELY ACCESSIBLE"
                : "RESTRICTED ACCESS"}

            </p>

          </div>


          {/* FACTORS */}

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">

                <ShieldAlert
                  size={15}
                  className="text-red-600"
                />

              </div>

              <div>

                <h3 className="font-semibold text-sm">
                  Accessibility Factors
                </h3>

                <p className="text-[8px] text-slate-600 mt-1">
                  Current regional conditions
                </p>

              </div>

            </div>


            <FactorRow
              icon={Route}
              label="Road Connectivity"
              value={86}
              color="bg-cyan-400"
            />

            <FactorRow
              icon={CloudRain}
              label="Weather Conditions"
              value={
                weatherMode
                  ? 78
                  : 0
              }
              color="bg-blue-400"
            />

            <FactorRow
              icon={Mountain}
              label="Terrain Safety"
              value={
                100 -
                currentState.risk
              }
              color="bg-orange-400"
            />

            <FactorRow
              icon={Waves}
              label="Flood Accessibility"
              value={81}
              color="bg-purple-400"
            />

          </div>


          {/* AI INSIGHT */}

          <div className="bg-white border border-emerald-200 rounded-2xl p-5">

            <div className="flex items-center gap-3 mb-4">

              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">

                <BrainCircuit
                  size={16}
                  className="text-emerald-600"
                />

              </div>

              <div>

                <h3 className="font-semibold text-sm">
                  AI Accessibility Insight
                </h3>

                <p className="text-[7px] text-emerald-600 mt-1">
                  ANALYSIS ACTIVE
                </p>

              </div>

            </div>


            <p className="text-[9px] text-slate-400 leading-5">

              {selectedState ===
              "AR"
                ? "Mountain-road conditions and potential landslide exposure are reducing accessibility. Prefer monitored corridors and maintain an alternative route."
                : selectedState ===
                  "MN"
                ? "Accessibility is currently restricted. Verify road conditions before dispatching high-priority logistics."
                : selectedState ===
                  "AS"
                ? "Connectivity remains favorable. Continue monitoring flood-prone corridors during heavy rainfall."
                : "Regional accessibility is currently moderate-to-good. Continue monitoring weather, road and incident signals before dispatch."}

            </p>

          </div>


          {/* ROUTE PLANNER */}

          <RoutePlanner
            onRouteFound={
              handleRouteFound
            }
          />


          {/* =================================================
              ROUTE RESULT - FIXED
          ================================================= */}

          {calculatedRoute && (

            <div className="bg-emerald-500/[0.04] border border-emerald-200 rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">

                  <CheckCircle2
                    size={16}
                    className="text-emerald-600"
                  />

                </div>

                <div>

                  <h3 className="text-sm font-semibold">
                    Route Ready
                  </h3>

                  <p className="text-[7px] text-emerald-600 mt-1">
                    ROUTE DISPLAYED ON MAP
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-2 gap-3 mt-4">

                <SmallValue
                  label="Distance"
                  value={
                    calculatedRoute.distanceText ||
                    "Calculated"
                  }
                />


                <SmallValue
                  label="ETA"
                  value={
                    calculatedRoute.durationText ||
                    "Calculated"
                  }
                />


                {/* FIXED RISK */}

                <SmallValue
                  label="Risk Level"
                  value={
                    routeRiskLevel
                  }
                />


                <SmallValue
                  label="Safety Score"
                  value={
                    routeSafetyScore !== null &&
                    routeSafetyScore !== undefined
                      ? `${routeSafetyScore}/100`
                      : "Evaluated"
                  }
                />


                {/* OPTIONAL RISK SCORE */}

                {routeRiskScore !== null &&
                  routeRiskScore !== undefined && (

                  <SmallValue
                    label="Risk Score"
                    value={`${routeRiskScore}/100`}
                  />

                )}


                <SmallValue
                  label="Status"
                  value="Recommended"
                />

              </div>


              <button
                onClick={() =>
                  notify(
                    "Route is active on the operational map."
                  )
                }
                className="w-full mt-4 py-2.5 rounded-xl bg-emerald-400 text-slate-950 text-[9px] font-semibold"
              >
                Active Route
              </button>

            </div>

          )}


          {/* FACILITIES */}

          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={() =>
                navigate("/hospitals")
              }
              className="text-left bg-white border border-slate-200 shadow-sm rounded-xl p-4 hover:border-purple-500/30 transition"
            >

              <Hospital
                size={15}
                className="text-purple-600"
              />

              <p className="text-[7px] uppercase text-slate-700 mt-3">
                Hospitals
              </p>

              <p className="text-lg font-bold mt-1">
                27
              </p>

              <p className="text-[7px] text-purple-600 mt-1">
                Open facilities →
              </p>

            </button>


            <button
              onClick={() =>
                navigate("/warehouses")
              }
              className="text-left bg-white border border-slate-200 shadow-sm rounded-xl p-4 hover:border-cyan-500/30 transition"
            >

              <Warehouse
                size={15}
                className="text-cyan-600"
              />

              <p className="text-[7px] uppercase text-slate-700 mt-3">
                Warehouses
              </p>

              <p className="text-lg font-bold mt-1">
                18
              </p>

              <p className="text-[7px] text-cyan-600 mt-1">
                Open facilities →
              </p>

            </button>

          </div>

        </div>

      </div>


      {/* ===================================================
          QUICK ACTIONS
      ==================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">

        <QuickAction
          icon={Truck}
          label="Vehicle Center"
          description={`${liveVehicles.length} live vehicles`}
          onClick={() =>
            navigate("/vehicles")
          }
        />

        <QuickAction
          icon={AlertTriangle}
          label="Incident Center"
          description={`${criticalIncidents.length} critical incidents`}
          onClick={() =>
            navigate("/incidents")
          }
        />

        <QuickAction
          icon={Hospital}
          label="Emergency Facilities"
          description="Hospitals & response"
          onClick={() =>
            navigate("/hospitals")
          }
        />

        <QuickAction
          icon={Warehouse}
          label="Supply Network"
          description="Warehouses & logistics"
          onClick={() =>
            navigate("/warehouses")
          }
        />

      </div>


      {/* ===================================================
          VEHICLE MODAL
      ==================================================== */}

      {selectedVehicle && (

        <Modal
          title="Vehicle Intelligence"
          onClose={() =>
            setSelectedVehicle(null)
          }
        >

          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">

                <Truck
                  size={18}
                  className="text-cyan-600"
                />

              </div>

              <div>

                <p className="font-semibold">
                  {selectedVehicle.name ||
                    selectedVehicle.id ||
                    "Live Vehicle"}
                </p>

                <p className="text-[8px] text-emerald-600 mt-1">
                  LIVE
                </p>

              </div>

            </div>


            <div className="grid grid-cols-2 gap-3">

              <SmallValue
                label="Status"
                value={
                  selectedVehicle.status ||
                  "LIVE"
                }
              />

              <SmallValue
                label="Risk"
                value={
                  selectedVehicle.risk ||
                  "LOW"
                }
              />

            </div>


            <button
              onClick={() => {
                setSelectedVehicle(null);
                navigate("/vehicles");
              }}
              className="w-full py-3 rounded-xl bg-cyan-400 text-slate-950 text-xs font-semibold"
            >
              Open Vehicle Center
            </button>

          </div>

        </Modal>

      )}


      {/* ===================================================
          INCIDENT MODAL
      ==================================================== */}

      {selectedIncident && (

        <Modal
          title="Incident Intelligence"
          onClose={() =>
            setSelectedIncident(null)
          }
        >

          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">

                <AlertTriangle
                  size={18}
                  className="text-red-600"
                />

              </div>

              <div>

                <p className="font-semibold">
                  {selectedIncident.type ||
                    "Incident"}
                </p>

                <p className="text-[8px] text-slate-600 mt-1">
                  {selectedIncident.severity ||
                    "ACTIVE"}
                </p>

              </div>

            </div>


            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

              <p className="text-[8px] uppercase text-slate-600">
                Location
              </p>

              <p className="text-sm mt-1">
                {selectedIncident.location ||
                  "Operational zone"}
              </p>

            </div>


            <button
              onClick={() => {
                setSelectedIncident(null);
                navigate("/incidents");
              }}
              className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-50 text-xs font-semibold"
            >
              Open Incident Center
            </button>

          </div>

        </Modal>

      )}


      {/* ===================================================
          RISK MODAL
      ==================================================== */}

      {selectedRiskZone && (

        <Modal
          title="Risk Zone Intelligence"
          onClose={() =>
            setSelectedRiskZone(null)
          }
        >

          <div className="space-y-4">

            <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">

              <ShieldAlert
                size={18}
                className="text-orange-600"
              />

            </div>


            <p className="text-sm text-slate-400">
              This operational risk zone requires
              continuous monitoring before route dispatch.
            </p>


            <button
              onClick={() => {
                setSelectedRiskZone(null);
                navigate("/alerts");
              }}
              className="w-full py-3 rounded-xl bg-orange-400 text-slate-950 text-xs font-semibold"
            >
              Open Risk Alerts
            </button>

          </div>

        </Modal>

      )}


      {/* ===================================================
          FOOTER
      ==================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-5 px-1">

        <div className="flex items-center gap-2">

          <span
            className={`w-2 h-2 rounded-full ${
              liveMode
                ? "bg-emerald-400 animate-pulse"
                : "bg-slate-600"
            }`}
          />

          <span className="text-[8px] text-slate-600">
            NER GIS intelligence{" "}
            {liveMode
              ? "operational"
              : "paused"}
          </span>

        </div>


        <div className="flex items-center gap-4">

          <span className="text-[8px] text-slate-700">
            {states.length} States monitored
          </span>

          <span className="text-[8px] text-slate-700">
            {liveVehicles.length} Live vehicles
          </span>

          <span className="text-[8px] text-slate-700">
            {dbIncidents.length} Incidents
          </span>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   MAP STAT
========================================================= */

function MapStat({
  icon: Icon,
  label,
  value,
  detail,
  color,
}) {

  return (

    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">

          <Icon
            size={16}
            className={color}
          />

        </div>

        <div>

          <p className="text-[8px] uppercase text-slate-600">
            {label}
          </p>

          <p className="text-lg font-bold mt-1">
            {value}
          </p>

          <p className="text-[7px] text-slate-700 mt-1">
            {detail}
          </p>

        </div>

      </div>

    </div>

  );
}


/* =========================================================
   MAP ACTION
========================================================= */

function MapAction({
  icon: Icon,
  label,
  active,
  onClick,
}) {

  return (

    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg flex items-center gap-2 transition ${
        active
          ? "bg-cyan-500/10 text-cyan-600"
          : "text-slate-600 hover:text-slate-900"
      }`}
    >

      <Icon size={12} />

      <span className="text-[7px]">
        {label}
      </span>

    </button>

  );
}


/* =========================================================
   LEGEND
========================================================= */

function LegendRow({
  color,
  label,
  value,
}) {

  return (

    <div className="flex items-center gap-3">

      <span
        className={`w-2.5 h-2.5 rounded-full ${color}`}
      />

      <span className="text-[7px] text-slate-400 flex-1">
        {label}
      </span>

      <span className="text-[7px] text-slate-700">
        {value}
      </span>

    </div>

  );
}


/* =========================================================
   FACTOR
========================================================= */

function FactorRow({
  icon: Icon,
  label,
  value,
  color,
}) {

  return (

    <div className="mb-4">

      <div className="flex items-center gap-2 mb-2">

        <Icon
          size={12}
          className="text-slate-600"
        />

        <span className="text-[8px] text-slate-400 flex-1">
          {label}
        </span>

        <span className="text-[8px] text-slate-700">
          {value}%
        </span>

      </div>


      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">

        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>

  );
}


/* =========================================================
   SMALL VALUE
========================================================= */

function SmallValue({
  label,
  value,
}) {

  return (

    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">

      <p className="text-[7px] uppercase text-slate-600">
        {label}
      </p>

      <p className="text-sm font-semibold mt-1">
        {String(value)}
      </p>

    </div>

  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon: Icon,
  label,
  description,
  onClick,
}) {

  return (

    <button
      onClick={onClick}
      className="text-left bg-white border border-slate-200 shadow-sm rounded-xl p-4 hover:border-cyan-500/20 hover:bg-slate-100 transition"
    >

      <Icon
        size={15}
        className="text-cyan-600"
      />

      <p className="text-[9px] font-medium mt-3">
        {label}
      </p>

      <p className="text-[7px] text-slate-600 mt-1">
        {description}
      </p>

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

    <div className="fixed inset-0 z-[5000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">

      <div className="w-full max-w-md bg-white border border-slate-300 rounded-2xl shadow-2xl">

        <div className="flex items-center justify-between p-5 border-b border-slate-200">

          <h3 className="font-semibold">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900"
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


export default LiveMap;
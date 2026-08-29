

import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";







import {



  Activity,



  AlertTriangle,



  Battery,



  CheckCircle2,



  Clock3,



  MapPin,



  Navigation,



  Radio,



  RefreshCw,



  Search,



  ShieldAlert,



  ShieldCheck,



  Signal,



  Truck,



  User,



  X,



  Zap,



} from "lucide-react";







import {



  getVehicles,



  getFleetStats,



  updateVehicle,



  dispatchVehicle as apiDispatchVehicle,



  markVehicleIdle as apiMarkVehicleIdle,



} from "../services/api";











// =========================================================



// HELPERS



// =========================================================







const getRiskScore = (risk) => {



  if (risk === "HIGH") return 72;



  if (risk === "MEDIUM") return 42;



  return 18;



};











const getStatusClass = (status) => {



  if (status === "LIVE") {



    return "text-emerald-700 bg-emerald-50 border-emerald-200";



  }







  if (status === "IDLE") {



    return "text-amber-700 bg-amber-50 border-amber-200";



  }







  return "text-slate-500 bg-slate-100 border-slate-200";



};











const getRiskClass = (risk) => {



  if (risk === "HIGH") {



    return "text-red-600";



  }







  if (risk === "MEDIUM") {



    return "text-amber-600";



  }







  return "text-emerald-600";



};











const getRiskBarClass = (risk) => {



  if (risk === "HIGH") {



    return "bg-red-500";



  }







  if (risk === "MEDIUM") {



    return "bg-amber-500";



  }







  return "bg-emerald-500";



};











// =========================================================



// NORMALIZE BACKEND VEHICLE



// =========================================================







const normalizeVehicle = (vehicle, index) => {



  const backendStatus = String(



    vehicle.status || ""



  ).toUpperCase();







  let status = "OFFLINE";







  if (



    backendStatus === "ACTIVE" ||



    backendStatus === "LIVE"



  ) {



    status = "LIVE";



  }







  if (



    backendStatus === "INACTIVE" ||



    backendStatus === "IDLE"



  ) {



    status = "IDLE";



  }







  if (backendStatus === "OFFLINE") {



    status = "OFFLINE";



  }











  let location = vehicle.location;







  if (!location) {



    if (



      vehicle.latitude !== null &&



      vehicle.latitude !== undefined &&



      vehicle.longitude !== null &&



      vehicle.longitude !== undefined



    ) {



      location =



        `${Number(vehicle.latitude).toFixed(4)}, ` +



        `${Number(vehicle.longitude).toFixed(4)}`;



    } else {



      location = "Location unavailable";



    }



  }











  return {



    ...vehicle,







    id:



      vehicle.vehicle_number ||



      vehicle.vehicle_id ||



      vehicle.id ||



      `VEH-${index + 1}`,







    backendId: vehicle.id,







    status,







    risk: String(



      vehicle.risk ||



      vehicle.risk_level ||



      "LOW"



    ).toUpperCase(),







    speed:



      vehicle.speed ??



      0,







    battery:



      vehicle.battery ??



      vehicle.battery_level ??



      100,







    heading:



      vehicle.heading ||



      "N/A",







    gps:



      vehicle.gps ||



      "Connected",







    location,







    driver:



      vehicle.driver ||



      vehicle.driver_name ||



      "Unassigned",







    assignment:



      vehicle.current_route ||



      vehicle.assignment ||



      "No active assignment",







    eta:



      vehicle.eta_minutes != null



        ? `${vehicle.eta_minutes} min`



        : vehicle.eta || "N/A",







    cargo:



      vehicle.cargo_type ||



      "None",







    fuelLevel:



      vehicle.fuel_level ?? 100,







    riskScore:



      vehicle.risk_score ?? 0,



  };



};











// =========================================================



// MAIN



// =========================================================







function Vehicles() {
  const { t } = useTranslation();



  const [fleet, setFleet] = useState([]);







  const [loading, setLoading] =



    useState(true);







  const [apiError, setApiError] =



    useState(null);







  const [selectedVehicleId, setSelectedVehicleId] =



    useState(null);







  const [search, setSearch] =



    useState("");







  const [filter, setFilter] =



    useState("ALL");







  const [gpsConnected, setGpsConnected] =



    useState(true);







  const [refreshing, setRefreshing] =



    useState(false);







  const [lastUpdate, setLastUpdate] =



    useState("Just now");







  const [toast, setToast] =



    useState(null);







  const [showSafetyReport, setShowSafetyReport] =



    useState(false);







  const [dispatching, setDispatching] =



    useState(false);







  const [fleetStats, setFleetStats] =



    useState(null);











  // =======================================================



  // TOAST



  // =======================================================







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











  // =======================================================



  // LOAD VEHICLES



  // =======================================================







  const loadFleet = async () => {



    try {



      setLoading(true);



      setApiError(null);







      const [data, stats] =



        await Promise.all([



          getVehicles(),



          getFleetStats(),



        ]);







      setFleetStats(stats);







      const vehicles = Array.isArray(data)



        ? data



        : data?.vehicles || [];







      const normalized = vehicles.map(



        normalizeVehicle



      );







      setFleet(normalized);







      setSelectedVehicleId(



        (currentId) => {



          const exists = normalized.some(



            (vehicle) =>



              vehicle.id === currentId



          );







          return exists



            ? currentId



            : normalized[0]?.id || null;



        }



      );







      setLastUpdate("Just now");



    } catch (error) {



      console.error(



        "Vehicle API error:",



        error



      );







      setApiError(



        error.message ||



        "Unable to connect to vehicle backend."



      );



    } finally {



      setLoading(false);



    }



  };











  // =======================================================



  // INITIAL LOAD



  // =======================================================







  useEffect(() => {



    loadFleet();



  }, []);











  // =======================================================



  // SELECTED VEHICLE



  // =======================================================







  const selectedVehicle = useMemo(() => {



    return (



      fleet.find(



        (vehicle) =>



          vehicle.id ===



          selectedVehicleId



      ) ||



      fleet[0] ||



      null



    );



  }, [



    fleet,



    selectedVehicleId,



  ]);











  // =======================================================



  // STATISTICS



  // =======================================================







  const totalVehicles =



    fleet.length;







  const liveVehicles =



    fleet.filter(



      (vehicle) =>



        vehicle.status === "LIVE"



    ).length;







  const highRiskVehicles =



    fleet.filter(



      (vehicle) =>



        vehicle.risk === "HIGH"



    ).length;







  const idleVehicles =



    fleet.filter(



      (vehicle) =>



        vehicle.status === "IDLE"



    ).length;







  const offlineVehicles =



    fleet.filter(



      (vehicle) =>



        vehicle.status === "OFFLINE"



    ).length;











  // =======================================================



  // FILTER



  // =======================================================







  const filteredVehicles = useMemo(() => {



    const query =



      search.trim().toLowerCase();







    return fleet.filter((vehicle) => {



      const matchesSearch =



        !query ||



        String(vehicle.id)



          .toLowerCase()



          .includes(query) ||



        String(vehicle.location)



          .toLowerCase()



          .includes(query) ||



        String(vehicle.driver)



          .toLowerCase()



          .includes(query);







      const matchesFilter =



        filter === "ALL" ||



        vehicle.status === filter ||



        vehicle.risk === filter;







      return (



        matchesSearch &&



        matchesFilter



      );



    });



  }, [



    fleet,



    search,



    filter,



  ]);











  // =======================================================



  // REFRESH



  // =======================================================







  const refreshFleet = async () => {



    if (refreshing) return;







    setRefreshing(true);







    await loadFleet();







    setRefreshing(false);







    notify(



      "Fleet data refreshed successfully."



    );



  };











  // =======================================================



  // GPS



  // =======================================================







  const toggleGPS = () => {



    const next = !gpsConnected;







    setGpsConnected(next);







    setFleet((vehicles) =>



      vehicles.map((vehicle) => ({



        ...vehicle,



        gps: next



          ? "Connected"



          : "Disconnected",



      }))



    );







    notify(



      next



        ? "GPS connection restored."



        : "GPS monitoring paused.",



      next



        ? "success"



        : "warning"



    );



  };











  // =======================================================



  // LOCATE



  // =======================================================







  const locateVehicle = () => {



    if (!selectedVehicle) return;







    notify(



      `${selectedVehicle.id} location centered on map.`



    );



  };











  // =======================================================



  // DISPATCH



  // =======================================================







  const dispatchVehicle = async () => {



    if (!selectedVehicle) return;







    if (



      selectedVehicle.status ===



      "OFFLINE"



    ) {



      notify(



        `${selectedVehicle.id} is offline.`,



        "error"



      );







      return;



    }







    if (dispatching) return;







    setDispatching(true);







    try {



      const updated =



        await apiDispatchVehicle(



          selectedVehicle.backendId



        );







      const normalized =



        normalizeVehicle(



          updated,



          0



        );







      setFleet((vehicles) =>



        vehicles.map((vehicle) =>



          vehicle.backendId ===



          selectedVehicle.backendId



            ? {



                ...vehicle,



                ...normalized,



              }



            : vehicle



        )



      );







      notify(



        `${selectedVehicle.id} dispatched successfully.`



      );



    } catch (error) {



      notify(



        error.message ||



        "Dispatch failed.",



        "error"



      );



    } finally {



      setDispatching(false);



    }



  };











  // =======================================================



  // MARK IDLE



  // =======================================================







  const markVehicleIdle = async () => {



    if (!selectedVehicle) return;







    try {



      const updated =



        await apiMarkVehicleIdle(



          selectedVehicle.backendId



        );







      const normalized =



        normalizeVehicle(updated, 0);







      setFleet((vehicles) =>



        vehicles.map((vehicle) =>



          vehicle.backendId ===



          selectedVehicle.backendId



            ? {



                ...vehicle,



                ...normalized,



              }



            : vehicle



        )



      );







      notify(



        `${selectedVehicle.id} marked as idle.`



      );



    } catch (error) {



      notify(



        error.message ||



        "Unable to update vehicle.",



        "error"



      );



    }



  };











  // =======================================================



  // SELECT



  // =======================================================







  const selectVehicle = (vehicle) => {



    setSelectedVehicleId(



      vehicle.id



    );



  };











  // =======================================================



  // RENDER



  // =======================================================







  return (



    <div className="min-h-full bg-slate-50 p-6 space-y-6">







      {toast && (



        <div className="fixed right-5 bottom-5 z-[6000]">



          <div



            className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white border shadow-xl ${



              toast.type === "error"



                ? "border-red-200"



                : toast.type === "warning"



                ? "border-amber-200"



                : "border-emerald-200"



            }`}



          >



            {toast.type === "error" ||



            toast.type === "warning" ? (



              <AlertTriangle



                size={16}



                className={



                  toast.type === "error"



                    ? "text-red-500"



                    : "text-amber-500"



                }



              />



            ) : (



              <CheckCircle2



                size={16}



                className="text-emerald-500"



              />



            )}







            <span className="text-xs font-medium text-slate-700">



              {toast.message}



            </span>



          </div>



        </div>



      )}











      {apiError && (



        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">



          <div className="flex items-center gap-2">



            <AlertTriangle



              size={15}



              className="text-red-500"



            />







            <p className="text-xs text-red-600">



              {apiError}



            </p>



          </div>



        </div>



      )}











      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">







        <div>



          <div className="flex items-center gap-2">



            <span



              className={`w-2 h-2 rounded-full ${



                gpsConnected



                  ? "bg-emerald-500"



                  : "bg-red-500"



              }`}



            />







            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600">



              Fleet Operations •{" "}



              {gpsConnected



                ? "Live"



                : "Disconnected"}



            </span>



          </div>







          <h1 className="text-3xl font-bold text-slate-900 mt-2">



            Vehicle Intelligence



          </h1>







          <p className="text-sm text-slate-500 mt-1">



            Real-time {t("vehicles.title")}, vehicle health and risk intelligence



          </p>



        </div>











        <div className="flex flex-wrap gap-2">







          <button



            onClick={toggleGPS}



            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-white shadow-sm ${



              gpsConnected



                ? "border-emerald-200 text-emerald-700"



                : "border-red-200 text-red-600"



            }`}



          >



            <Radio size={14} />







            <span className="text-xs font-medium">



              {gpsConnected



                ? "GPS Connected"



                : "GPS Offline"}



            </span>



          </button>











          <button



            onClick={refreshFleet}



            disabled={



              refreshing ||



              loading



            }



            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm disabled:opacity-50"



          >



            <RefreshCw



              size={14}



              className={



                refreshing



                  ? "animate-spin text-emerald-600"



                  : "text-slate-500"



              }



            />







            <div className="text-left">



              <p className="text-[8px] uppercase text-slate-400">



                Last Update



              </p>







              <p className="text-xs font-medium text-slate-700">



                {lastUpdate}



              </p>



            </div>



          </button>







        </div>



      </div>











      {/* =====================================================



          KPI



      ====================================================== */}







      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">







        <FleetKpi



          icon={Truck}



          label="Total Fleet"



          value={totalVehicles}



          color="text-blue-600"



          bg="bg-blue-50"



        />







        <FleetKpi



          icon={Activity}



          label="Live"



          value={liveVehicles}



          color="text-emerald-600"



          bg="bg-emerald-50"



        />







        <FleetKpi



          icon={ShieldAlert}



          label="High Risk"



          value={highRiskVehicles}



          color="text-red-600"



          bg="bg-red-50"



        />







        <FleetKpi



          icon={Clock3}



          label="Idle"



          value={idleVehicles}



          color="text-amber-600"



          bg="bg-amber-50"



        />







        <FleetKpi



          icon={Signal}



          label="Offline"



          value={offlineVehicles}



          color="text-slate-500"



          bg="bg-slate-100"



        />







      </div>











      {/* =====================================================



          MAIN



      ====================================================== */}







      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-5">







        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">







          <div className="p-5 border-b border-slate-200">







            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">







              <div>



                <h2 className="text-sm font-semibold text-slate-900">



                  Fleet Vehicles



                </h2>







                <p className="text-[10px] text-slate-400 mt-1">



                  Select a vehicle to inspect live telemetry



                </p>



              </div>











              <div className="relative">







                <Search



                  size={14}



                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"



                />







                <input



                  value={search}



                  onChange={(e) =>



                    setSearch(



                      e.target.value



                    )



                  }



                  placeholder="Search vehicle, location, driver..."



                  className="w-full md:w-72 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pl-9 text-xs outline-none"



                />







              </div>







            </div>











            <div className="flex flex-wrap gap-2 mt-4">







              {[



                "ALL",



                "LIVE",



                "IDLE",



                "HIGH",



                "OFFLINE",



              ].map((item) => (



                <button



                  key={item}



                  onClick={() =>



                    setFilter(item)



                  }



                  className={`px-3 py-1.5 rounded-lg text-[9px] font-medium border ${



                    filter === item



                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"



                      : "bg-white border-slate-200 text-slate-500"



                  }`}



                >



                  {item}



                </button>



              ))}







            </div>







          </div>











          <div className="p-4 space-y-2">







            {loading ? (



              <div className="py-14 text-center">



                <RefreshCw



                  size={28}



                  className="mx-auto text-emerald-500 animate-spin"



                />







                <p className="text-sm text-slate-500 mt-3">



                  Loading fleet...



                </p>



              </div>



            ) : filteredVehicles.length === 0 ? (



              <div className="py-14 text-center">







                <Truck



                  size={30}



                  className="mx-auto text-slate-300"



                />







                <p className="text-sm text-slate-500 mt-3">



                  No vehicles found



                </p>







                <button



                  onClick={() => {



                    setSearch("");



                    setFilter("ALL");



                  }}



                  className="mt-3 text-xs text-emerald-600"



                >



                  Clear filters



                </button>







              </div>



            ) : (



              filteredVehicles.map(



                (vehicle) => (



                  <VehicleRow



                    key={vehicle.backendId}



                    vehicle={vehicle}



                    selected={



                      selectedVehicle?.id ===



                      vehicle.id



                    }



                    onClick={() =>



                      selectVehicle(vehicle)



                    }



                  />



                )



              )



            )}







          </div>







        </div>











        <VehicleDetails



          vehicle={selectedVehicle}



          onLocate={locateVehicle}



          onDispatch={dispatchVehicle}



          onSafetyReport={() =>



            setShowSafetyReport(true)



          }



          onMarkIdle={markVehicleIdle}



          dispatching={dispatching}



        />







      </div>











      {/* =====================================================



          HEALTH



      ====================================================== */}







      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">







        <FleetHealth



          icon={Battery}



          title="Vehicle Health"



          value={



            fleetStats



              ? `${fleetStats.fleet_health}%`



              : "—"



          }



          description={



            fleetStats



              ? `Avg battery: ${fleetStats.avg_battery}%`



              : "Loading..."



          }



        />







        <FleetHealth



          icon={Signal}



          title="GPS Connectivity"



          value={



            gpsConnected



              ? "98.7%"



              : "0%"



          }



          description={



            gpsConnected



              ? "Stable telemetry stream"



              : "Telemetry connection paused"



          }



        />







        <FleetHealth



          icon={ShieldCheck}



          title="Fleet Safety"



          value={



            highRiskVehicles === 0



              ? "100%"



              : `${Math.max(



                  0,



                  100 -



                    highRiskVehicles * 8



                )}%`



          }



          description="Calculated from current fleet risk"



        />







      </div>











      {showSafetyReport &&



        selectedVehicle && (



          <SafetyReportModal



            vehicle={selectedVehicle}



            onClose={() =>



              setShowSafetyReport(false)



            }



          />



        )}







    </div>



  );



}











// =========================================================



// KPI



// =========================================================







function FleetKpi({



  icon: Icon,



  label,



  value,



  color,



  bg,



}) {



  return (



    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">







      <div className="flex items-center justify-between">







        <div



          className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}



        >



          <Icon



            size={17}



            className={color}



          />



        </div>







        <span className="w-2 h-2 rounded-full bg-emerald-500" />







      </div>







      <p className="text-[9px] uppercase tracking-wider text-slate-400 mt-4">



        {label}



      </p>







      <p className="text-2xl font-bold text-slate-900 mt-1">



        {value}



      </p>







    </div>



  );



}











// =========================================================



// VEHICLE ROW



// =========================================================







function VehicleRow({



  vehicle,



  selected,



  onClick,



}) {



  return (



    <button



      onClick={onClick}



      className={`w-full text-left p-4 rounded-xl border ${



        selected



          ? "bg-emerald-50/70 border-emerald-300"



          : "bg-white border-slate-200"



      }`}



    >







      <div className="flex items-center gap-3">







        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">



          <Truck



            size={18}



            className="text-slate-500"



          />



        </div>







        <div className="flex-1 min-w-0">







          <div className="flex items-center gap-2">







            <p className="text-xs font-semibold text-slate-900">



              {vehicle.id}



            </p>







            <span



              className={`text-[8px] px-2 py-1 rounded-full border ${getStatusClass(



                vehicle.status



              )}`}



            >



              {vehicle.status}



            </span>







          </div>







          <div className="flex gap-3 mt-1">







            <span className="text-[10px] text-slate-500">



              {vehicle.speed} km/h



            </span>







            <span className="text-[10px] text-slate-400 truncate">



              {vehicle.location}



            </span>







          </div>







        </div>







        <div className="text-right">







          <p className="text-[8px] text-slate-400">



            RISK



          </p>







          <p



            className={`text-xs font-bold ${getRiskClass(



              vehicle.risk



            )}`}



          >



            {vehicle.risk}



          </p>







        </div>







      </div>







    </button>



  );



}











// =========================================================



// VEHICLE DETAILS



// =========================================================







function VehicleDetails({



  vehicle,



  onLocate,



  onDispatch,



  onSafetyReport,



  onMarkIdle,



  dispatching,



}) {
  const { t } = useTranslation();



  if (!vehicle) {



    return (



      <div className="bg-white border border-slate-200 rounded-2xl p-8 flex items-center justify-center">



        <p className="text-sm text-slate-400">



          No vehicle {t("vehicles.available")}



        </p>



      </div>



    );



  }







  const risk =



    vehicle.risk || "LOW";







  const riskScore =



    getRiskScore(risk);







  return (



    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">







      <div className="p-5 border-b border-slate-200">







        <div className="flex items-center justify-between">







          <div className="flex items-center gap-3">







            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">



              <Truck



                size={21}



                className="text-emerald-600"



              />



            </div>







            <div>



              <p className="text-[9px] uppercase text-slate-400">



                Selected Vehicle



              </p>







              <h2 className="text-lg font-bold text-slate-900">



                {vehicle.id}



              </h2>



            </div>







          </div>







          <span



            className={`text-[8px] px-2.5 py-1 rounded-full border ${getStatusClass(



              vehicle.status



            )}`}



          >



            {vehicle.status}



          </span>







        </div>







      </div>











      <div className="p-5">







        <div className="flex items-center justify-between">







          <div>



            <p className="text-[9px] uppercase text-slate-400">



              Vehicle Risk



            </p>







            <p className="text-3xl font-bold text-slate-900">



              {riskScore}



              <span className="text-sm text-slate-400">



                /100



              </span>



            </p>



          </div>







          <span



            className={`text-[9px] px-2.5 py-1 rounded-full border ${getRiskClass(



              risk



            )}`}



          >



            {risk} RISK



          </span>







        </div>











        <div className="h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">



          <div



            className={`h-full ${getRiskBarClass(



              risk



            )}`}



            style={{



              width: `${riskScore}%`,



            }}



          />



        </div>











        <div className="grid grid-cols-2 gap-3 mt-5">







          <Telemetry



            icon={Zap}



            label="Speed"



            value={`${vehicle.speed} km/h`}



          />







          <Telemetry



            icon={Navigation}



            label="Heading"



            value={vehicle.heading}



          />







          <Telemetry



            icon={Battery}



            label="Battery"



            value={`${vehicle.battery}%`}



          />







          <Telemetry



            icon={Signal}



            label="GPS"



            value={vehicle.gps}



          />







        </div>











        <InfoCard



          icon={MapPin}



          label="Current Location"



          value={vehicle.location}



          iconClass="text-emerald-600"



        />







        <InfoCard



          icon={User}



          label="Assigned Driver"



          value={vehicle.driver}



          iconClass="text-blue-600"



        />







        <InfoCard



          icon={Navigation}



          label="Current Assignment"



          value={vehicle.assignment}



          subValue={`ETA ${vehicle.eta}`}



          iconClass="text-cyan-600"



        />











        <div className="grid grid-cols-2 gap-2 mt-5">







          <button



            onClick={onLocate}



            className="py-2.5 rounded-lg bg-emerald-600 text-white text-[9px] font-semibold flex items-center justify-center gap-2"



          >



            <MapPin size={12} />



            Locate Vehicle



          </button>







          <button



            onClick={onSafetyReport}



            className="py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[9px] font-medium flex items-center justify-center gap-2"



          >



            <ShieldCheck size={12} />



            Safety Report



          </button>







        </div>











        <button



          onClick={onDispatch}



          disabled={



            dispatching ||



            vehicle.status === "OFFLINE"



          }



          className="w-full mt-2 py-2.5 rounded-lg bg-blue-600 text-white text-[9px] font-semibold flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400"



        >



          <Navigation size={12} />







          {dispatching



            ? "Dispatching..."



            : "Dispatch Vehicle"}



        </button>











        {vehicle.status === "LIVE" && (



          <button



            onClick={onMarkIdle}



            className="w-full mt-2 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[9px]"



          >



            Mark Vehicle Idle



          </button>



        )}







      </div>







    </div>



  );



}











// =========================================================



// TELEMETRY



// =========================================================







function Telemetry({



  icon: Icon,



  label,



  value,



}) {



  return (



    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">







      <div className="flex items-center gap-1.5">



        <Icon



          size={11}



          className="text-slate-400"



        />







        <span className="text-[8px] uppercase text-slate-400">



          {label}



        </span>



      </div>







      <p className="text-xs font-semibold text-slate-800 mt-1.5">



        {value}



      </p>







    </div>



  );



}











// =========================================================



// INFO CARD



// =========================================================







function InfoCard({



  icon: Icon,



  label,



  value,



  subValue,



  iconClass,



}) {



  return (



    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">







      <div className="flex items-center gap-2">







        <Icon



          size={13}



          className={iconClass}



        />







        <span className="text-[9px] uppercase text-slate-400">



          {label}



        </span>







      </div>







      <p className="text-xs font-medium text-slate-800 mt-2">



        {value}



      </p>







      {subValue && (



        <div className="flex items-center gap-2 mt-1">



          <Clock3



            size={10}



            className="text-slate-400"



          />







          <span className="text-[9px] text-slate-500">



            {subValue}



          </span>



        </div>



      )}







    </div>



  );



}











// =========================================================



// FLEET HEALTH



// =========================================================







function FleetHealth({



  icon: Icon,



  title,



  value,



  description,



}) {



  return (



    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">







      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">







        <Icon



          size={17}



          className="text-emerald-600"



        />







      </div>







      <div>







        <p className="text-[9px] uppercase text-slate-400">



          {title}



        </p>







        <p className="text-lg font-bold text-slate-900">



          {value}



        </p>







        <p className="text-[8px] text-slate-500 mt-1">



          {description}



        </p>







      </div>







    </div>



  );



}











// =========================================================



// SAFETY MODAL



// =========================================================







function SafetyReportModal({



  vehicle,



  onClose,



}) {



  const risk =



    vehicle.risk || "LOW";







  const riskScore =



    getRiskScore(risk);







  const safetyScore =



    100 - riskScore;







  return (



    <div className="fixed inset-0 z-[7000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-5">







      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">







        <div className="flex items-center justify-between p-5 border-b">







          <div className="flex items-center gap-3">







            <ShieldCheck



              size={20}



              className="text-emerald-600"



            />







            <div>



              <p className="text-[8px] uppercase text-slate-400">



                Vehicle Safety Report



              </p>







              <h3 className="text-sm font-semibold">



                {vehicle.id}



              </h3>



            </div>







          </div>







          <button onClick={onClose}>



            <X size={16} />



          </button>







        </div>











        <div className="p-5">







          <div className="grid grid-cols-2 gap-3">







            <ReportMetric



              label="Safety Score"



              value={`${safetyScore}/100`}



              color="text-emerald-600"



            />







            <ReportMetric



              label="Risk Score"



              value={`${riskScore}/100`}



              color={



                risk === "HIGH"



                  ? "text-red-600"



                  : "text-amber-600"



              }



            />







            <ReportMetric



              label="Battery"



              value={`${vehicle.battery}%`}



              color="text-blue-600"



            />







            <ReportMetric



              label="GPS"



              value={vehicle.gps}



              color="text-purple-600"



            />







          </div>











          <div className="mt-4 space-y-2">







            <ReportCheck



              label="Vehicle telemetry"



              status={



                vehicle.gps !==



                "Disconnected"



              }



            />







            <ReportCheck



              label="Battery level"



              status={



                Number(



                  vehicle.battery



                ) > 30



              }



            />







            <ReportCheck



              label="Operational status"



              status={



                vehicle.status !==



                "OFFLINE"



              }



            />







            <ReportCheck



              label="Route safety"



              status={



                risk !== "HIGH"



              }



            />







          </div>











          <button



            onClick={onClose}



            className="w-full mt-4 py-2.5 rounded-xl bg-emerald-600 text-white text-[9px] font-semibold"



          >



            Close Report



          </button>







        </div>







      </div>







    </div>



  );



}











// =========================================================



// REPORT METRIC



// =========================================================







function ReportMetric({



  label,



  value,



  color,



}) {



  return (



    <div className="p-4 rounded-xl bg-slate-50 border">







      <p className="text-[8px] uppercase text-slate-400">



        {label}



      </p>







      <p



        className={`text-lg font-bold mt-1 ${color}`}



      >



        {value}



      </p>







    </div>



  );



}











// =========================================================



// REPORT CHECK



// =========================================================







function ReportCheck({



  label,



  status,



}) {



  return (



    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border">







      <span className="text-[9px] text-slate-600">



        {label}



      </span>







      {status ? (



        <span className="flex items-center gap-1 text-emerald-600 text-[8px]">



          <CheckCircle2 size={12} />



          PASS



        </span>



      ) : (



        <span className="flex items-center gap-1 text-red-600 text-[8px]">



          <AlertTriangle size={12} />



          CHECK



        </span>



      )}







    </div>



  );



}











export default Vehicles;




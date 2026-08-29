





import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";












import {



  Activity,



  AlertTriangle,



  ArrowRight,



  CheckCircle2,



  Clock3,



  Fuel,



  Gauge,



  MapPin,



  Navigation2,



  Route as RouteIcon,



  Search,



  ShieldAlert,



  ShieldCheck,



  Truck,



  Zap,



} from "lucide-react";











import { findBestRoute } from "../services/routeOptimizer";







import { getRoutes } from "../services/api";







import RoutePlanner from "../components/routes/RoutePlanner";







/* =========================================================



   ROUTE DATA



========================================================= */







const mockFallbackRoutes = [];











/* =========================================================



   CONVERT DASHBOARD DATA → OPTIMIZER DATA



========================================================= */







function prepareRoutes(routes) {



  return routes.map((route) => ({



    ...route,







    /*



      Optimizer expects duration in numbers.



      Convert ETA approximately into minutes.



    */



    duration: parseDuration(route.eta),







    /*



      Optimizer expects nested risk object.



    */



    risk: {



      riskScore: route.riskScore,



    },



  }));



}











/* =========================================================



   ETA → MINUTES



========================================================= */







function parseDuration(value) {



  if (!value) return 0;







  const text = String(value).toLowerCase();







  const hoursMatch =



    text.match(/(\d+)\s*h/);







  const minutesMatch =



    text.match(/(\d+)\s*m/);







  const hours =



    hoursMatch



      ? Number(hoursMatch[1])



      : 0;







  const minutes =



    minutesMatch



      ? Number(minutesMatch[1])



      : 0;







  return (



    hours * 60 +



    minutes



  );



}











/* =========================================================



   MAIN COMPONENT



========================================================= */







function RoutesPage() {
  const { t } = useTranslation();







  const [routeData, setRouteData] = useState([]);



  const [loading, setLoading] = useState(true);







  useEffect(() => {



    let mounted = true;



    setLoading(true);



    getRoutes()



      .then((data) => {



        if (!mounted) return;



        const formatted = data.map((route) => ({



          ...route,



          id: String(route.id),



          eta: `${Math.floor(route.estimated_duration_mins / 60)}h ${Math.floor(route.estimated_duration_mins % 60)}m`,



          distance: route.distance_km,



          risk: route.risk_level,



          riskScore: route.risk_score,



          status: "RECOMMENDED",



          cost: Math.round(route.distance_km * 15),



          traffic: "Light",



          weather: "Stable",



          roadCondition: "Good",



          confidence: 90



        }));



        setRouteData(formatted);



        if (formatted.length > 0) {



          setSelectedRoute(formatted[0]);



        }



      })



      .catch(console.error)



      .finally(() => {



        if (mounted) setLoading(false);



      });



    return () => { mounted = false; };



  }, []);







  const [selectedRoute, setSelectedRoute] =



    useState(null);







  const [search, setSearch] =



    useState("");







  const [optimizationMode, setOptimizationMode] =



    useState("BALANCED");







  const [optimized, setOptimized] =



    useState(null);







  const [assignedRoute, setAssignedRoute] =



    useState(null);







  const [showAnalysis, setShowAnalysis] =



    useState(false);











  /* =======================================================



     FILTER



  ======================================================== */







  const filteredRoutes = useMemo(() => {







    const text =



      search.toLowerCase().trim();







    if (!text) {



      return routeData;



    }







    return routeData.filter((route) => {







      return (



        route.id



          .toLowerCase()



          .includes(text) ||







        route.name



          .toLowerCase()



          .includes(text) ||







        route.origin



          .toLowerCase()



          .includes(text) ||







        route.destination



          .toLowerCase()



          .includes(text)



      );







    });







  }, [search, routeData]);











  /* =======================================================



     OPTIMIZE ROUTES



  ======================================================== */







  const handleOptimize = () => {







    let candidates =



      prepareRoutes(



        filteredRoutes.length



          ? filteredRoutes



          : routeData



      );











    /* =====================================================



       MODE-SPECIFIC PRE-SORTING



    ===================================================== */







    if (



      optimizationMode ===



      "FASTEST"



    ) {







      candidates.sort(



        (a, b) =>



          a.duration -



          b.duration



      );







    }







    else if (



      optimizationMode ===



      "SAFEST"



    ) {







      candidates.sort(



        (a, b) =>



          a.riskScore -



          b.riskScore



      );







    }







    else if (



      optimizationMode ===



      "LOWEST COST"



    ) {







      candidates.sort(



        (a, b) =>



          a.cost -



          b.cost



      );







    }











    /* =====================================================



       BALANCED / DEFAULT OPTIMIZER



    ===================================================== */







    const result =



      findBestRoute(



        candidates



      );











    let best =



      result.bestRoute;











    /* =====================================================



       MODE-SPECIFIC BEST ROUTE



    ===================================================== */







    if (



      optimizationMode ===



      "FASTEST"



    ) {







      best =



        [...candidates].sort(



          (a, b) =>



            a.duration -



            b.duration



        )[0];







    }







    else if (



      optimizationMode ===



      "SAFEST"



    ) {







      best =



        [...candidates].sort(



          (a, b) =>



            a.riskScore -



            b.riskScore



        )[0];







    }







    else if (



      optimizationMode ===



      "LOWEST COST"



    ) {







      best =



        [...candidates].sort(



          (a, b) =>



            a.cost -



            b.cost



        )[0];







    }











    /* =====================================================



       MAP BACK TO ORIGINAL ROUTE DATA



    ===================================================== */







    const originalBest =



      routeData.find(



        (route) =>



          route.id ===



          best?.id



      ) || routeData[0];











    setSelectedRoute(



      originalBest



    );











    setOptimized({



      ...result,



      bestRoute:



        originalBest,



    });











    setShowAnalysis(



      false



    );







  };











  /* =======================================================



     ASSIGN ROUTE



  ======================================================== */







  const handleAssignRoute = (



    route



  ) => {







    if (!route) {



      return;



    }











    const assigned = {



      ...route,







      assignedAt:



        new Date().toISOString(),







      assignmentStatus:



        "ASSIGNED",







      optimizationMode,



    };











    setAssignedRoute(



      assigned



    );







    setSelectedRoute(



      route



    );











    localStorage.setItem(



      "assignedRoute",



      JSON.stringify(



        assigned



      )



    );







  };











  /* =======================================================



     SELECT ROUTE



  ======================================================== */







  const handleSelectRoute = (



    route



  ) => {







    setSelectedRoute(



      route



    );







    setShowAnalysis(



      false



    );







  };











  return (







    <div className="min-h-full bg-slate-50 text-slate-900 p-6 space-y-5">











      {/* =====================================================



          HEADER



      ====================================================== */}







      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">







        <div>







          <div className="flex items-center gap-2">







            <span className="relative flex h-2 w-2">







              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />







              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />







            </span>







            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-600">



              AI Optimization Engine • Online



            </span>







          </div>











          <h1 className="text-3xl font-bold text-slate-900 mt-2">



            {t("routes.routeOptimization")}



          </h1>











          <p className="text-sm text-slate-400 mt-1">



            AI-assisted route selection using distance, risk,



            weather and road conditions



          </p>







        </div>











        <div className="flex items-center gap-2">







          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">







            <Activity



              size={14}



              className="text-emerald-600"



            />







            <span className="text-xs text-emerald-600">



              Optimization Ready



            </span>







          </div>











          <button



            type="button"



            onClick={



              handleOptimize



            }



            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-[10px] font-semibold hover:bg-emerald-400 transition"



          >







            <Zap size={13} />







            Optimize Routes







          </button>







        </div>







      </div>











      {/* =====================================================



          ASSIGNED ROUTE STATUS



      ====================================================== */}







      {assignedRoute && (







        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">







          <div className="flex items-center gap-3">







            <CheckCircle2



              size={18}



              className="text-emerald-600"



            />







            <div>







              <p className="text-[8px] uppercase tracking-widest text-emerald-600">



                Route Assigned Successfully



              </p>







              <p className="text-sm font-semibold text-slate-900 mt-1">



                {assignedRoute.name}



              </p>







            </div>







          </div>







        </div>







      )}











      {/* =====================================================



          KPI



      ====================================================== */}







      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">







        <RouteKpi



          icon={RouteIcon}



          label="Routes Evaluated"



          value="42"



          description="Today"



          color="text-cyan-600"



        />







        <RouteKpi



          icon={ShieldCheck}



          label="Safe Routes"



          value="31"



          description="Low risk"



          color="text-emerald-600"



        />







        <RouteKpi



          icon={ShieldAlert}



          label="High Risk"



          value="07"



          description="Needs review"



          color="text-red-600"



        />







        <RouteKpi



          icon={Clock3}



          label="Avg ETA"



          value="4h 18m"



          description="-12 min"



          color="text-blue-600"



        />







        <RouteKpi



          icon={Fuel}



          label="Cost Saving"



          value="14.8%"



          description="vs baseline"



          color="text-purple-600"



        />







      </div>











      {/* =====================================================



          OPTIMIZATION CONTROL



      ====================================================== */}







      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">







        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">







          <div>







            <p className="text-[9px] uppercase tracking-widest text-slate-600">



              Optimization Objective



            </p>







            <p className="text-sm text-slate-900 font-semibold mt-1">



              {t("routes.selectPriority")}



            </p>







          </div>











          <div className="flex flex-wrap gap-2">







            {[



              "FASTEST",



              "SAFEST",



              "LOWEST COST",



              "BALANCED",



            ].map((mode) => (







              <button



                key={mode}



                type="button"



                onClick={() =>



                  setOptimizationMode(



                    mode



                  )



                }



                className={`px-4 py-2 rounded-lg text-[9px] border transition ${



                  optimizationMode === mode



                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"



                    : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"



                }`}



              >



                {mode}



              </button>







            ))}







          </div>







        </div>







      </div>











      {/* =====================================================



          MAIN GRID



      ====================================================== */}







      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)_400px] gap-5 items-start">







        {/* ===================================================



            PLANNER



        ==================================================== */}



        



        <RoutePlanner 



          onRouteFound={(r) => {



            const newRoute = {



              ...r,



              id: `CUSTOM-${Date.now()}`,



              name: "Custom Navigation Route",



              origin: "User Start",



              destination: "User Destination",



              eta: r.durationText,



              distance: r.distance / 1000,



              risk: r.risk > 70 ? "HIGH" : r.risk > 40 ? "MEDIUM" : "LOW",



              riskScore: r.risk,



              status: "RECOMMENDED",



              cost: Math.round((r.distance / 1000) * 15),



              traffic: "Light",



              weather: r.weather?.condition || "Stable",



              roadCondition: "Unknown",



              confidence: 85



            };



            setRouteData((prev) => [newRoute, ...prev]);



            setSelectedRoute(newRoute);



            setSearch("");



          }}



        />







        {/* ===================================================



            ROUTE LIST



        ==================================================== */}







        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">







          <div className="p-5 border-b border-slate-200">







            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">







              <div>







                <h2 className="text-sm font-semibold text-slate-900">



                  {t("routes.candidateRoutes")}



                </h2>







                <p className="text-[9px] text-slate-600 mt-1">



                  AI-ranked alternatives for current logistics request



                </p>







              </div>











              <div className="relative">







                <Search



                  size={13}



                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"



                />







                <input



                  value={search}



                  onChange={(e) =>



                    setSearch(



                      e.target.value



                    )



                  }



                  placeholder="Search route..."



                  className="w-full md:w-56 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pl-8 text-[10px] text-slate-800 outline-none focus:border-emerald-500"



                />







              </div>







            </div>







          </div>











          <div className="p-4 space-y-3">







            {filteredRoutes.length > 0 ? (







              filteredRoutes.map(



                (route) => (







                  <RouteCard



                    key={route.id}



                    route={route}



                    selected={



                      selectedRoute?.id ===



                      route.id



                    }



                    onClick={() =>



                      handleSelectRoute(



                        route



                      )



                    }



                  />







                )



              )







            ) : (







              <div className="py-10 text-center">







                <Search



                  size={22}



                  className="mx-auto text-slate-700"



                />







                <p className="text-xs text-slate-400 mt-3">



                  No routes found



                </p>







              </div>







            )}







          </div>







        </div>











        {/* ===================================================



            ROUTE INTELLIGENCE



        ==================================================== */}







        <RouteDetails



          route={



            selectedRoute



          }



          optimizationMode={



            optimizationMode



          }



          onAssign={



            handleAssignRoute



          }



          onAnalysis={() =>



            setShowAnalysis(



              (value) => !value



            )



          }



          showAnalysis={



            showAnalysis



          }



        />







      </div>











      {/* =====================================================



          OPTIMIZATION RESULT



      ====================================================== */}







      {optimized?.bestRoute && (







        <div className="bg-white border border-emerald-200 rounded-2xl p-5">







          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">







            <div>







              <p className="text-[9px] uppercase tracking-widest text-emerald-600">



                Optimization Result



              </p>







              <h3 className="text-lg font-bold text-slate-900 mt-1">



                {optimized.bestRoute.name}



              </h3>







              <p className="text-xs text-slate-400 mt-1">



                Best route according to{" "}



                {optimizationMode.toLowerCase()} optimization.



              </p>







            </div>











            <div className="flex items-center gap-3">







              <div className="text-right">







                <p className="text-[8px] uppercase text-slate-600">



                  Optimization Score



                </p>







                <p className="text-2xl font-bold text-emerald-600">



                  {optimized.bestRoute.optimizationScore ??



                    optimized.bestScore ??



                    "—"}



                </p>







              </div>











              <button



                type="button"



                onClick={() =>



                  handleAssignRoute(



                    optimized.bestRoute



                  )



                }



                className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold transition flex items-center gap-2"



              >







                <CheckCircle2



                  size={14}



                />







                Assign Best







              </button>







            </div>







          </div>







        </div>







      )}











      {/* =====================================================



          DECISION EXPLANATION



      ====================================================== */}







      {selectedRoute && (



        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">







          <div className="flex items-start gap-4">







            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">







              <ShieldCheck



                size={18}



                className="text-emerald-600"



              />







            </div>











            <div className="flex-1">







              <p className="text-[9px] uppercase tracking-widest text-emerald-600">



                AI Decision Explanation



              </p>











              <h3 className="text-sm font-semibold text-slate-900 mt-1">



                Route {selectedRoute.id} is currently the preferred option



              </h3>











              <p className="text-xs text-slate-400 mt-2 leading-6">







                The optimization engine selected this route because it



                provides a favorable balance between travel time,



                road safety, weather conditions and estimated operating cost.







              </p>











              <div className="flex flex-wrap gap-2 mt-4">







                <ReasonTag



                  label={



                    selectedRoute.risk === "LOW"



                      ? "Low Risk"



                      : selectedRoute.risk === "MEDIUM"



                      ? "Moderate Risk"



                      : "High Risk"



                  }



                  positive={



                    selectedRoute.risk ===



                    "LOW"



                  }



                />







                <ReasonTag



                  label={



                    selectedRoute.roadCondition



                  }



                  positive={



                    selectedRoute.roadCondition ===



                    "Good"



                  }



                />







                <ReasonTag



                  label={



                    selectedRoute.weather



                  }



                  positive={



                    selectedRoute.weather ===



                    "Stable"



                  }



                />







                <ReasonTag



                  label={



                    selectedRoute.traffic



                  }



                  positive={



                    selectedRoute.traffic ===



                    "Light"



                  }



                />







              </div>







            </div>







          </div>







        </div>



      )}







    </div>



  );



}











/* =========================================================



   KPI



========================================================= */







function RouteKpi({



  icon: Icon,



  label,



  value,



  description,



  color,



}) {







  return (







    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 hover:border-slate-300 transition">







      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">







        <Icon



          size={16}



          className={color}



        />







      </div>











      <p className="text-[9px] uppercase tracking-wider text-slate-600 mt-4">



        {label}



      </p>











      <p className="text-xl font-bold text-slate-900 mt-1">



        {value}



      </p>











      <p className="text-[8px] text-slate-700 mt-1">



        {description}



      </p>







    </div>







  );



}











/* =========================================================



   ROUTE CARD



========================================================= */







function RouteCard({



  route,



  selected,



  onClick,



}) {







  const riskColor = {







    LOW: "text-emerald-600",







    MEDIUM: "text-yellow-600",







    HIGH: "text-red-600",







  }[typeof (typeof route.risk === 'object' ? route.risk.riskLevel : route.risk) === 'object' ? route.risk.riskLevel : route.risk];











  const statusColor = {







    RECOMMENDED:



      "text-emerald-600 bg-emerald-50 border-emerald-200",







    ALTERNATIVE:



      "text-blue-600 bg-blue-50 border-blue-200",







    RISKY:



      "text-red-600 bg-red-50 border-red-200",







  }[route.status];











  return (







    <button



      type="button"



      onClick={onClick}



      className={`w-full text-left rounded-xl border p-4 transition ${



        selected



          ? "border-emerald-200 bg-emerald-50"



          : "border-slate-200 bg-slate-50 hover:border-slate-300"



      }`}



    >







      <div className="flex items-start gap-4">







        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0">







          <RouteIcon



            size={18}



            className={



              selected



                ? "text-emerald-600"



                : "text-slate-400"



            }



          />







        </div>











        <div className="flex-1 min-w-0">







          <div className="flex flex-wrap items-center gap-2">







            <span className="text-xs font-semibold text-slate-900">



              {route.id}



            </span>











            <span



              className={`text-[7px] px-1.5 py-0.5 rounded border ${statusColor}`}



            >



              {route.status}



            </span>







          </div>











          <div className="flex items-center gap-2 mt-2">







            <span className="text-[10px] text-slate-400">



              {route.origin}



            </span>







            <ArrowRight



              size={10}



              className="text-slate-700"



            />







            <span className="text-[10px] text-slate-600">



              {route.destination}



            </span>







          </div>











          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">







            <MiniMetric



              label="Distance"



              value={`${route.distance} km`}



            />







            <MiniMetric



              label="ETA"



              value={route.eta}



            />







            <MiniMetric



              label="Risk"



              value={typeof (typeof route.risk === 'object' ? route.risk.riskLevel : route.risk) === 'object' ? route.risk.riskLevel : route.risk}



              valueClass={riskColor}



            />







            <MiniMetric



              label="AI Confidence"



              value={`${route.confidence}%`}



            />







          </div>











          <div className="mt-4">







            <div className="flex justify-between">







              <span className="text-[7px] text-slate-700 uppercase">



                Optimization Score



              </span>







              <span className="text-[8px] text-slate-400">



                {100 - route.riskScore}/100



              </span>







            </div>











            <div className="h-1.5 bg-slate-50 rounded-full mt-1.5 overflow-hidden">







              <div



                className={`h-full rounded-full ${



                  (typeof route.risk === 'object' ? route.risk.riskLevel : route.risk) === "LOW"



                    ? "bg-emerald-400"



                    : (typeof route.risk === 'object' ? route.risk.riskLevel : route.risk) === "MEDIUM"



                    ? "bg-yellow-400"



                    : "bg-red-400"



                }`}



                style={{



                  width:



                    `${100 - route.riskScore}%`,



                }}



              />







            </div>







          </div>







        </div>







      </div>







    </button>







  );



}











/* =========================================================



   ROUTE DETAILS



========================================================= */







function RouteDetails({



  route,



  optimizationMode,



  onAssign,



  onAnalysis,



  showAnalysis,



}) {







  if (!route) {



    return null;



  }











  const riskWidth =



    route.riskScore;











  if (!route) {



    return (



      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex items-center justify-center min-h-[400px]">



        <p className="text-slate-400 text-sm">Select a route to view details</p>



      </div>



    );



  }







  return (







    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">







      <div className="p-5 border-b border-slate-200">







        <div className="flex items-start justify-between">







          <div>







            <p className="text-[9px] uppercase tracking-widest text-slate-600">



              Selected Route



            </p>







            <h2 className="text-lg font-bold text-slate-900 mt-1">



              {route.id}



            </h2>







          </div>











          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">







            <RouteIcon



              size={18}



              className="text-emerald-600"



            />







          </div>







        </div>











        <div className="flex items-center gap-2 mt-4">







          <MapPin



            size={12}



            className="text-emerald-600"



          />







          <span className="text-xs text-slate-400">



            {route.origin}



          </span>







          <ArrowRight



            size={11}



            className="text-slate-700"



          />







          <Navigation2



            size={12}



            className="text-red-600"



          />







          <span className="text-xs text-slate-600">



            {route.destination}



          </span>







        </div>







      </div>











      <div className="p-5">







        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">







          <div className="flex items-center justify-between">







            <div className="flex items-center gap-2">







              <CheckCircle2



                size={15}



                className="text-emerald-600"



              />







              <span className="text-[9px] uppercase tracking-wider text-emerald-600">



                AI Recommendation



              </span>







            </div>











            <span className="text-[8px] text-emerald-600">



              {route.confidence}% confidence



            </span>







          </div>











          <p className="text-sm font-semibold text-slate-900 mt-2">



            {route.status === "RECOMMENDED"



              ? "Best route for current conditions"



              : "Alternative route available"}



          </p>







          <p className="text-[8px] text-slate-600 mt-2">



            Current mode:{" "}



            {optimizationMode}



          </p>







        </div>











        <div className="mt-5">







          <div className="flex items-center justify-between">







            <div className="flex items-center gap-2">







              <ShieldAlert



                size={14}



                className={



                  (typeof route.risk === 'object' ? route.risk.riskLevel : route.risk) === "HIGH"



                    ? "text-red-600"



                    : (typeof route.risk === 'object' ? route.risk.riskLevel : route.risk) === "MEDIUM"



                    ? "text-yellow-600"



                    : "text-emerald-600"



                }



              />







              <span className="text-xs text-slate-700">



                Route Risk Score



              </span>







            </div>











            <span className="text-sm font-bold text-slate-900">







              {route.riskScore}







              <span className="text-[9px] text-slate-600">



                /100



              </span>







            </span>







          </div>











          <div className="h-2 bg-slate-50 rounded-full mt-3 overflow-hidden">







            <div



              className={`h-full rounded-full ${



                (typeof route.risk === 'object' ? route.risk.riskLevel : route.risk) === "HIGH"



                  ? "bg-red-400"



                  : (typeof route.risk === 'object' ? route.risk.riskLevel : route.risk) === "MEDIUM"



                  ? "bg-yellow-400"



                  : "bg-emerald-400"



              }`}



              style={{



                width:



                  `${riskWidth}%`,



              }}



            />







          </div>







        </div>











        <div className="mt-5">







          <p className="text-[9px] uppercase tracking-widest text-slate-600">



            Route Conditions



          </p>











          <div className="grid grid-cols-2 gap-2 mt-3">







            <Condition



              icon={Activity}



              label="Traffic"



              value={route.traffic}



            />







            <Condition



              icon={Zap}



              label="Weather"



              value={route.weather}



            />







            <Condition



              icon={ShieldCheck}



              label="Road"



              value={route.roadCondition}



            />







            <Condition



              icon={Gauge}



              label="Confidence"



              value={`${route.confidence}%`}



            />







          </div>







        </div>











        <div className="grid grid-cols-2 gap-2 mt-3">







          <DetailBox



            label="Estimated Cost"



            value={`₹${route.cost.toLocaleString()}`}



            icon={Fuel}



          />







          <DetailBox



            label="Travel Time"



            value={route.eta}



            icon={Clock3}



          />







        </div>











        {/* =================================================



            MAP PREVIEW



        ================================================= */}







        <div className="relative h-44 mt-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">







          <div



            className="absolute inset-0 opacity-40"



            style={{



              backgroundImage:



                "linear-gradient(rgba(71,85,105,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(71,85,105,.2) 1px, transparent 1px)",



              backgroundSize:



                "28px 28px",



            }}



          />











          <div className="absolute left-[12%] top-[65%] w-[76%] h-1 bg-slate-700 rotate-[-17deg]" />







          <div className="absolute left-[15%] top-[58%] w-[70%] h-1 bg-emerald-400 rotate-[-17deg] shadow-[0_0_14px_rgba(16,185,129,.7)]" />











          <div className="absolute left-[10%] top-[70%]">







            <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-400 flex items-center justify-center">







              <MapPin



                size={12}



                className="text-emerald-600"



              />







            </div>







          </div>











          <div className="absolute right-[10%] top-[25%]">







            <div className="w-7 h-7 rounded-full bg-red-100 border border-red-400 flex items-center justify-center">







              <Navigation2



                size={12}



                className="text-red-600"



              />







            </div>







          </div>











          <div className="absolute left-[48%] top-[48%]">







            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">







              <Truck



                size={13}



                className="text-cyan-600"



              />







            </div>







          </div>











          <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-slate-50/90 border border-slate-200">







            <span className="text-[8px] text-emerald-600">



              LIVE ROUTE PREVIEW



            </span>







          </div>







        </div>











        {/* =================================================



            ASSIGN



        ================================================= */}







        <button



          type="button"



          onClick={() =>



            onAssign(route)



          }



          className="w-full mt-4 py-3 rounded-xl bg-emerald-500 text-slate-950 text-[10px] font-bold hover:bg-emerald-400 transition flex items-center justify-center gap-2"



        >







          <CheckCircle2 size={14} />







          Assign Recommended Route







        </button>











        {/* =================================================



            ANALYSIS



        ================================================= */}







        <button



          type="button"



          onClick={onAnalysis}



          className="w-full mt-2 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-[9px] hover:text-slate-900 transition"



        >







          {showAnalysis



            ? "Hide Full Route Analysis"



            : "View Full Route Analysis"}







        </button>











        {showAnalysis && (







          <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200">







            <p className="text-[9px] uppercase tracking-widest text-emerald-600">



              Full Route Analysis



            </p>







            <div className="grid grid-cols-2 gap-3 mt-4">







              <AnalysisItem



                label="Distance"



                value={`${route.distance} km`}



              />







              <AnalysisItem



                label="ETA"



                value={route.eta}



              />







              <AnalysisItem



                label="Risk"



                value={typeof (typeof route.risk === 'object' ? route.risk.riskLevel : route.risk) === 'object' ? route.risk.riskLevel : route.risk}



              />







              <AnalysisItem



                label="Risk Score"



                value={`${route.riskScore}/100`}



              />







              <AnalysisItem



                label="Traffic"



                value={route.traffic}



              />







              <AnalysisItem



                label="Weather"



                value={route.weather}



              />







              <AnalysisItem



                label="Road"



                value={route.roadCondition}



              />







              <AnalysisItem



                label="AI Confidence"



                value={`${route.confidence}%`}



              />







            </div>







          </div>







        )}







      </div>







    </div>



  );



}











/* =========================================================



   MINI METRIC



========================================================= */







function MiniMetric({



  label,



  value,



  valueClass = "text-white",



}) {







  return (







    <div>







      <p className="text-[7px] uppercase text-slate-700">



        {label}



      </p>







      <p className={`text-[10px] font-semibold mt-1 ${valueClass}`}>



        {value}



      </p>







    </div>







  );



}











/* =========================================================



   CONDITION



========================================================= */







function Condition({



  icon: Icon,



  label,



  value,



}) {







  return (







    <div className="bg-slate-50 rounded-lg p-3">







      <div className="flex items-center gap-2">







        <Icon



          size={12}



          className="text-slate-600"



        />







        <span className="text-[8px] uppercase text-slate-700">



          {label}



        </span>







      </div>











      <p className="text-xs text-slate-700 mt-2">



        {value}



      </p>







    </div>







  );



}











/* =========================================================



   DETAIL BOX



========================================================= */







function DetailBox({



  label,



  value,



  icon: Icon,



}) {







  return (







    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">







      <div className="flex items-center gap-2">







        <Icon



          size={12}



          className="text-slate-600"



        />







        <span className="text-[8px] uppercase text-slate-700">



          {label}



        </span>







      </div>











      <p className="text-sm font-bold text-slate-900 mt-2">



        {value}



      </p>







    </div>







  );



}











/* =========================================================



   ANALYSIS ITEM



========================================================= */







function AnalysisItem({



  label,



  value,



}) {







  return (







    <div className="bg-white rounded-lg p-3">







      <p className="text-[7px] uppercase text-slate-600">



        {label}



      </p>







      <p className="text-xs text-slate-900 font-semibold mt-1">



        {value}



      </p>







    </div>







  );



}











/* =========================================================



   REASON TAG



========================================================= */







function ReasonTag({



  label,



  positive,



}) {







  return (







    <span



      className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[8px] ${



        positive



          ? "bg-emerald-50 border-emerald-500/10 text-emerald-600"



          : "bg-red-50 border-red-500/10 text-red-600"



      }`}



    >







      {positive ? (



        <CheckCircle2 size={9} />



      ) : (



        <AlertTriangle size={9} />



      )}







      {label}







    </span>







  );



}











export default RoutesPage;








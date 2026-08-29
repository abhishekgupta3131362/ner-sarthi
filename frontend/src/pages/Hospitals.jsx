

import HospitalRouteModal from "../components/HospitalRouteModal";



import { useTranslation } from "react-i18next";
import { useMemo, useState, useEffect } from "react";







import {



  Activity,



  Ambulance,



  BedDouble,



  Building2,



  CheckCircle2,



  ChevronRight,



  Clock3,



  HeartPulse,



  MapPin,



  Package,



  Pill,



  Search,



  ShieldAlert,



  Stethoscope,



  Truck,



  Users,



  X,



  Zap,



  RefreshCw,



  Navigation,



  AlertTriangle,



} from "lucide-react";











/* =========================================================



   HOSPITAL DATA



========================================================= */



















/* =========================================================



   MAIN



========================================================= */







function Hospitals() {
  const { t } = useTranslation();







  



  const [hospitals, setHospitals] = useState([]);



  const [selectedHospitalId, setSelectedHospitalId] = useState(null);



  const [loading, setLoading] = useState(true);







  useEffect(() => {



    fetch("http://localhost:8000/api/hospitals/")



      .then(res => res.json())



      .then(data => {



        const adapted = data.map((h, i) => {



           const s = h.status || {};



           const bedPct = s.total_beds && s.available_beds != null ? Math.round(((s.total_beds - s.available_beds) / s.total_beds) * 100) : 0;



           const icuPct = s.total_icu && s.available_icu != null ? Math.round(((s.total_icu - s.available_icu) / s.total_icu) * 100) : 0;



           const load = s.data_status === "UNAVAILABLE" || s.data_status === "STATIC" ? 0 : Math.round((bedPct + icuPct) / 2);



           



           return {



             id: h.id,



             name: h.name,



             location: h.location,



             lat: h.lat,



             lng: h.lng,



             status: s.data_status === "UNAVAILABLE" ? "DATA UNAVAILABLE" : s.data_status === "STATIC" ? "NO LIVE DATA" : (load > 85 ? "HIGH LOAD" : "OPERATIONAL"),



             beds: bedPct,



             icu: icuPct,



             ambulances: s.ambulances || 0,



             doctors: 45, 



             emergency: h.facilities?.emergency ? 100 : 0,



             medicine: 80,



             response: "10 min",



             distance: "5 km",



             load: load,



             data_status: s.data_status,



             data_source: s.data_source,



             last_updated: s.last_updated,



             total_beds: s.total_beds,



             available_beds: s.available_beds,



             total_icu: s.total_icu,



             available_icu: s.available_icu,



             medicines: {



               antibiotics: 80,



               oxygen: 90,



               emergencyDrugs: 85,



               bloodUnits: 75,



             }



           };



        });



        setHospitals(adapted);



        if (adapted.length > 0) {



           setSelectedHospitalId(adapted[0].id);



        }



        setLoading(false);



      })



      .catch(err => {



        console.error(err);



        setLoading(false);



      });



  }, []);







  const [showDetails, setShowDetails] =



    useState(true);







  const [search, setSearch] =



    useState("");







  const [filter, setFilter] =



    useState("ALL");







  const [showStock, setShowStock] =



    useState(false);







  const [showDispatch, setShowDispatch] =



    useState(false);



  const [showRouteModal, setShowRouteModal] = useState(false);







  const [dispatching, setDispatching] =



    useState(false);







  const [refreshing, setRefreshing] =



    useState(false);







  const [toast, setToast] =



    useState(null);











  /* =========================================================



     SELECTED HOSPITAL



  ========================================================= */







  const selectedHospital =



    hospitals.find(



      (h) => h.id === selectedHospitalId



    );











  /* =========================================================



     TOAST



  ========================================================= */







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



    }, 2800);



  };











  /* =========================================================



     SEARCH + FILTER



  ========================================================= */







  const filteredHospitals =



    useMemo(() => {







      const query =



        search.trim().toLowerCase();







      return hospitals.filter(



        (hospital) => {







          const matchesSearch =



            hospital.name



              .toLowerCase()



              .includes(query) ||



            hospital.location



              .toLowerCase()



              .includes(query) ||



            hospital.id



              .toLowerCase()



              .includes(query);







          const matchesFilter =



            filter === "ALL" ||



            hospital.status === filter;







          return (



            matchesSearch &&



            matchesFilter



          );



        }



      );







    }, [



      hospitals,



      search,



      filter,



    ]);







  if (loading || !selectedHospital) {



    return (



      <div className="flex h-screen items-center justify-center bg-slate-50">



        <div className="animate-spin text-emerald-600 mb-4">



          <RefreshCw size={32} />



        </div>



      </div>



    );



  }











  /* =========================================================



     KPI CALCULATIONS



  ========================================================= */







  const totalAmbulances =



    hospitals.reduce(



      (sum, hospital) =>



        sum + hospital.ambulances,



      0



    );







  const averageBedLoad =



    Math.round(



      hospitals.reduce(



        (sum, hospital) =>



          sum + hospital.beds,



        0



      ) / hospitals.length



    );







  const averageICULoad =



    Math.round(



      hospitals.reduce(



        (sum, hospital) =>



          sum + hospital.icu,



        0



      ) / hospitals.length



    );







  const highLoadHospitals =



    hospitals.filter(



      (hospital) =>



        hospital.load >= 80



    ).length;











  const averageEmergency =



    Math.round(



      hospitals.reduce(



        (sum, hospital) =>



          sum + hospital.emergency,



        0



      ) / hospitals.length



    );











  const averageMedicine =



    Math.round(



      hospitals.reduce(



        (sum, hospital) =>



          sum + hospital.medicine,



        0



      ) / hospitals.length



    );











  /* =========================================================



     REFRESH



  ========================================================= */







  const refreshNetwork = () => {







    if (refreshing) return;







    setRefreshing(true);







    window.setTimeout(() => {







      setRefreshing(false);







      notify(



        "Hospital network intelligence refreshed."



      );







    }, 1000);



  };











  /* =========================================================



     SELECT HOSPITAL



  ========================================================= */







  const handleSelectHospital = (



    hospital



  ) => {







    setSelectedHospitalId(



      hospital.id



    );







    setShowDetails(true);







    notify(



      `${hospital.name} selected.`



    );



  };











  /* =========================================================



     DISPATCH AMBULANCE



  ========================================================= */







  const handleDispatch = () => {







    if (



      !selectedHospital ||



      selectedHospital.ambulances <= 0



    ) {







      notify(



        "No ambulance is currently available.",



        "error"



      );







      return;



    }







    setDispatching(true);







    window.setTimeout(() => {







      setHospitals(



        (previous) =>



          previous.map(



            (hospital) =>



              hospital.id ===



              selectedHospital.id



                ? {



                    ...hospital,



                    ambulances:



                      Math.max(



                        0,



                        hospital.ambulances - 1



                      ),



                    response:



                      hospital.response,



                  }



                : hospital



          )



      );







      setDispatching(false);







      setShowDispatch(false);







      notify(



        `Ambulance dispatched from ${selectedHospital.name}.`



      );







    }, 1200);



  };











  /* =========================================================



     OPEN MAP



  ========================================================= */







  const openHospitalMap = () => {







    if (!selectedHospital) return;







    const url =



      `https://www.google.com/maps/search/?api=1&query=${selectedHospital.lat},${selectedHospital.lng}`;







    window.open(



      url,



      "_blank",



      "noopener,noreferrer"



    );







    notify(



      "Hospital location opened in maps."



    );



  };











  /* =========================================================



     AI RECOMMENDATION



  ========================================================= */







  const recommendation =



    selectedHospital.load >= 90



      ? `Avoid assigning new emergency cases to ${selectedHospital.name} unless clinically necessary. Redirect suitable cases to lower-load facilities.`







      : selectedHospital.ambulances <= 2



      ? `${selectedHospital.name} has limited ambulance availability. Reserve remaining vehicles for high-priority incidents.`







      : selectedHospital.medicine <= 65



      ? `Medicine stock is becoming constrained at ${selectedHospital.name}. Consider transferring critical supplies from a better-stocked facility.`







      : selectedHospital.load >= 75



      ? `${selectedHospital.name} is operating under elevated emergency load. Continue monitoring capacity before assigning additional cases.`







      : `${selectedHospital.name} currently has acceptable emergency readiness and can receive additional emergency cases.`;











  return (







    <div className="p-6 min-h-full bg-slate-50 text-slate-900">











      {/* =====================================================



          TOAST



      ====================================================== */}







      {toast && (







        <div className="fixed right-5 bottom-5 z-[5000]">







          <div



            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl ${



              toast.type === "error"



                ? "bg-red-50 border-red-200"



                : "bg-white border-emerald-200"



            }`}



          >







            {toast.type === "error" ? (







              <AlertTriangle



                size={16}



                className="text-red-600"



              />







            ) : (







              <CheckCircle2



                size={16}



                className="text-emerald-600"



              />







            )}







            <span className="text-xs text-slate-600">



              {toast.message}



            </span>







          </div>







        </div>







      )}











      {/* =====================================================



          HEADER



      ====================================================== */}







      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">







        <div>







          <div className="flex items-center gap-2">







            <span className="relative flex w-2 h-2">







              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60" />







              <span className="relative w-2 h-2 rounded-full bg-red-400" />







            </span>







            <span className="text-[10px] uppercase tracking-[0.25em] text-red-600">



              {t("hospitals.emergencyNetwork")}



            </span>







          </div>











          <h1 className="text-3xl font-bold mt-2">



            {t("hospitals.title")}



          </h1>











          <p className="text-sm text-slate-400 mt-2">



            {t("hospitals.subtitle")}



          </p>







        </div>











        <div className="flex flex-wrap items-center gap-2">







          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">







            <span className="text-[8px] text-slate-600">



              EMERGENCY NETWORK



            </span>







            <span className="text-xs text-emerald-600 ml-2">



              {averageEmergency}%



            </span>







          </div>











          <button



            onClick={refreshNetwork}



            disabled={refreshing}



            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-slate-900 transition disabled:opacity-50"



          >







            <RefreshCw



              size={13}



              className={



                refreshing



                  ? "animate-spin text-cyan-600"



                  : ""



              }



            />







            <span className="text-[9px]">



              {refreshing



                ? "Refreshing..."



                : "Refresh"}



            </span>







          </button>











          <button



            onClick={() =>



              setShowDetails(



                !showDetails



              )



            }



            className="px-4 py-2.5 rounded-xl bg-red-500 text-white text-[9px] font-bold hover:bg-red-400 transition"



          >



            {showDetails



              ? "Close Panel"



              : "Emergency Insights"}



          </button>







        </div>







      </div>











      {/* =====================================================



          KPI



      ====================================================== */}







      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">







        <StatCard



          icon={Building2}



          title="Hospitals"



          value={String(



            hospitals.length



          ).padStart(2, "0")}



          text="Connected facilities"



          color="text-cyan-600"



        />







        <StatCard



          icon={BedDouble}



          title="Bed Load"



          value={`${averageBedLoad}%`}



          text="Network occupancy"



          color="text-purple-600"



        />







        <StatCard



          icon={HeartPulse}



          title="ICU Load"



          value={`${averageICULoad}%`}



          text="Critical capacity"



          color="text-red-600"



        />







        <StatCard



          icon={Ambulance}



          title="Ambulances"



          value={totalAmbulances}



          text="Available fleet"



          color="text-orange-600"



        />







        <StatCard



          icon={ShieldAlert}



          title="High Load"



          value={String(



            highLoadHospitals



          ).padStart(2, "0")}



          text="Facilities"



          color="text-yellow-600"



        />







      </div>











      {/* =====================================================



          EMERGENCY FLOW



      ====================================================== */}







      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">







        <FlowCard



          icon={Ambulance}



          title="Ambulance Response"



          value={



            selectedHospital.response



          }



          text="Selected facility response"



          percentage={



            Math.max(



              10,



              100 -



                selectedHospital.ambulances *



                  8



            )



          }



          color="bg-orange-400"



        />







        <FlowCard



          icon={BedDouble}



          title="Bed Availability"



          value={`${100 - averageBedLoad}%`}



          text="Remaining network capacity"



          percentage={



            100 - averageBedLoad



          }



          color="bg-emerald-400"



        />







        <FlowCard



          icon={Pill}



          title="Medicine Stock"



          value={`${averageMedicine}%`}



          text="Network critical supplies"



          percentage={



            averageMedicine



          }



          color="bg-blue-400"



        />







      </div>











      {/* =====================================================



          SEARCH + FILTER



      ====================================================== */}







      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 mb-5">







        <div className="flex flex-col md:flex-row gap-3">







          <div className="relative flex-1">







            <Search



              size={14}



              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"



            />







            <input



              value={search}



              onChange={(event) =>



                setSearch(



                  event.target.value



                )



              }



              placeholder="Search hospital, location or ID..."



              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pl-9 text-xs text-slate-800 outline-none focus:border-red-400/40"



            />







          </div>











          <div className="flex flex-wrap gap-2">







            {[



              "ALL",



              "OPERATIONAL",



              "HIGH LOAD",



              "LIMITED",



            ].map(



              (item) => (







                <button



                  key={item}



                  onClick={() =>



                    setFilter(item)



                  }



                  className={`px-3 py-2 rounded-lg border text-[8px] transition ${



                    filter === item



                      ? "bg-red-50 border-red-200 text-red-600"



                      : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"



                  }`}



                >



                  {item}



                </button>







              )



            )}







          </div>







        </div>







      </div>











      {/* =====================================================



          MAIN GRID



      ====================================================== */}







      <div



        className={`grid gap-5 ${



          showDetails



            ? "grid-cols-1 xl:grid-cols-[minmax(0,1fr)_390px]"



            : "grid-cols-1"



        }`}



      >











        {/* ===================================================



            HOSPITAL NETWORK



        ==================================================== */}







        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">







          <div className="flex items-center justify-between mb-5">







            <div>







              <h2 className="font-semibold">



                Emergency Hospital Network



              </h2>







              <p className="text-xs text-slate-600 mt-1">



                Click a hospital to inspect live readiness



              </p>







            </div>











            <div className="flex items-center gap-2">







              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />







              <span className="text-[8px] text-red-600">



                LIVE



              </span>







            </div>







          </div>











          <div className="space-y-3">







            {filteredHospitals.length === 0 ? (







              <div className="py-14 text-center">







                <Building2



                  size={30}



                  className="mx-auto text-slate-700"



                />







                <p className="text-xs text-slate-400 mt-3">



                  No hospitals found



                </p>







                <button



                  onClick={() => {



                    setSearch("");



                    setFilter("ALL");



                  }}



                  className="mt-3 text-[9px] text-red-600 hover:text-red-300"



                >



                  Clear filters



                </button>







              </div>







            ) : (







              filteredHospitals.slice(0, 100).map(



                (hospital) => (







                  <HospitalRow



                    key={hospital.id}



                    hospital={hospital}



                    selected={



                      selectedHospital.id ===



                      hospital.id



                    }



                    onClick={() =>



                      handleSelectHospital(



                        hospital



                      )



                    }



                  />







                )



              )







            )}







          </div>







        </div>











        {/* ===================================================



            DETAILS



        ==================================================== */}







        {showDetails && (







          <HospitalDetails



            hospital={



              selectedHospital



            }



            onClose={() =>



              setShowDetails(false)



            }



            onDispatch={() =>



              setShowDispatch(true)



            }



            onMedicalStock={() =>



              setShowStock(true)



            }



            onViewMap={



              openHospitalMap



            }



          />







        )}







      </div>











      {/* =====================================================



          AI EMERGENCY RECOMMENDATION



      ====================================================== */}







      <div className="mt-5 bg-red-500/[0.035] border border-red-200 rounded-2xl p-5">







        <div className="flex items-center gap-2">







          <Zap



            size={16}



            className="text-red-600"



          />







          <span className="text-sm font-semibold text-red-300">



            AI Emergency Response Recommendation



          </span>







        </div>











        <p className="text-xs text-slate-400 leading-5 mt-3 max-w-5xl">



          {recommendation}



        </p>







      </div>











      {/* =====================================================



          DISPATCH MODAL



      ====================================================== */}







      {showDispatch && (







        <Modal



          title="Dispatch Ambulance"



          onClose={() =>



            !dispatching &&



            setShowDispatch(false)



          }



        >







          <div className="space-y-4">







            <div className="flex items-center gap-3">







              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">







                <Ambulance



                  size={19}



                  className="text-red-600"



                />







              </div>







              <div>







                <p className="text-sm font-semibold">



                  {selectedHospital.name}



                </p>







                <p className="text-[9px] text-slate-600 mt-1">



                  {selectedHospital.location}



                </p>







              </div>







            </div>











            <div className="grid grid-cols-2 gap-3">







              <SmallInfo



                label="Available"



                value={



                  selectedHospital.ambulances



                }



              />







              <SmallInfo



                label="Response"



                value={



                  selectedHospital.response



                }



              />







            </div>











            <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">







              <p className="text-[9px] text-orange-600">



                Dispatch will allocate one available ambulance to this facility's emergency response queue.



              </p>







            </div>











            <div className="grid grid-cols-2 gap-2">







              <button



                onClick={() =>



                  setShowDispatch(false)



                }



                disabled={dispatching}



                className="py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400 hover:text-slate-900"



              >



                Cancel



              </button>







              <button



                onClick={



                  handleDispatch



                }



                disabled={



                  dispatching ||



                  selectedHospital.ambulances <=



                    0



                }



                className="py-3 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-400 disabled:opacity-50 flex items-center justify-center gap-2"



              >







                {dispatching ? (







                  <>



                    <RefreshCw



                      size={13}



                      className="animate-spin"



                    />







                    Dispatching...



                  </>







                ) : (







                  <>



                    <Ambulance



                      size={13}



                    />







                    Confirm Dispatch



                  </>







                )}







              </button>







            </div>







          </div>







        </Modal>







      )}











      {/* =====================================================



          MEDICAL STOCK MODAL



      ====================================================== */}







      {showStock && (







        <Modal



          title="Medical Stock"



          onClose={() =>



            setShowStock(false)



          }



        >







          <div className="space-y-4">







            <div>







              <p className="text-sm font-semibold">



                {selectedHospital.name}



              </p>







              <p className="text-[9px] text-slate-600 mt-1">



                Current medical resource inventory



              </p>







            </div>











            <StockRow



              icon={Pill}



              label="Antibiotics"



              value={



                selectedHospital



                  .medicines



                  .antibiotics



              }



            />







            <StockRow



              icon={Zap}



              label="Oxygen Supply"



              value={



                selectedHospital



                  .medicines



                  .oxygen



              }



            />







            <StockRow



              icon={HeartPulse}



              label="Emergency Drugs"



              value={



                selectedHospital



                  .medicines



                  .emergencyDrugs



              }



            />







            <StockRow



              icon={Package}



              label="Blood Units"



              value={



                selectedHospital



                  .medicines



                  .bloodUnits



              }



            />











            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">







              <div className="flex items-center gap-2">







                <Package



                  size={13}



                  className="text-blue-600"



                />







                <span className="text-[8px] uppercase text-slate-600">



                  Overall Stock



                </span>







              </div>







              <p className="text-2xl font-bold mt-1">



                {selectedHospital.medicine}%



              </p>







            </div>







          </div>







        </Modal>







      )}







    </div>



  );



}











/* =========================================================



   STAT CARD



========================================================= */







function StatCard({



  icon: Icon,



  title,



  value,



  text,



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











      <p className="text-[8px] uppercase text-slate-600 mt-4">



        {title}



      </p>











      <p className="text-xl font-bold mt-1">



        {value}



      </p>











      <p className="text-[8px] text-slate-700 mt-1">



        {text}



      </p>







    </div>



  );



}











/* =========================================================



   FLOW CARD



========================================================= */







function FlowCard({



  icon: Icon,



  title,



  value,



  text,



  percentage,



  color,



}) {







  return (







    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">







      <div className="flex items-center gap-3">







        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">







          <Icon



            size={15}



            className="text-slate-400"



          />







        </div>











        <div>







          <p className="text-[8px] uppercase text-slate-600">



            {title}



          </p>







          <p className="text-lg font-bold mt-1">



            {value}



          </p>







        </div>







      </div>











      <p className="text-[8px] text-slate-700 mt-3">



        {text}



      </p>











      <div className="h-1 bg-slate-50 rounded-full mt-3 overflow-hidden">







        <div



          className={`h-full rounded-full ${color}`}



          style={{



            width:



              `${Math.min(



                100,



                Math.max(



                  0,



                  percentage



                )



              )}%`,



          }}



        />







      </div>







    </div>



  );



}











/* =========================================================



   HOSPITAL ROW



========================================================= */







function HospitalRow({



  hospital,



  selected,



  onClick,



}) {







  const statusClass =



    hospital.status === "HIGH LOAD"



      ? "text-red-600 bg-red-50 border-red-200"



      : hospital.status === "LIMITED"



      ? "text-orange-600 bg-orange-500/10 border-orange-500/20"



      : "text-emerald-600 bg-emerald-50 border-emerald-200";











  return (







    <button



      onClick={onClick}



      className={`w-full text-left p-4 rounded-xl border transition ${



        selected



          ? "bg-red-500/[0.035] border-red-200"



          : "bg-slate-50 border-slate-200 hover:border-slate-300"



      }`}



    >







      <div className="flex items-center gap-4">







        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0">







          <Building2



            size={17}



            className={



              selected



                ? "text-red-600"



                : "text-slate-400"



            }



          />







        </div>











        <div className="flex-1 min-w-0">







          <div className="flex flex-wrap items-center gap-2">







            <h3 className="text-xs font-semibold text-slate-900">



              {hospital.name}



            </h3>











            <span



              className={`px-2 py-0.5 rounded border text-[7px] ${statusClass}`}



            >



              {hospital.status}



            </span>







          </div>











          <div className="flex items-center gap-1 mt-1">







            <MapPin



              size={9}



              className="text-slate-700"



            />







            <span className="text-[8px] text-slate-600">



              {hospital.location}



            </span>







          </div>











          <div className="mt-3">







            <div className="flex justify-between">







              <span className="text-[7px] text-slate-700 uppercase">



                Emergency Load



              </span>







              <span



                className={`text-[8px] ${



                  hospital.load >= 90



                    ? "text-red-600"



                    : hospital.load >= 75



                    ? "text-orange-600"



                    : "text-emerald-600"



                }`}



              >



                {hospital.load}%



              </span>







            </div>











            <div className="h-1 bg-slate-50 rounded-full mt-1.5 overflow-hidden">







              <div



                className={



                  hospital.load >= 90



                    ? "h-full bg-red-400"



                    : hospital.load >= 75



                    ? "h-full bg-orange-400"



                    : "h-full bg-emerald-400"



                }



                style={{



                  width:



                    `${hospital.load}%`,



                }}



              />







            </div>







          </div>











          <div className="flex flex-wrap gap-6 mt-3">







            <Mini



              label="Beds"



              value={hospital.data_status === "UNAVAILABLE" || hospital.data_status === "STATIC" ? "Data Unavailable" : `${hospital.beds}%`}



            />







            <Mini



              label="ICU"



              value={hospital.data_status === "UNAVAILABLE" || hospital.data_status === "STATIC" ? "Data Unavailable" : `${hospital.icu}%`}



            />







            <Mini



              label="Ambulance"



              value={



                hospital.ambulances



              }



            />







            <Mini



              label="Response"



              value={



                hospital.response



              }



            />







          </div>







        </div>











        <ChevronRight



          size={14}



          className={



            selected



              ? "text-red-600"



              : "text-slate-700"



          }



        />







      </div>







    </button>



  );



}











/* =========================================================



   MINI



========================================================= */







function Mini({



  label,



  value,



}) {







  return (







    <div>







      <p className="text-[6px] uppercase text-slate-700">



        {label}



      </p>







      <p className="text-[9px] text-slate-700 mt-1">



        {value}



      </p>







    </div>



  );



}











/* =========================================================



   HOSPITAL DETAILS



========================================================= */







function HospitalDetails({



  hospital,



  onClose,



  onDispatch,



  onMedicalStock,



  onViewMap,



}) {







  if (!hospital) {



    return null;



  }











  const loadColor =



    hospital.load >= 90



      ? "text-red-600"



      : hospital.load >= 75



      ? "text-orange-600"



      : "text-emerald-600";











  const loadBar =



    hospital.load >= 90



      ? "bg-red-400"



      : hospital.load >= 75



      ? "bg-orange-400"



      : "bg-emerald-400";











  return (







    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">











      {/* HEADER */}







      <div className="p-5 border-b border-slate-200 flex items-start justify-between">







        <div className="flex items-center gap-3">







          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">







            <HeartPulse



              size={18}



              className="text-red-600"



            />







          </div>











          <div>







            <p className="text-[7px] uppercase text-slate-700">



              Medical Facility



            </p>







            <h2 className="text-sm font-bold mt-1">



              {hospital.name}



            </h2>







            <p className="text-[8px] text-slate-600 mt-1">



              {hospital.location}



            </p>







          </div>







        </div>











        <button



          onClick={onClose}



          className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900"



        >







          <X size={14} />







        </button>







      </div>











      <div className="p-5">











        {/* EMERGENCY LOAD */}







        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">







          <div className="flex items-center justify-between">







            <div>







              <p className="text-[7px] uppercase tracking-wider text-slate-700">



                Emergency Load



              </p>







              <p



                className={`text-2xl font-bold mt-1 ${loadColor}`}



              >



                {hospital.load}%



              </p>







            </div>











            <Activity



              size={18}



              className={loadColor}



            />







          </div>











          <div className="h-2 bg-slate-50 rounded-full mt-4 overflow-hidden">







            <div



              className={`h-full ${loadBar}`}



              style={{



                width:



                  `${hospital.load}%`,



              }}



            />







          </div>







        </div>











        {/* MEDICAL METRICS */}







        <div className="grid grid-cols-2 gap-3 mt-4">







          <Detail



            icon={BedDouble}



            label="Bed Occupancy"



            value={hospital.data_status === "UNAVAILABLE" || hospital.data_status === "STATIC" ? "Data Unavailable" : `${hospital.beds}%`}



            color="text-purple-600"



          />







          <Detail



            icon={HeartPulse}



            label="ICU Occupancy"



            value={hospital.data_status === "UNAVAILABLE" || hospital.data_status === "STATIC" ? "Data Unavailable" : `${hospital.icu}%`}



            color="text-red-600"



          />







          <Detail



            icon={Ambulance}



            label="Ambulances"



            value={



              hospital.ambulances



            }



            color="text-orange-600"



          />







          <Detail



            icon={Stethoscope}



            label="Doctors"



            value={hospital.doctors}



            color="text-cyan-600"



          />







        </div>











        {/* RESOURCES */}







        <div className="mt-5">







          <p className="text-[8px] uppercase tracking-wider text-slate-700">



            Medical Resources



          </p>











          <ResourceBar



            label="Emergency Capacity"



            value={hospital.emergency}



            color="bg-red-400"



          />







          <ResourceBar



            label="Medicine Stock"



            value={hospital.medicine}



            color="bg-blue-400"



          />







        </div>











        {/* RESPONSE */}







        <div className="grid grid-cols-2 gap-3 mt-5">







          <InfoBox



            icon={Clock3}



            label="Response Time"



            value={



              hospital.response



            }



          />







          <InfoBox



            icon={MapPin}



            label="Distance"



            value={



              hospital.distance



            }



          />







        </div>











        {/* MAP */}







        <button



          onClick={onViewMap}



          className="relative w-full h-28 mt-5 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden text-left group"



        >







          <div



            className="absolute inset-0"



            style={{



              backgroundImage:



                "linear-gradient(rgba(71,85,105,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(71,85,105,.15) 1px, transparent 1px)",



              backgroundSize:



                "22px 22px",



            }}



          />











          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">







            <div className="absolute -inset-6 rounded-full bg-red-400/5 animate-pulse" />







            <div className="relative w-9 h-9 rounded-full border border-red-400 bg-red-400/10 flex items-center justify-center">







              <MapPin



                size={14}



                className="text-red-600"



              />







            </div>







          </div>











          <span className="absolute left-3 bottom-3 text-[7px] text-red-600 bg-slate-50/90 px-2 py-1 rounded">



            {hospital.location}



          </span>











          <span className="absolute right-3 bottom-3 text-[7px] text-cyan-600 bg-slate-50/90 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">



            Open Map →



          </span>







        </button>











        {/* AI */}







        <div className="mt-4 p-4 rounded-xl bg-purple-500/5 border border-purple-200">







          <div className="flex items-center gap-2">







            <Zap



              size={13}



              className="text-purple-600"



            />







            <span className="text-[8px] uppercase tracking-wider text-purple-600">



              AI Response Recommendation



            </span>







          </div>











          <p className="text-[9px] text-slate-400 leading-5 mt-2">







            {hospital.load >= 90



              ? "Avoid assigning new emergency cases here unless clinically necessary. Redirect suitable cases to lower-load facilities."



              : hospital.ambulances <= 3



              ? "Ambulance availability is limited. Reserve vehicles for high-priority incidents."



              : hospital.medicine <= 65



              ? "Medicine stock is becoming constrained. Consider transferring critical supplies."



              : hospital.load >= 75



              ? "Emergency load is elevated. Continue monitoring capacity before assigning additional cases."



              : "Facility currently has acceptable emergency readiness and can receive additional cases."}







          </p>







        </div>











        {/* ACTIONS */}







        <div className="grid grid-cols-2 gap-2 mt-4">







          <button



            onClick={onDispatch}



            disabled={



              hospital.ambulances <= 0



            }



            className="py-3 rounded-xl bg-red-500 text-white text-[9px] font-bold hover:bg-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"



          >







            <Ambulance



              size={12}



            />







            {hospital.ambulances > 0



              ? "Dispatch Ambulance"



              : "No Ambulance Available"}







          </button>











          <button



            onClick={onMedicalStock}



            className="py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-[9px] hover:text-slate-900 transition flex items-center justify-center gap-2"



          >







            <Package



              size={12}



            />







            Medical Stock







          </button>







        </div>











        {/* EXTRA ACTION */}







        <button



          onClick={onViewMap}



          className="w-full mt-2 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-cyan-600 text-[9px] hover:border-cyan-500/30 transition flex items-center justify-center gap-2"



        >







          <Navigation



            size={12}



          />







          Navigate to Hospital







        </button>







      </div>







    </div>



  );



}











/* =========================================================



   DETAIL



========================================================= */







function Detail({



  icon: Icon,



  label,



  value,



  color,



}) {







  return (







    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">







      <Icon



        size={14}



        className={color}



      />







      <p className="text-[7px] text-slate-700 uppercase mt-2">



        {label}



      </p>







      <p className="text-lg font-bold mt-1">



        {value}



      </p>







    </div>



  );



}











/* =========================================================



   RESOURCE BAR



========================================================= */







function ResourceBar({



  label,



  value,



  color,



}) {







  return (







    <div className="mt-3">







      <div className="flex justify-between">







        <span className="text-[8px] text-slate-600">



          {label}



        </span>







        <span className="text-[8px] text-slate-700">



          {value}%



        </span>







      </div>











      <div className="h-1.5 bg-slate-50 rounded-full mt-2 overflow-hidden">







        <div



          className={`h-full rounded-full ${color}`}



          style={{



            width:



              `${value}%`,



          }}



        />







      </div>







    </div>



  );



}











/* =========================================================



   INFO BOX



========================================================= */







function InfoBox({



  icon: Icon,



  label,



  value,



}) {







  return (







    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">







      <Icon



        size={13}



        className="text-slate-400"



      />







      <p className="text-[7px] text-slate-700 uppercase mt-2">



        {label}



      </p>







      <p className="text-sm font-bold mt-1">



        {value}



      </p>







    </div>



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











/* =========================================================



   SMALL INFO



========================================================= */







function SmallInfo({



  label,



  value,



}) {







  return (







    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">







      <p className="text-[7px] uppercase text-slate-600">



        {label}



      </p>







      <p className="text-lg font-bold mt-1">



        {value}



      </p>







    </div>



  );



}











/* =========================================================



   STOCK ROW



========================================================= */







function StockRow({



  icon: Icon,



  label,



  value,



}) {







  const status =



    value < 60



      ? "LOW"



      : value < 75



      ? "MODERATE"



      : "HEALTHY";







  const color =



    value < 60



      ? "text-red-600"



      : value < 75



      ? "text-yellow-600"



      : "text-emerald-600";







  const bar =



    value < 60



      ? "bg-red-400"



      : value < 75



      ? "bg-yellow-400"



      : "bg-emerald-400";











  return (







    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">







      <div className="flex items-center gap-2">







        <Icon



          size={13}



          className={color}



        />







        <span className="text-[9px] text-slate-700 flex-1">



          {label}



        </span>







        <span



          className={`text-[8px] ${color}`}



        >



          {status}



        </span>







        <span className="text-[9px] text-slate-700">



          {value}%



        </span>







      </div>











      <div className="h-1 bg-slate-50 rounded-full mt-2 overflow-hidden">







        <div



          className={`h-full rounded-full ${bar}`}



          style={{



            width:



              `${value}%`,



          }}



        />







      </div>







    </div>



  );



}











export default Hospitals;








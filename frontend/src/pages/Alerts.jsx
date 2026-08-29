





import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from "react";












import {



  Activity,



  AlertOctagon,



  AlertTriangle,



  Bell,



  BellRing,



  Check,



  CheckCircle2,



  ChevronRight,



  Clock3,



  CloudRain,



  Eye,



  Filter,



  MapPin,



  Radio,



  Search,



  ShieldAlert,



  Siren,



  Truck,



  Waves,



  X,



  Zap,



} from "lucide-react";











import { getAlerts, markAlertRead as apiMarkAlertRead } from "../services/api";







/* =========================================================



   MAIN COMPONENT



========================================================= */







function Alerts() {
  const { t } = useTranslation();
const [alerts, setAlerts] = useState([]);



  const [loading, setLoading] = useState(true);



  const [selectedId, setSelectedId] = useState(null);







  useEffect(() => {



    let mounted = true;



    setLoading(true);



    getAlerts()



      .then((data) => {



        if (!mounted) return;



        const formatted = data.map((alt) => ({



          ...alt,



          id: String(alt.id),



          priority: alt.severity === "CRITICAL" || alt.severity === "WARNING" ? alt.severity : "MEDIUM",



          time: new Date(alt.created_at).toLocaleString(),



          location: alt.region || "NER Region",



          source: alt.type,



          category: alt.type,



          status: "ACTIVE",



          score: alt.severity === "CRITICAL" ? 95 : 65,



          title: alt.title,



          message: alt.message



        }));



        setAlerts(formatted);



        if (formatted.length > 0) {



          setSelectedId(formatted[0].id);



        }



      })



      .catch(console.error)



      .finally(() => {



        if (mounted) setLoading(false);



      });



    return () => { mounted = false; };



  }, []);







  const [filter, setFilter] =



    useState("ALL");







  const [search, setSearch] =



    useState("");







  const [unreadOnly, setUnreadOnly] =



    useState(false);







  const [readIds, setReadIds] =



    useState(new Set());











  /* =======================================================



     COUNTERS



  ======================================================== */







  const unreadCount =



    alerts.filter(



      (alert) =>



        !readIds.has(alert.id) &&



        alert.status !== "RESOLVED"



    ).length;







  const criticalCount =



    alerts.filter(



      (alert) =>



        alert.priority === "CRITICAL"



    ).length;







  const highCount =



    alerts.filter(



      (alert) =>



        alert.priority === "HIGH"



    ).length;







  const escalatedCount =



    alerts.filter(



      (alert) =>



        alert.status === "ESCALATED"



    ).length;











  /* =======================================================



     FILTER



  ======================================================== */







  const filteredAlerts = useMemo(() => {







    return alerts.filter((alert) => {







      const query =



        search.trim().toLowerCase();







      const matchesSearch =



        !query ||



        alert.id.toLowerCase().includes(query) ||



        alert.title.toLowerCase().includes(query) ||



        alert.location.toLowerCase().includes(query) ||



        alert.category.toLowerCase().includes(query);







      const matchesFilter =



        filter === "ALL" ||



        alert.priority === filter;







      const isUnread =



        !readIds.has(alert.id);







      const matchesUnread =



        !unreadOnly || isUnread;







      return (



        matchesSearch &&



        matchesFilter &&



        matchesUnread



      );







    });







  }, [



    alerts,



    search,



    filter,



    unreadOnly,



    readIds,



  ]);











  /* =======================================================



     SELECT



  ======================================================== */







  const selectAlert = (alert) => {







    setSelectedId(alert.id);







  };











  /* =======================================================



     MARK READ



  ======================================================== */







  const markRead = (id) => {







    setReadIds((previous) => {







      const next =



        new Set(previous);







      next.add(id);







      return next;







    });







  };











  /* =======================================================



     MARK ALL READ



  ======================================================== */







  const markAllRead = () => {







    setReadIds(



      new Set(



        alerts.map(



          (alert) =>



            alert.id



        )



      )



    );







  };











  const selectedAlert =



    alerts.find(



      (alert) =>



        alert.id === selectedId



    ) || alerts[0];











  return (







    <div className="min-h-full bg-slate-50 text-slate-900 p-6 space-y-5">











      {/* ===================================================



          HEADER



      ==================================================== */}







      <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">







        <div>







          <div className="flex items-center gap-2">







            <span className="relative flex h-2 w-2">







              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-70" />







              <span className="relative rounded-full w-2 h-2 bg-red-400" />







            </span>







            <span className="text-[9px] uppercase tracking-[0.3em] text-red-600">



              Mission Control / Alerts



            </span>







          </div>











          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">



            Alert Command Center



          </h1>











          <p className="text-sm text-slate-500 mt-1">



            Real-time operational intelligence and AI-powered warning prioritization



          </p>







        </div>











        <div className="flex flex-wrap items-center gap-2">







          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">







            <Radio



              size={13}



              className="text-emerald-600"



            />







            <span className="text-[9px] text-emerald-600">



              SYSTEM ONLINE



            </span>







          </div>











          <button



            onClick={markAllRead}



            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-900 text-[9px] font-bold hover:bg-emerald-400 transition"



          >







            <Check size={13} />







            Mark all read







          </button>







        </div>







      </header>











      {/* ===================================================



          KPI



      ==================================================== */}







      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">







        <Kpi



          icon={Bell}



          label="Total Alerts"



          value={alerts.length}



          sub="24h activity"



          iconClass="text-cyan-600"



        />







        <Kpi



          icon={BellRing}



          label="Unread"



          value={unreadCount}



          sub="Requires attention"



          iconClass="text-blue-600"



        />







        <Kpi



          icon={AlertOctagon}



          label="Critical"



          value={criticalCount}



          sub="Immediate action"



          iconClass="text-red-600"



        />







        <Kpi



          icon={ShieldAlert}



          label="High Priority"



          value={highCount}



          sub="Needs review"



          iconClass="text-orange-600"



        />







        <Kpi



          icon={Siren}



          label="Escalated"



          value={escalatedCount}



          sub="Response required"



          iconClass="text-purple-600"



        />







      </section>











      {/* ===================================================



          LIVE STATUS BAR



      ==================================================== */}







      <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">







        <div className="flex flex-col lg:flex-row lg:items-center gap-4">







          <div className="flex items-center gap-3 flex-1">







            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-50 flex items-center justify-center">







              <AlertOctagon



                size={17}



                className="text-red-600"



              />







            </div>











            <div>







              <p className="text-[8px] uppercase tracking-widest text-red-600">



                Priority Pipeline



              </p>







              <p className="text-xs font-semibold text-slate-900 mt-1">



                Critical incidents are being monitored continuously



              </p>







            </div>







          </div>











          <div className="flex flex-wrap items-center gap-5">







            <StatusMetric



              label="AI Detection"



              value="98.4%"



            />







            <StatusMetric



              label="Sources"



              value="06"



            />







            <StatusMetric



              label="Avg Response"



              value="08m"



            />







            <div className="flex items-center gap-2">







              <span className="w-2 h-2 rounded-full bg-emerald-400" />







              <span className="text-[8px] text-emerald-600">



                LIVE



              </span>







            </div>







          </div>







        </div>







      </section>











      {/* ===================================================



          MAIN CONTENT



      ==================================================== */}







      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_410px] gap-5">











        {/* =================================================



            ALERT STREAM



        ================================================== */}







        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">











          {/* TOOLBAR */}







          <div className="p-5 border-b border-slate-200">







            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">







              <div>







                <h2 className="text-sm font-semibold text-slate-900">



                  Live Alert Stream



                </h2>







                <p className="text-[8px] text-slate-500 mt-1">



                  {filteredAlerts.length} alerts matching current filters



                </p>







              </div>











              <div className="relative">







                <Search



                  size={13}



                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"



                />







                <input



                  value={search}



                  onChange={(e) =>



                    setSearch(



                      e.target.value



                    )



                  }



                  placeholder="Search alert..."



                  className="w-full lg:w-60 bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-[9px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500"



                />







              </div>







            </div>











            {/* FILTERS */}







            <div className="flex flex-wrap items-center gap-2 mt-4">







              <Filter



                size={11}



                className="text-slate-400"



              />







              {[



                "ALL",



                "CRITICAL",



                "HIGH",



                "MEDIUM",



                "LOW",



                "RESOLVED",



              ].map((item) => (







                <button



                  key={item}



                  onClick={() =>



                    setFilter(item)



                  }



                  className={`px-3 py-1.5 rounded-lg border text-[8px] transition ${



                    filter === item



                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"



                      : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900"



                  }`}



                >



                  {item}



                </button>







              ))}











              <button



                onClick={() =>



                  setUnreadOnly(



                    (value) =>



                      !value



                  )



                }



                className={`ml-auto px-3 py-1.5 rounded-lg border text-[8px] transition ${



                  unreadOnly



                    ? "bg-blue-50 border-blue-300 text-blue-700"



                    : "bg-slate-50 border-slate-200 text-slate-500"



                }`}



              >







                {unreadOnly



                  ? "Showing Unread"



                  : "Unread Only"}







              </button>







            </div>







          </div>











          {/* ALERT LIST */}







          <div className="p-4 space-y-2 max-h-[680px] overflow-y-auto">







            {filteredAlerts.map(



              (alert) => (







                <AlertCard



                  key={alert.id}



                  alert={alert}



                  selected={



                    selectedId ===



                    alert.id



                  }



                  unread={



                    !readIds.has(



                      alert.id



                    )



                  }



                  onClick={() =>



                    selectAlert(



                      alert



                    )



                  }



                />







              )



            )}











            {filteredAlerts.length === 0 && (







              <div className="py-20 text-center">







                <CheckCircle2



                  size={30}



                  className="mx-auto text-emerald-600"



                />







                <p className="text-sm text-slate-900 mt-3">



                  All clear



                </p>







                <p className="text-[9px] text-slate-500 mt-1">



                  No alerts match the current filters.



                </p>







              </div>







            )}







          </div>







        </div>











        {/* =================================================



            INTELLIGENCE PANEL



        ================================================== */}







        {selectedAlert && (



          <AlertIntelligence



            alert={selectedAlert}



            unread={



              !readIds.has(



                selectedAlert.id



              )



            }



            onRead={() =>



              markRead(



                selectedAlert.id



              )



            }



          />



        )}







      </section>











      {/* ===================================================



          BOTTOM SYSTEM CARDS



      ==================================================== */}







      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">







        <SystemCard



          icon={Radio}



          title="Connected Sources"



          value="06"



          text="GPS • GIS • Weather • Field"



        />







        <SystemCard



          icon={Activity}



          title="Detection Accuracy"



          value="98.4%"



          text="AI risk classification"



        />







        <SystemCard



          icon={Clock3}



          title="Response Efficiency"



          value="+18%"



          text="Improvement vs baseline"



        />







      </section>







    </div>



  );



}











/* =========================================================



   KPI



========================================================= */







function Kpi({



  icon: Icon,



  label,



  value,



  sub,



  iconClass,



}) {







  return (







    <div className="group bg-white border border-slate-200 shadow-sm rounded-xl p-4 hover:border-slate-300 transition">







      <div className="flex items-center justify-between">







        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">







          <Icon



            size={16}



            className={iconClass}



          />







        </div>











        <span className="text-[7px] text-slate-400">



          LIVE



        </span>







      </div>











      <p className="text-[8px] uppercase tracking-wider text-slate-500 mt-4">



        {label}



      </p>











      <div className="flex items-end gap-2">







        <p className="text-xl font-bold text-slate-900 mt-1">



          {value}



        </p>







        <p className="text-[7px] text-slate-400 mb-1">



          {sub}



        </p>







      </div>







    </div>







  );



}











/* =========================================================



   STATUS METRIC



========================================================= */







function StatusMetric({



  label,



  value,



}) {







  return (







    <div>







      <p className="text-[7px] uppercase text-slate-400">



        {label}



      </p>







      <p className="text-[10px] font-semibold text-slate-900 mt-1">



        {value}



      </p>







    </div>







  );



}











/* =========================================================



   ALERT CARD



========================================================= */







function AlertCard({



  alert,



  selected,



  unread,



  onClick,



}) {







  const color = getPriorityColor(



    alert.priority



  );











  return (







    <button



      onClick={onClick}



      className={`w-full text-left p-4 rounded-xl border transition-all ${



        selected



          ? "bg-emerald-50 border-emerald-300"



          : unread



          ? "bg-blue-50 border-blue-200 hover:border-slate-300"



          : "bg-slate-50 border-slate-200 hover:border-slate-300"



      }`}



    >







      <div className="flex items-start gap-3">











        {/* PRIORITY INDICATOR */}







        <div className="relative shrink-0">







          {alert.priority === "CRITICAL" && (







            <span className="absolute -inset-1 rounded-xl bg-red-50 animate-pulse" />







          )}







          <div className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">







            <AlertTypeIcon



              category={



                alert.category



              }



              priority={



                alert.priority



              }



            />







          </div>







        </div>











        {/* BODY */}







        <div className="flex-1 min-w-0">







          <div className="flex flex-wrap items-center gap-2">







            <span className="text-[7px] font-mono text-slate-400">



              {alert.id}



            </span>











            <span



              className={`px-1.5 py-0.5 rounded border text-[7px] ${color.badge}`}



            >



              {alert.priority}



            </span>











            <span className="text-[7px] text-slate-400 uppercase">



              {alert.category}



            </span>











            {unread && (







              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-auto" />







            )}







          </div>











          <div className="flex items-start justify-between gap-3 mt-2">







            <div>







              <h3 className="text-[11px] font-semibold text-slate-900">



                {alert.title}



              </h3>







              <p className="text-[9px] text-slate-500 leading-5 mt-1">



                {alert.message}



              </p>







            </div>











            <ChevronRight



              size={14}



              className={



                selected



                  ? "text-emerald-600 mt-1 shrink-0"



                  : "text-slate-400 mt-1 shrink-0"



              }



            />







          </div>











          <div className="flex flex-wrap items-center gap-4 mt-3">







            <Meta



              icon={MapPin}



              value={



                alert.location



              }



            />







            <Meta



              icon={Clock3}



              value={



                alert.time



              }



            />







            <Meta



              icon={Truck}



              value={`${alert.affectedVehicles} vehicles`}



            />







          </div>











          {/* SCORE */}







          <div className="mt-3">







            <div className="flex justify-between">







              <span className="text-[7px] uppercase tracking-wider text-slate-400">



                AI Priority



              </span>







              <span



                className={`text-[8px] font-semibold ${color.text}`}



              >



                {alert.score}/100



              </span>







            </div>











            <div className="h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">







              <div



                className={`h-full rounded-full ${color.bar}`}



                style={{



                  width:



                    `${alert.score}%`,



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



   META



========================================================= */







function Meta({



  icon: Icon,



  value,



}) {







  return (







    <div className="flex items-center gap-1">







      <Icon



        size={9}



        className="text-slate-400"



      />







      <span className="text-[7px] text-slate-500">



        {value}



      </span>







    </div>







  );



}











/* =========================================================



   INTELLIGENCE PANEL



========================================================= */







function AlertIntelligence({



  alert,



  unread,



  onRead,



}) {







  const color = getPriorityColor(



    alert.priority



  );











  return (







    <aside className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">











      {/* PANEL HEADER */}







      <div className="p-5 border-b border-slate-200">







        <div className="flex items-start justify-between gap-3">







          <div className="flex items-center gap-3">







            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">







              <AlertTypeIcon



                category={



                  alert.category



                }



                priority={



                  alert.priority



                }



              />







            </div>











            <div>







              <p className="text-[7px] uppercase tracking-[0.2em] text-slate-400">



                Selected Alert



              </p>







              <p className="text-base font-bold text-slate-900 mt-1">



                {alert.id}



              </p>







            </div>







          </div>











          <button className="text-slate-400 hover:text-slate-900">



            <X size={14} />



          </button>







        </div>







      </div>











      <div className="p-5">











        {/* PRIORITY */}







        <div className={`rounded-xl border p-4 ${color.panel}`}>







          <div className="flex items-center justify-between">







            <div className="flex items-center gap-2">







              <ShieldAlert



                size={14}



                className={color.text}



              />







              <span className="text-[8px] uppercase tracking-wider text-slate-500">



                AI Priority Score



              </span>







            </div>











            <span



              className={`text-xl font-bold ${color.text}`}



            >



              {alert.score}



              <span className="text-[8px] text-slate-500">



                /100



              </span>



            </span>







          </div>











          <div className="h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">







            <div



              className={`h-full rounded-full ${color.bar}`}



              style={{



                width:



                  `${alert.score}%`,



              }}



            />







          </div>











          <div className="flex justify-between mt-2">







            <span className="text-[7px] text-slate-400">



              LOW



            </span>







            <span className="text-[7px] text-slate-400">



              CRITICAL



            </span>







          </div>







        </div>











        {/* TITLE */}







        <div className="mt-5">







          <span



            className={`text-[7px] px-2 py-1 rounded border ${color.badge}`}



          >



            {alert.priority}



          </span>











          <h2 className="text-base font-bold text-slate-900 mt-3">



            {alert.title}



          </h2>











          <p className="text-[10px] text-slate-500 leading-5 mt-2">



            {alert.message}



          </p>







        </div>











        {/* DETAILS */}







        <div className="grid grid-cols-2 gap-2 mt-5">







          <Detail



            icon={MapPin}



            label="Location"



            value={



              alert.location



            }



          />







          <Detail



            icon={Radio}



            label="Source"



            value={



              alert.source



            }



          />







          <Detail



            icon={Clock3}



            label="Detected"



            value={



              alert.time



            }



          />







          <Detail



            icon={Truck}



            label="Vehicles"



            value={



              alert.affectedVehicles



            }



          />







        </div>











        {/* MINI MAP */}







        <div className="relative h-36 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden mt-4">







          <div



            className="absolute inset-0 opacity-40"



            style={{



              backgroundImage:



                "linear-gradient(rgba(148,163,184,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.18) 1px, transparent 1px)",



              backgroundSize:



                "25px 25px",



            }}



          />











          {/* ROADS */}







          <div className="absolute w-[80%] h-px bg-slate-300 left-[10%] top-[55%] rotate-[-15deg]" />







          <div className="absolute w-[70%] h-px bg-slate-300 left-[15%] top-[40%] rotate-[18deg]" />











          {/* ALERT RADIUS */}







          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">







            <div className="absolute -inset-10 rounded-full border border-red-200 animate-pulse" />







            <div className="absolute -inset-6 rounded-full border border-red-200" />







            <div className="relative w-9 h-9 rounded-full bg-red-50 border border-red-300 flex items-center justify-center">







              <AlertTriangle



                size={14}



                className="text-red-600"



              />







            </div>







          </div>











          <div className="absolute left-3 bottom-3 px-2 py-1 rounded bg-white/90 border border-slate-200">







            <span className="text-[7px] text-red-600">



              LIVE INCIDENT ZONE



            </span>







          </div>







        </div>











        {/* DECISION ENGINE */}







        <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">







          <div className="flex items-center gap-2">







            <Zap



              size={13}



              className="text-emerald-600"



            />







            <span className="text-[8px] uppercase tracking-wider text-emerald-600">



              AI Recommendation



            </span>







          </div>











          <p className="text-[10px] text-slate-600 leading-5 mt-2">



            Divert affected vehicles and activate the safest



            available route. Continue monitoring this alert



            until road conditions stabilize.



          </p>







        </div>











        {/* LIFECYCLE */}







        <div className="mt-5">







          <p className="text-[8px] uppercase tracking-widest text-slate-400">



            Alert Lifecycle



          </p>











          <div className="mt-4 space-y-3">







            <Lifecycle



              done



              title="Detected"



              text={`Source: ${alert.source}`}



            />







            <Lifecycle



              done



              title="AI Assessed"



              text={`Priority ${alert.score}/100`}



            />







            <Lifecycle



              done={



                alert.status ===



                "ESCALATED"



              }



              title="Escalation"



              text={



                alert.status ===



                "ESCALATED"



                  ? "Response team notified"



                  : "Awaiting escalation"



              }



            />







            <Lifecycle



              done={



                alert.status ===



                "RESOLVED"



              }



              title="Resolved"



              text={



                alert.status ===



                "RESOLVED"



                  ? "Alert closed"



                  : "Alert remains active"



              }



              last



            />







          </div>







        </div>











        {/* ACTIONS */}







        <div className="grid grid-cols-2 gap-2 mt-5">







          <button className="py-3 rounded-xl bg-red-500 text-white text-[9px] font-bold hover:bg-red-400 transition flex items-center justify-center gap-2">







            <Siren size={12} />







            Escalate







          </button>











          <button className="py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[9px] hover:text-slate-900 transition flex items-center justify-center gap-2">







            <Eye size={12} />







            Open Map







          </button>







        </div>











        {unread && (







          <button



            onClick={onRead}



            className="w-full mt-2 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-semibold hover:bg-emerald-100 transition flex items-center justify-center gap-2"



          >







            <CheckCircle2 size={12} />







            Mark Alert as Read







          </button>







        )}







      </div>







    </aside>







  );



}











/* =========================================================



   DETAIL



========================================================= */







function Detail({



  icon: Icon,



  label,



  value,



}) {







  return (







    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">







      <div className="flex items-center gap-1.5">







        <Icon



          size={10}



          className="text-slate-400"



        />







        <span className="text-[7px] uppercase text-slate-400">



          {label}



        </span>







      </div>











      <p className="text-[9px] text-slate-900 mt-2 line-clamp-2">



        {value}



      </p>







    </div>







  );



}











/* =========================================================



   LIFECYCLE



========================================================= */







function Lifecycle({



  done,



  title,



  text,



  last,



}) {







  return (







    <div className="flex gap-3">







      <div className="flex flex-col items-center">







        <div



          className={`w-6 h-6 rounded-full border flex items-center justify-center ${



            done



              ? "bg-emerald-50 border-emerald-300"



              : "bg-slate-50 border-slate-200"



          }`}



        >







          {done ? (







            <Check



              size={10}



              className="text-emerald-600"



            />







          ) : (







            <Clock3



              size={9}



              className="text-slate-400"



            />







          )}







        </div>











        {!last && (







          <div className="w-px h-5 bg-slate-200 mt-1" />







        )}







      </div>











      <div>







        <p className="text-[9px] font-semibold text-slate-900">



          {title}



        </p>







        <p className="text-[7px] text-slate-500 mt-1">



          {text}



        </p>







      </div>







    </div>







  );



}











/* =========================================================



   ALERT ICON



========================================================= */







function AlertTypeIcon({



  category,



  priority,



}) {







  const className =



    priority === "CRITICAL"



      ? "text-red-600"



      : priority === "HIGH"



      ? "text-orange-600"



      : priority === "MEDIUM"



      ? "text-yellow-600"



      : priority === "LOW"



      ? "text-emerald-600"



      : "text-slate-400";











  if (category === "LANDSLIDE") {



    return (



      <AlertOctagon



        size={17}



        className={className}



      />



    );



  }











  if (category === "FLOOD") {



    return (



      <Waves



        size={17}



        className={className}



      />



    );



  }











  if (category === "WEATHER") {



    return (



      <CloudRain



        size={17}



        className={className}



      />



    );



  }











  if (category === "VEHICLE") {



    return (



      <Truck



        size={17}



        className={className}



      />



    );



  }











  if (category === "TRAFFIC") {



    return (



      <Activity



        size={17}



        className={className}



      />



    );



  }











  return (



    <AlertTriangle



      size={17}



      className={className}



    />



  );



}











/* =========================================================



   PRIORITY COLORS



========================================================= */







function getPriorityColor(



  priority



) {







  if (priority === "CRITICAL") {







    return {



      text: "text-red-600",



      bar: "bg-red-500",



      badge:



        "text-red-600 bg-red-50 border-red-200",



      panel:



        "bg-red-50 border-red-200",



    };







  }











  if (priority === "HIGH") {







    return {



      text: "text-orange-600",



      bar: "bg-orange-500",



      badge:



        "text-orange-600 bg-orange-50 border-orange-200",



      panel:



        "bg-orange-50 border-orange-200",



    };







  }











  if (priority === "MEDIUM") {







    return {



      text: "text-yellow-600",



      bar: "bg-yellow-500",



      badge:



        "text-yellow-600 bg-yellow-50 border-yellow-200",



      panel:



        "bg-yellow-50 border-yellow-200",



    };







  }











  if (priority === "LOW") {







    return {



      text: "text-emerald-600",



      bar: "bg-emerald-500",



      badge:



        "text-emerald-600 bg-emerald-50 border-emerald-200",



      panel:



        "bg-emerald-50 border-emerald-200",



    };







  }











  return {



    text: "text-slate-500",



    bar: "bg-slate-400",



    badge:



      "text-slate-600 bg-slate-100 border-slate-200",



    panel:



      "bg-white border-slate-200 shadow-sm",



  };







}











/* =========================================================



   SYSTEM CARD



========================================================= */







function SystemCard({



  icon: Icon,



  title,



  value,



  text,



}) {







  return (







    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center gap-4">







      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">







        <Icon



          size={16}



          className="text-emerald-600"



        />







      </div>











      <div>







        <p className="text-[8px] uppercase tracking-wider text-slate-500">



          {title}



        </p>







        <p className="text-lg font-bold text-slate-900 mt-0.5">



          {value}



        </p>







        <p className="text-[7px] text-slate-400 mt-1">



          {text}



        </p>







      </div>







    </div>







  );



}











export default Alerts;








import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";

import { getIncidents, updateIncident } from "../services/api";


/* =========================================================
   HELPERS
========================================================= */

const getSeverityScore = (severity) => {

  if (severity === "CRITICAL") return 90;

  if (severity === "HIGH") return 70;

  if (severity === "MEDIUM") return 45;

  return 20;

};


const getSeverityClass = (severity) => {

  if (severity === "CRITICAL") {

    return "text-red-700 bg-red-50 border-red-200";

  }

  if (severity === "HIGH") {

    return "text-orange-700 bg-orange-50 border-orange-200";

  }

  if (severity === "MEDIUM") {

    return "text-amber-700 bg-amber-50 border-amber-200";

  }

  return "text-emerald-700 bg-emerald-50 border-emerald-200";

};


const getSeverityText = (severity) => {

  if (severity === "CRITICAL") {

    return "text-red-600";

  }

  if (severity === "HIGH") {

    return "text-orange-600";

  }

  if (severity === "MEDIUM") {

    return "text-amber-600";

  }

  return "text-emerald-600";

};


/* =========================================================
   MAIN COMPONENT
========================================================= */

function Incidents() {

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedIncidentId, setSelectedIncidentId] =
    useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getIncidents()
      .then((data) => {
        if (!mounted) return;
        const formatted = data.map((inc) => ({
          ...inc,
          reportedAt: new Date(inc.created_at).toLocaleString(),
        }));
        setIncidents(formatted);
        if (formatted.length > 0) {
          setSelectedIncidentId(formatted[0].id);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);


  const [search, setSearch] =
    useState("");


  const [filter, setFilter] =
    useState("ALL");


  const [refreshing, setRefreshing] =
    useState(false);


  const [showDetails, setShowDetails] =
    useState(false);


  /* =========================================================
     SELECTED INCIDENT
  ========================================================= */

  const selectedIncident = useMemo(() => {

    return (
      incidents.find(
        (incident) =>
          incident.id ===
          selectedIncidentId
      ) ||
      incidents[0] ||
      null
    );

  }, [
    incidents,
    selectedIncidentId,
  ]);


  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalIncidents =
    incidents.length;


  const criticalIncidents =
    incidents.filter(
      (incident) =>
        incident.severity ===
        "CRITICAL"
    ).length;


  const highIncidents =
    incidents.filter(
      (incident) =>
        incident.severity ===
        "HIGH"
    ).length;


  const activeIncidents =
    incidents.filter(
      (incident) =>
        incident.status ===
        "ACTIVE"
    ).length;


  const resolvedIncidents =
    incidents.filter(
      (incident) =>
        incident.status ===
        "RESOLVED"
    ).length;


  /* =========================================================
     FILTER
  ========================================================= */

  const filteredIncidents =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      return incidents.filter(
        (incident) => {

          const matchesSearch =
            !query ||

            String(
              incident.id || ""
            )
              .toLowerCase()
              .includes(query) ||

            String(
              incident.type || ""
            )
              .toLowerCase()
              .includes(query) ||

            String(
              incident.location || ""
            )
              .toLowerCase()
              .includes(query) ||

            String(
              incident.road || ""
            )
              .toLowerCase()
              .includes(query);


          const matchesFilter =
            filter === "ALL" ||
            incident.severity ===
              filter ||
            incident.status ===
              filter;


          return (
            matchesSearch &&
            matchesFilter
          );

        }
      );

    }, [
      incidents,
      search,
      filter,
    ]);


  /* =========================================================
     REFRESH
  ========================================================= */

  const refreshIncidents = () => {

    if (refreshing) return;


    setRefreshing(true);


    setTimeout(() => {

      setIncidents(
        (previous) =>
          previous.map(
            (incident) => ({
              ...incident,
            })
          )
      );


      setRefreshing(false);

    }, 800);

  };


  /* =========================================================
     SELECT
  ========================================================= */

  const selectIncident = (
    incident
  ) => {

    setSelectedIncidentId(
      incident.id
    );

    setShowDetails(true);

  };


  /* =========================================================
     MARK RESOLVED
  ========================================================= */

  const resolveIncident = () => {

    if (!selectedIncident) {
      return;
    }


    setIncidents(
      (previous) =>
        previous.map(
          (incident) => {

            if (
              incident.id !==
              selectedIncident.id
            ) {

              return incident;

            }


            return {

              ...incident,

              status:
                "RESOLVED",

            };

          }
        )
    );


    setShowDetails(false);

  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="min-h-full bg-slate-50 p-6 space-y-6">


      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-red-500" />

            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-red-600">
              Incident Operations • Live
            </span>

          </div>


          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Incident Intelligence
          </h1>


          <p className="text-sm text-slate-500 mt-1">
            Monitor, analyze and respond to operational incidents
          </p>

        </div>


        <button
          onClick={refreshIncidents}
          disabled={refreshing}
          className="self-start xl:self-auto flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition"
        >

          <RefreshCw
            size={14}
            className={
              refreshing
                ? "animate-spin text-red-500"
                : "text-slate-500"
            }
          />

          <span className="text-xs font-medium text-slate-700">
            {refreshing
              ? "Refreshing..."
              : "Refresh Incidents"}
          </span>

        </button>

      </div>


      {/* =====================================================
          KPI
      ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

        <IncidentKpi
          icon={ShieldAlert}
          label="Total"
          value={totalIncidents}
          color="text-blue-600"
          bg="bg-blue-50"
        />


        <IncidentKpi
          icon={AlertTriangle}
          label="Critical"
          value={criticalIncidents}
          color="text-red-600"
          bg="bg-red-50"
        />


        <IncidentKpi
          icon={AlertTriangle}
          label="High"
          value={highIncidents}
          color="text-orange-600"
          bg="bg-orange-50"
        />


        <IncidentKpi
          icon={Clock3}
          label="Active"
          value={activeIncidents}
          color="text-amber-600"
          bg="bg-amber-50"
        />


        <IncidentKpi
          icon={CheckCircle2}
          label="Resolved"
          value={resolvedIncidents}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />

      </div>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-5">


        {/* ===================================================
            INCIDENT LIST
        ==================================================== */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


          {/* LIST HEADER */}

          <div className="p-5 border-b border-slate-200">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">


              <div>

                <h2 className="text-sm font-semibold text-slate-900">
                  Active Incidents
                </h2>

                <p className="text-[10px] text-slate-400 mt-1">
                  Select an incident to inspect intelligence
                </p>

              </div>


              {/* SEARCH */}

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
                  placeholder="Search incident..."
                  className="w-full md:w-64 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pl-9 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />

              </div>

            </div>


            {/* FILTERS */}

            <div className="flex flex-wrap gap-2 mt-4">

              {[
                "ALL",
                "CRITICAL",
                "HIGH",
                "MEDIUM",
                "ACTIVE",
                "RESOLVED",
              ].map(
                (item) => (

                  <button
                    key={item}
                    onClick={() =>
                      setFilter(item)
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-medium border transition ${
                      filter === item
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >

                    {item === "ALL" && (
                      <Filter size={10} />
                    )}

                    {item}

                  </button>

                )
              )}

            </div>

          </div>


          {/* LIST */}

          <div className="p-4 space-y-2">

            {filteredIncidents.length === 0 ? (

              <div className="py-14 text-center">

                <CheckCircle2
                  size={30}
                  className="mx-auto text-emerald-400"
                />

                <p className="text-sm text-slate-500 mt-3">
                  No incidents found
                </p>

                <button
                  onClick={() => {

                    setSearch("");
                    setFilter("ALL");

                  }}
                  className="mt-3 text-xs text-red-600 hover:underline"
                >
                  Clear filters
                </button>

              </div>

            ) : (

              filteredIncidents.map(
                (incident) => (

                  <IncidentRow
                    key={incident.id}
                    incident={incident}
                    selected={
                      selectedIncident?.id ===
                      incident.id
                    }
                    onClick={() =>
                      selectIncident(
                        incident
                      )
                    }
                  />

                )
              )

            )}

          </div>

        </div>


        {/* ===================================================
            INCIDENT DETAILS
        ==================================================== */}

        <IncidentDetails
          incident={
            selectedIncident
          }
          onView={() =>
            setShowDetails(true)
          }
          onResolve={
            resolveIncident
          }
        />

      </div>


      {/* =====================================================
          MODAL
      ====================================================== */}

      {showDetails &&
        selectedIncident && (

          <IncidentModal
            incident={
              selectedIncident
            }
            onClose={() =>
              setShowDetails(false)
            }
            onResolve={
              resolveIncident
            }
          />

        )}

    </div>
  );
}


/* =========================================================
   KPI
========================================================= */

function IncidentKpi({
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


/* =========================================================
   INCIDENT ROW
========================================================= */

function IncidentRow({
  incident,
  selected,
  onClick,
}) {

  const severity =
    incident.severity || "MEDIUM";


  return (

    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition ${
        selected
          ? "bg-red-50/60 border-red-300 shadow-sm"
          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
      }`}
    >

      <div className="flex items-center gap-3">


        {/* ICON */}

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            severity === "CRITICAL"
              ? "bg-red-50"
              : severity === "HIGH"
              ? "bg-orange-50"
              : "bg-amber-50"
          }`}
        >

          <AlertTriangle
            size={18}
            className={
              getSeverityText(
                severity
              )
            }
          />

        </div>


        {/* INFO */}

        <div className="flex-1 min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <p className="text-xs font-semibold text-slate-900">
              {incident.type}
            </p>


            <span
              className={`text-[8px] px-2 py-1 rounded-full border font-medium ${getSeverityClass(
                severity
              )}`}
            >
              {severity}
            </span>


            <span
              className={`text-[8px] px-2 py-1 rounded-full border ${
                incident.status ===
                "RESOLVED"
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : "text-blue-700 bg-blue-50 border-blue-200"
              }`}
            >
              {incident.status}
            </span>

          </div>


          <div className="flex flex-wrap items-center gap-3 mt-2">

            <span className="text-[9px] text-slate-500">

              {incident.location ||
                "Operational Zone"}

            </span>


            <span className="text-slate-300">
              •
            </span>


            <span className="text-[9px] text-slate-400">

              {incident.road ||
                "Road unavailable"}

            </span>

          </div>

        </div>


        {/* SCORE */}

        <div className="text-right">

          <p className="text-[8px] uppercase text-slate-400">
            Risk
          </p>

          <p
            className={`text-sm font-bold mt-1 ${getSeverityText(
              severity
            )}`}
          >
            {getSeverityScore(
              severity
            )}
          </p>

        </div>

      </div>

    </button>
  );
}


/* =========================================================
   DETAILS
========================================================= */

function IncidentDetails({
  incident,
  onView,
  onResolve,
}) {

  if (!incident) {

    return (

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex items-center justify-center">

        <p className="text-sm text-slate-400">
          Select an incident
        </p>

      </div>

    );

  }


  const severity =
    incident.severity ||
    "MEDIUM";


  const riskScore =
    getSeverityScore(
      severity
    );


  return (

    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">


      {/* HEADER */}

      <div className="p-5 border-b border-slate-200">

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                severity === "CRITICAL"
                  ? "bg-red-50"
                  : severity === "HIGH"
                  ? "bg-orange-50"
                  : "bg-amber-50"
              }`}
            >

              <AlertTriangle
                size={21}
                className={
                  getSeverityText(
                    severity
                  )
                }
              />

            </div>


            <div>

              <p className="text-[9px] uppercase tracking-widest text-slate-400">
                Incident Intelligence
              </p>

              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {incident.type}
              </h2>

            </div>

          </div>


          <span
            className={`text-[8px] px-2.5 py-1 rounded-full border font-medium ${getSeverityClass(
              severity
            )}`}
          >
            {severity}
          </span>

        </div>

      </div>


      {/* CONTENT */}

      <div className="p-5">


        {/* RISK */}

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[9px] uppercase tracking-widest text-slate-400">
              Incident Risk
            </p>

            <p
              className={`text-3xl font-bold mt-1 ${getSeverityText(
                severity
              )}`}
            >
              {riskScore}

              <span className="text-sm text-slate-400">
                /100
              </span>

            </p>

          </div>


          <span className="text-[9px] text-slate-500">
            {incident.status}
          </span>

        </div>


        {/* RISK BAR */}

        <div className="h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">

          <div
            className={`h-full rounded-full ${
              severity === "CRITICAL"
                ? "bg-red-500"
                : severity === "HIGH"
                ? "bg-orange-500"
                : "bg-amber-500"
            }`}
            style={{
              width: `${riskScore}%`,
            }}
          />

        </div>


        {/* INFORMATION */}

        <DetailBox
          icon={MapPin}
          label="Location"
          value={
            incident.location ||
            "Operational Zone"
          }
        />


        <DetailBox
          icon={NavigationIcon}
          label="Affected Road"
          value={
            incident.road ||
            "Road information unavailable"
          }
        />


        <DetailBox
          icon={Clock3}
          label="Reported"
          value={
            incident.reportedAt
          }
        />


        <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">

          <p className="text-[9px] uppercase text-slate-400">
            Description
          </p>

          <p className="text-xs text-slate-600 mt-2 leading-5">
            {incident.description}
          </p>

        </div>


        {/* ACTION */}

        <button
          onClick={onView}
          className="w-full mt-4 py-2.5 rounded-xl bg-red-600 text-white text-[9px] font-semibold hover:bg-red-700 transition"
        >
          View Full Intelligence
        </button>


        {incident.status !==
          "RESOLVED" && (

          <button
            onClick={onResolve}
            className="w-full mt-2 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-medium hover:bg-emerald-100 transition"
          >
            Mark Incident Resolved
          </button>

        )}

      </div>

    </div>
  );
}


/* =========================================================
   DETAIL BOX
========================================================= */

function DetailBox({
  icon: Icon,
  label,
  value,
}) {

  return (

    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">

      <div className="flex items-center gap-2">

        <Icon
          size={13}
          className="text-slate-500"
        />

        <span className="text-[9px] uppercase text-slate-400">
          {label}
        </span>

      </div>


      <p className="text-xs font-medium text-slate-800 mt-2">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   NAVIGATION ICON
========================================================= */

function NavigationIcon(props) {

  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}


/* =========================================================
   MODAL
========================================================= */

function IncidentModal({
  incident,
  onClose,
  onResolve,
}) {

  const severity =
    incident.severity ||
    "MEDIUM";


  const score =
    getSeverityScore(
      severity
    );


  return (

    <div className="fixed inset-0 z-[7000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-5">

      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">


        {/* HEADER */}

        <div className="flex items-center justify-between p-5 border-b border-slate-200">

          <div className="flex items-center gap-3">

            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                severity === "CRITICAL"
                  ? "bg-red-50"
                  : "bg-orange-50"
              }`}
            >

              <AlertTriangle
                size={18}
                className={
                  getSeverityText(
                    severity
                  )
                }
              />

            </div>


            <div>

              <p className="text-[8px] uppercase tracking-widest text-slate-400">
                Incident Report
              </p>

              <h3 className="text-sm font-semibold text-slate-900 mt-1">
                {incident.id}
              </h3>

            </div>

          </div>


          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800"
          >

            <X size={14} />

          </button>

        </div>


        {/* BODY */}

        <div className="p-5">

          <div className="grid grid-cols-2 gap-3">

            <Metric
              label="Incident Type"
              value={incident.type}
              color="text-slate-900"
            />

            <Metric
              label="Risk Score"
              value={`${score}/100`}
              color={
                getSeverityText(
                  severity
                )
              }
            />

            <Metric
              label="Severity"
              value={severity}
              color={
                getSeverityText(
                  severity
                )
              }
            />

            <Metric
              label="Status"
              value={incident.status}
              color="text-blue-600"
            />

          </div>


          <div className="mt-4 space-y-2">

            <ReportLine
              label="Location"
              value={
                incident.location
              }
            />

            <ReportLine
              label="Affected Road"
              value={
                incident.road
              }
            />

            <ReportLine
              label="Reported"
              value={
                incident.reportedAt
              }
            />

          </div>


          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">

            <p className="text-[8px] uppercase tracking-widest text-slate-400">
              Intelligence Assessment
            </p>

            <p className="text-xs text-slate-600 mt-2 leading-5">

              {severity === "CRITICAL"
                ? "Critical incident requires immediate operational attention and route safety review."
                : severity === "HIGH"
                ? "High-priority incident should be monitored closely and may require route intervention."
                : "Incident is currently being monitored by the operational intelligence system."}

            </p>

          </div>


          {incident.status !==
            "RESOLVED" && (

            <button
              onClick={onResolve}
              className="w-full mt-4 py-2.5 rounded-xl bg-emerald-600 text-white text-[9px] font-semibold hover:bg-emerald-700 transition"
            >
              Mark Incident Resolved
            </button>

          )}


          <button
            onClick={onClose}
            className="w-full mt-2 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[9px] font-medium hover:bg-slate-50"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   METRIC
========================================================= */

function Metric({
  label,
  value,
  color,
}) {

  return (

    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

      <p className="text-[8px] uppercase text-slate-400">
        {label}
      </p>

      <p
        className={`text-sm font-bold mt-1 ${color}`}
      >
        {String(value || "—")}
      </p>

    </div>
  );
}


/* =========================================================
   REPORT LINE
========================================================= */

function ReportLine({
  label,
  value,
}) {

  return (

    <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200">

      <span className="text-[9px] text-slate-400">
        {label}
      </span>

      <span className="text-[9px] font-medium text-slate-700 text-right">
        {value || "Unavailable"}
      </span>

    </div>
  );
}


export default Incidents;
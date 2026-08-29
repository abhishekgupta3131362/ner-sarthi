import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Gauge,
  Map,
  Package,
  Route,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";

import { getRoutes, predictRoute } from "../services/api";

/* =========================================================
   ANALYTICS DATA
========================================================= */

const monthlyData = [
  {
    month: "MAR",
    deliveries: 182,
    incidents: 34,
    onTime: 88,
    distance: 12840,
  },
  {
    month: "APR",
    deliveries: 214,
    incidents: 29,
    onTime: 91,
    distance: 14320,
  },
  {
    month: "MAY",
    deliveries: 247,
    incidents: 41,
    onTime: 87,
    distance: 16140,
  },
  {
    month: "JUN",
    deliveries: 281,
    incidents: 36,
    onTime: 93,
    distance: 17890,
  },
  {
    month: "JUL",
    deliveries: 316,
    incidents: 31,
    onTime: 95,
    distance: 19420,
  },
  {
    month: "AUG",
    deliveries: 348,
    incidents: 24,
    onTime: 96,
    distance: 21360,
  },
];


const riskDistribution = [
  {
    label: "LOW",
    value: 58,
    color: "bg-emerald-400",
  },
  {
    label: "MEDIUM",
    value: 27,
    color: "bg-yellow-400",
  },
  {
    label: "HIGH",
    value: 11,
    color: "bg-orange-400",
  },
  {
    label: "CRITICAL",
    value: 4,
    color: "bg-red-400",
  },
];


/* =========================================================
   MAIN
========================================================= */

function Analytics() {

  const [period, setPeriod] =
    useState("6 MONTHS");

  const [activeMetric, setActiveMetric] =
    useState("deliveries");

  const [routePerformance, setRoutePerformance] = useState([]);
  
  useEffect(() => {
    let mounted = true;
    getRoutes().then(async (routes) => {
      if (!mounted) return;
      const performances = [];
      for (const r of routes) {
        try {
          const pred = await predictRoute(r.id);
          performances.push({
            name: r.name,
            score: Math.round(100 - pred.total_risk_score),
            time: `${Math.floor(r.estimated_duration_mins / 60)}h ${Math.floor(r.estimated_duration_mins % 60)}m`,
            distance: `${r.distance_km} km`,
            risk: pred.risk_level,
            weather: pred.weather_summary,
            delay: pred.predicted_delay_minutes
          });
        } catch (e) {
          console.error(e);
        }
      }
      if (mounted) {
        setRoutePerformance(performances);
      }
    });
    return () => { mounted = false; };
  }, []);


  const current =
    monthlyData[
      monthlyData.length - 1
    ];

  const previous =
    monthlyData[
      monthlyData.length - 2
    ];


  const deliveryGrowth =
    Math.round(
      ((current.deliveries -
        previous.deliveries) /
        previous.deliveries) *
        100
    );


  const incidentChange =
    Math.round(
      ((current.incidents -
        previous.incidents) /
        previous.incidents) *
        100
    );


  const averageOnTime =
    Math.round(
      monthlyData.reduce(
        (sum, item) =>
          sum + item.onTime,
        0
      ) /
        monthlyData.length
    );


  const maxDeliveries =
    Math.max(
      ...monthlyData.map(
        (item) =>
          item.deliveries
      )
    );


  const chartData = useMemo(
    () => {

      if (
        activeMetric ===
        "incidents"
      ) {
        return monthlyData.map(
          (item) => item.incidents
        );
      }

      if (
        activeMetric ===
        "onTime"
      ) {
        return monthlyData.map(
          (item) => item.onTime
        );
      }

      return monthlyData.map(
        (item) => item.deliveries
      );

    },
    [activeMetric]
  );


  return (

    <div className="p-6 min-h-screen bg-slate-950 text-white">


      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">

        <div>

          <div className="flex items-center gap-2">

            <span className="relative flex w-2 h-2">

              <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-60" />

              <span className="relative w-2 h-2 rounded-full bg-purple-400" />

            </span>

            <span className="text-[10px] uppercase tracking-[0.25em] text-purple-400">
              Decision Intelligence
            </span>

          </div>


          <h1 className="text-3xl font-bold mt-2">
            Operations Analytics
          </h1>


          <p className="text-sm text-slate-500 mt-2">
            Performance trends, route intelligence and predictive operational insights
          </p>

        </div>


        <div className="flex items-center gap-2">

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">

            <CalendarDays
              size={13}
              className="text-slate-500"
            />

            <select
              value={period}
              onChange={(e) =>
                setPeriod(
                  e.target.value
                )
              }
              className="bg-transparent text-[8px] text-slate-300 outline-none"
            >

              <option>
                7 DAYS
              </option>

              <option>
                30 DAYS
              </option>

              <option>
                6 MONTHS
              </option>

              <option>
                1 YEAR
              </option>

            </select>

          </div>


          <div className="px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">

            <span className="text-[8px] text-purple-400">
              AI MODEL
            </span>

            <span className="text-[8px] text-white ml-2">
              ACTIVE
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          KPI
      ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">

        <AnalyticsKpi
          icon={Truck}
          title="Deliveries"
          value={current.deliveries}
          trend={`+${deliveryGrowth}%`}
          text="vs previous month"
          color="text-blue-400"
        />

        <AnalyticsKpi
          icon={Clock3}
          title="On-Time Rate"
          value={`${current.onTime}%`}
          trend="+3.1%"
          text="operational efficiency"
          color="text-emerald-400"
        />

        <AnalyticsKpi
          icon={AlertTriangle}
          title="Incidents"
          value={current.incidents}
          trend={`${incidentChange}%`}
          text="vs previous month"
          color="text-orange-400"
          negative
        />

        <AnalyticsKpi
          icon={Route}
          title="Distance"
          value={`${(
            current.distance /
            1000
          ).toFixed(1)}k`}
          trend="+9.9%"
          text="km operated"
          color="text-purple-400"
        />

        <AnalyticsKpi
          icon={BrainCircuit}
          title="AI Accuracy"
          value="94.7%"
          trend="+2.4%"
          text="prediction confidence"
          color="text-cyan-400"
        />

      </div>


      {/* =====================================================
          MAIN ANALYTICS
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5">


        {/* ===================================================
            PERFORMANCE CHART
        ==================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <h2 className="font-semibold">
                Operational Performance
              </h2>

              <p className="text-xs text-slate-600 mt-1">
                Historical performance trend
              </p>

            </div>


            <div className="flex gap-2">

              <MetricButton
                label="Deliveries"
                active={
                  activeMetric ===
                  "deliveries"
                }
                onClick={() =>
                  setActiveMetric(
                    "deliveries"
                  )
                }
              />

              <MetricButton
                label="Incidents"
                active={
                  activeMetric ===
                  "incidents"
                }
                onClick={() =>
                  setActiveMetric(
                    "incidents"
                  )
                }
              />

              <MetricButton
                label="On-Time"
                active={
                  activeMetric ===
                  "onTime"
                }
                onClick={() =>
                  setActiveMetric(
                    "onTime"
                  )
                }
              />

            </div>

          </div>


          {/* CHART */}

          <div className="relative h-72 mt-8">

            {/* GRID */}

            <div className="absolute inset-0 flex flex-col justify-between">

              {[100, 75, 50, 25, 0].map(
                (value) => (

                  <div
                    key={value}
                    className="flex items-center gap-3"
                  >

                    <span className="w-7 text-right text-[7px] text-slate-700">
                      {activeMetric ===
                      "onTime"
                        ? `${value}%`
                        : Math.round(
                            (maxDeliveries *
                              value) /
                              100
                          )}
                    </span>

                    <div className="flex-1 border-t border-slate-800/70" />

                  </div>

                )
              )}

            </div>


            {/* BARS */}

            <div className="absolute left-10 right-0 bottom-0 top-0 flex items-end justify-around gap-3 px-3">

              {chartData.map(
                (value, index) => {

                  const max =
                    activeMetric ===
                    "onTime"
                      ? 100
                      : maxDeliveries;

                  const height =
                    (value / max) *
                    100;


                  return (

                    <div
                      key={
                        monthlyData[
                          index
                        ].month
                      }
                      className="h-full flex-1 flex flex-col justify-end items-center"
                    >

                      <div className="text-[7px] text-slate-500 mb-2">
                        {value}
                        {activeMetric ===
                        "onTime"
                          ? "%"
                          : ""}
                      </div>


                      <div
                        className={`w-full max-w-12 rounded-t-lg transition-all duration-500 ${
                          activeMetric ===
                          "incidents"
                            ? "bg-orange-400/70"
                            : activeMetric ===
                              "onTime"
                            ? "bg-emerald-400/70"
                            : "bg-blue-400/70"
                        }`}
                        style={{
                          height:
                            `${height}%`,
                        }}
                      />

                    </div>

                  );

                }
              )}

            </div>


            {/* MONTH LABELS */}

            <div className="absolute left-10 right-0 -bottom-5 flex justify-around">

              {monthlyData.map(
                (item) => (

                  <span
                    key={
                      item.month
                    }
                    className="text-[7px] text-slate-700"
                  >
                    {item.month}
                  </span>

                )
              )}

            </div>

          </div>

        </div>


        {/* ===================================================
            AI INSIGHT PANEL
        ==================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="p-5 border-b border-slate-800">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">

                <BrainCircuit
                  size={18}
                  className="text-purple-400"
                />

              </div>


              <div>

                <h2 className="font-semibold">
                  AI Decision Engine
                </h2>

                <p className="text-[8px] text-purple-400 mt-1">
                  REAL-TIME ANALYSIS
                </p>

              </div>

            </div>

          </div>


          <div className="p-5 space-y-3">

            <AiInsight
              icon={TrendingUp}
              title="Delivery Growth"
              text="Delivery volume increased significantly this month."
              color="text-emerald-400"
            />

            <AiInsight
              icon={TrendingDown}
              title="Incident Reduction"
              text="Operational incidents are trending downward despite higher delivery volume."
              color="text-cyan-400"
            />

            <AiInsight
              icon={ShieldAlert}
              title="Route Risk"
              text="Eastern corridor routes require additional monitoring during adverse weather."
              color="text-orange-400"
            />

            <AiInsight
              icon={Zap}
              title="Optimization Opportunity"
              text="Dynamic route allocation could reduce average travel distance by an estimated 8–12%."
              color="text-purple-400"
            />

          </div>


          <div className="mx-5 mb-5 p-4 rounded-xl bg-purple-500/[0.035] border border-purple-500/15">

            <p className="text-[7px] uppercase tracking-widest text-purple-400">
              Recommended Action
            </p>

            <p className="text-[9px] text-slate-400 leading-5 mt-2">
              Prioritize dynamic routing for high-risk
              corridors and redistribute vehicle capacity
              toward rising-demand zones.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          SECOND ROW
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">


        {/* ROUTE PERFORMANCE */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="font-semibold">
                Route Performance
              </h2>

              <p className="text-xs text-slate-600 mt-1">
                Efficiency and risk comparison
              </p>

            </div>


            <Map
              size={16}
              className="text-cyan-400"
            />

          </div>


          <div className="space-y-3 mt-5">

            {routePerformance.map(
              (route) => (

                <RouteRow
                  key={route.name}
                  route={route}
                />

              )
            )}

          </div>

        </div>


        {/* RISK DISTRIBUTION */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="font-semibold">
                Operational Risk Distribution
              </h2>

              <p className="text-xs text-slate-600 mt-1">
                Current route and incident exposure
              </p>

            </div>


            <Gauge
              size={16}
              className="text-orange-400"
            />

          </div>


          <div className="mt-7">

            <div className="flex h-4 rounded-full overflow-hidden">

              {riskDistribution.map(
                (item) => (

                  <div
                    key={item.label}
                    className={
                      item.color
                    }
                    style={{
                      width:
                        `${item.value}%`,
                    }}
                  />

                )
              )}

            </div>


            <div className="grid grid-cols-2 gap-4 mt-6">

              {riskDistribution.map(
                (item) => (

                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >

                    <div className="flex items-center gap-2">

                      <span
                        className={`w-2 h-2 rounded-full ${item.color}`}
                      />

                      <span className="text-[8px] text-slate-500">
                        {item.label}
                      </span>

                    </div>


                    <span className="text-xs font-semibold text-white">
                      {item.value}%
                    </span>

                  </div>

                )
              )}

            </div>

          </div>


          <div className="mt-7 p-4 bg-slate-950 border border-slate-800 rounded-xl">

            <div className="flex items-center gap-2">

              <ShieldAlert
                size={13}
                className="text-orange-400"
              />

              <span className="text-[8px] uppercase tracking-wider text-orange-400">
                Risk Observation
              </span>

            </div>


            <p className="text-[9px] text-slate-500 leading-5 mt-2">
              15% of the current network requires
              enhanced monitoring. Critical exposure remains
              below the intervention threshold.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          DECISION SUMMARY
      ====================================================== */}

      <div className="mt-5 bg-slate-900 border border-slate-800 rounded-2xl p-5">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">

            <Activity
              size={17}
              className="text-cyan-400"
            />

          </div>


          <div>

            <h2 className="font-semibold">
              Executive Decision Summary
            </h2>

            <p className="text-[8px] text-slate-600 mt-1">
              Key signals requiring operational attention
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <Decision
            number="01"
            title="Increase Capacity"
            text="Silchar and Kohima corridors require additional logistics capacity."
            color="border-red-500/20"
          />

          <Decision
            number="02"
            title="Optimize Routes"
            text="Dynamic route selection can reduce unnecessary travel distance."
            color="border-purple-500/20"
          />

          <Decision
            number="03"
            title="Maintain Readiness"
            text="Overall delivery performance remains above the operational target."
            color="border-emerald-500/20"
          />

        </div>

      </div>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="flex items-center justify-between mt-5 px-1">

        <div className="flex items-center gap-2">

          <span className="w-2 h-2 rounded-full bg-emerald-400" />

          <span className="text-[8px] text-slate-600">
            Analytics engine synchronized
          </span>

        </div>


        <span className="text-[8px] text-slate-700">
          Last calculation: 12 sec ago
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   KPI
========================================================= */

function AnalyticsKpi({
  icon: Icon,
  title,
  value,
  trend,
  text,
  color,
  negative,
}) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

      <div className="flex items-center justify-between">

        <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">

          <Icon
            size={16}
            className={color}
          />

        </div>


        <span
          className={`text-[8px] ${
            negative
              ? "text-orange-400"
              : "text-emerald-400"
          }`}
        >
          {trend}
        </span>

      </div>


      <p className="text-[8px] uppercase text-slate-600 mt-4">
        {title}
      </p>


      <p className="text-xl font-bold mt-1">
        {value}
      </p>


      <p className="text-[7px] text-slate-700 mt-1">
        {text}
      </p>

    </div>

  );
}


/* =========================================================
   METRIC BUTTON
========================================================= */

function MetricButton({
  label,
  active,
  onClick,
}) {

  return (

    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border text-[7px] transition ${
        active
          ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-400"
          : "bg-slate-950 border-slate-800 text-slate-600 hover:text-white"
      }`}
    >
      {label}
    </button>

  );
}


/* =========================================================
   AI INSIGHT
========================================================= */

function AiInsight({
  icon: Icon,
  title,
  text,
  color,
}) {

  return (

    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">

      <div className="flex items-center gap-2">

        <Icon
          size={13}
          className={color}
        />

        <span className="text-[9px] font-semibold text-white">
          {title}
        </span>

      </div>


      <p className="text-[8px] text-slate-600 leading-5 mt-2">
        {text}
      </p>

    </div>

  );
}


/* =========================================================
   ROUTE ROW
========================================================= */

function RouteRow({
  route,
}) {

  const riskColor =
    route.risk === "HIGH"
      ? "text-red-400"
      : route.risk === "MEDIUM"
      ? "text-orange-400"
      : "text-emerald-400";


  return (

    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">

      <div className="flex items-center justify-between">

        <span className="text-[9px] font-semibold text-white">
          {route.name}
        </span>

        <span
          className={`text-[7px] ${riskColor}`}
        >
          {route.risk}
        </span>

      </div>


      <div className="grid grid-cols-5 gap-3 mt-3">

        <div>

          <p className="text-[6px] text-slate-700 uppercase">
            Score
          </p>

          <p className="text-[9px] text-white mt-1">
            {route.score}%
          </p>

        </div>


        <div>

          <p className="text-[6px] text-slate-700 uppercase">
            Est. Time
          </p>

          <p className="text-[9px] text-slate-400 mt-1">
            {route.time}
          </p>

        </div>


        <div>

          <p className="text-[6px] text-slate-700 uppercase">
            Weather
          </p>

          <p className="text-[9px] text-slate-400 mt-1">
            {route.weather || "Stable"}
          </p>

        </div>

        <div>

          <p className="text-[6px] text-slate-700 uppercase">
            Pred. Delay
          </p>

          <p className="text-[9px] text-red-400 mt-1">
            {route.delay ? `+${route.delay}m` : "None"}
          </p>

        </div>


        <div>

          <p className="text-[6px] text-slate-700 uppercase">
            Distance
          </p>

          <p className="text-[9px] text-white mt-1">
            {route.distance}
          </p>

        </div>

      </div>


      <div className="h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">

        <div
          className={
            route.score >= 90
              ? "h-full bg-emerald-400"
              : route.score >= 80
              ? "h-full bg-yellow-400"
              : "h-full bg-red-400"
          }
          style={{
            width:
              `${route.score}%`,
          }}
        />

      </div>

    </div>

  );
}


/* =========================================================
   DECISION
========================================================= */

function Decision({
  number,
  title,
  text,
  color,
}) {

  return (

    <div
      className={`bg-slate-950 border ${color} rounded-xl p-4`}
    >

      <span className="font-mono text-[8px] text-slate-700">
        {number}
      </span>


      <h3 className="text-xs font-semibold text-white mt-3">
        {title}
      </h3>


      <p className="text-[8px] text-slate-600 leading-5 mt-2">
        {text}
      </p>

    </div>

  );
}


export default Analytics;
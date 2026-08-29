import { useState } from "react";

import {
  Warehouse,
  Package,
  Truck,
  AlertTriangle,
  Activity,
  MapPin,
  Thermometer,
  Droplets,
  Boxes,
  ShieldAlert,
  ChevronRight,
  Zap,
  X,
} from "lucide-react";


const warehouseData = [
  {
    id: "WH-001",
    name: "Guwahati Central Hub",
    location: "Guwahati, Assam",
    status: "OPERATIONAL",
    capacity: 72,
    stock: 81,
    inbound: 48,
    outbound: 67,
    critical: 2,
    temperature: "24°C",
    humidity: "61%",
    manager: "Arjun Sharma",
  },

  {
    id: "WH-002",
    name: "Tezpur Distribution Center",
    location: "Tezpur, Assam",
    status: "OPERATIONAL",
    capacity: 64,
    stock: 73,
    inbound: 31,
    outbound: 52,
    critical: 1,
    temperature: "23°C",
    humidity: "58%",
    manager: "Rahul Das",
  },

  {
    id: "WH-003",
    name: "Silchar Emergency Depot",
    location: "Silchar, Assam",
    status: "AT RISK",
    capacity: 88,
    stock: 91,
    inbound: 61,
    outbound: 82,
    critical: 7,
    temperature: "27°C",
    humidity: "76%",
    manager: "Amit Roy",
  },

  {
    id: "WH-004",
    name: "Shillong Regional Store",
    location: "Shillong, Meghalaya",
    status: "OPERATIONAL",
    capacity: 58,
    stock: 64,
    inbound: 26,
    outbound: 39,
    critical: 1,
    temperature: "19°C",
    humidity: "72%",
    manager: "Vikash Singh",
  },

  {
    id: "WH-005",
    name: "Kohima Relief Warehouse",
    location: "Kohima, Nagaland",
    status: "LIMITED",
    capacity: 94,
    stock: 87,
    inbound: 17,
    outbound: 73,
    critical: 5,
    temperature: "21°C",
    humidity: "68%",
    manager: "Manish Yadav",
  },
];


function Warehouses() {

  const [selectedWarehouse, setSelectedWarehouse] =
    useState(warehouseData[0]);

  const [showDetails, setShowDetails] =
    useState(false);


  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <div className="flex items-center gap-2">

            <span className="relative flex w-2 h-2">

              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />

              <span className="relative w-2 h-2 rounded-full bg-emerald-400" />

            </span>

            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-400">
              Supply Network
            </span>

          </div>


          <h1 className="text-3xl font-bold mt-2">
            Warehouse Command Center
          </h1>


          <p className="text-sm text-slate-500 mt-2">
            Real-time warehouse, inventory and supply-flow intelligence
          </p>

        </div>


        <div className="flex items-center gap-2">

          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">

            <span className="text-[8px] text-slate-600">
              NETWORK HEALTH
            </span>

            <span className="text-xs text-emerald-400 ml-2">
              96.2%
            </span>

          </div>


          <button
            onClick={() =>
              setShowDetails(!showDetails)
            }
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-[9px] font-bold hover:bg-emerald-400 transition"
          >
            {showDetails
              ? "Close Panel"
              : "Network Insights"}
          </button>

        </div>

      </div>


      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">

        <StatCard
          icon={Warehouse}
          title="Facilities"
          value="05"
          text="Active hubs"
          color="text-cyan-400"
        />

        <StatCard
          icon={Activity}
          title="Avg Capacity"
          value="75%"
          text="Network load"
          color="text-purple-400"
        />

        <StatCard
          icon={Boxes}
          title="Stock Level"
          value="79%"
          text="Availability"
          color="text-emerald-400"
        />

        <StatCard
          icon={Truck}
          title="Outbound"
          value="313"
          text="Loads today"
          color="text-blue-400"
        />

        <StatCard
          icon={ShieldAlert}
          title="Critical"
          value="16"
          text="Items affected"
          color="text-red-400"
        />

      </div>


      {/* =====================================================
          SUPPLY FLOW
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">

        <FlowCard
          icon={Package}
          title="Inbound Flow"
          value="183"
          text="Loads received"
          percentage={67}
          color="bg-blue-400"
        />

        <FlowCard
          icon={Truck}
          title="Outbound Flow"
          value="313"
          text="Loads dispatched"
          percentage={84}
          color="bg-emerald-400"
        />

        <FlowCard
          icon={AlertTriangle}
          title="Supply Risk"
          value="14%"
          text="Network exposure"
          percentage={14}
          color="bg-orange-400"
        />

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
            FACILITY NETWORK
        ==================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="font-semibold">
                Facility Network
              </h2>

              <p className="text-xs text-slate-600 mt-1">
                Click a facility to inspect operations
              </p>

            </div>


            <div className="flex items-center gap-2">

              <span className="w-2 h-2 rounded-full bg-emerald-400" />

              <span className="text-[8px] text-emerald-400">
                LIVE
              </span>

            </div>

          </div>


          <div className="space-y-3">

            {warehouseData.map(
              (warehouse) => (

                <WarehouseRow
                  key={warehouse.id}
                  warehouse={warehouse}
                  selected={
                    selectedWarehouse.id ===
                    warehouse.id
                  }
                  onClick={() => {

                    setSelectedWarehouse(
                      warehouse
                    );

                    setShowDetails(true);

                  }}
                />

              )
            )}

          </div>

        </div>


        {/* ===================================================
            DETAILS PANEL
        ==================================================== */}

        {showDetails && (

          <WarehouseDetails
            warehouse={selectedWarehouse}
            onClose={() =>
              setShowDetails(false)
            }
          />

        )}

      </div>


      {/* =====================================================
          AI INSIGHT
      ====================================================== */}

      <div className="mt-5 bg-purple-500/5 border border-purple-500/20 rounded-2xl p-5">

        <div className="flex items-center gap-2">

          <Zap
            size={16}
            className="text-purple-400"
          />

          <span className="text-sm font-semibold text-purple-300">
            AI Supply Network Recommendation
          </span>

        </div>


        <p className="text-xs text-slate-400 leading-5 mt-3 max-w-4xl">

          Silchar and Kohima are operating close to
          maximum capacity. The logistics engine recommends
          redirecting selected inbound loads toward Guwahati
          and Shillong to reduce congestion and maintain
          emergency inventory availability.

        </p>

      </div>

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

    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition">

      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">

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

    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">

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


      <div className="h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">

        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>

  );
}


/* =========================================================
   WAREHOUSE ROW
========================================================= */

function WarehouseRow({
  warehouse,
  selected,
  onClick,
}) {

  const statusClass =
    warehouse.status === "AT RISK"
      ? "text-red-400 bg-red-500/10 border-red-500/20"
      : warehouse.status === "LIMITED"
      ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
      : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";


  return (

    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition ${
        selected
          ? "bg-emerald-500/[0.04] border-emerald-500/30"
          : "bg-slate-950 border-slate-800 hover:border-slate-700"
      }`}
    >

      <div className="flex items-center gap-4">


        <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">

          <Warehouse
            size={17}
            className={
              selected
                ? "text-emerald-400"
                : "text-slate-500"
            }
          />

        </div>


        <div className="flex-1 min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="text-xs font-semibold text-white">
              {warehouse.name}
            </h3>


            <span
              className={`px-2 py-0.5 rounded border text-[7px] ${statusClass}`}
            >
              {warehouse.status}
            </span>

          </div>


          <div className="flex items-center gap-1 mt-1">

            <MapPin
              size={9}
              className="text-slate-700"
            />

            <span className="text-[8px] text-slate-600">
              {warehouse.location}
            </span>

          </div>


          <div className="mt-3">

            <div className="flex justify-between">

              <span className="text-[7px] text-slate-700 uppercase">
                Capacity
              </span>

              <span className="text-[8px] text-white">
                {warehouse.capacity}%
              </span>

            </div>


            <div className="h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">

              <div
                className={
                  warehouse.capacity >= 90
                    ? "h-full bg-red-400 rounded-full"
                    : warehouse.capacity >= 75
                    ? "h-full bg-orange-400 rounded-full"
                    : "h-full bg-emerald-400 rounded-full"
                }
                style={{
                  width:
                    `${warehouse.capacity}%`,
                }}
              />

            </div>

          </div>


          <div className="flex gap-6 mt-3">

            <Mini
              label="Stock"
              value={`${warehouse.stock}%`}
            />

            <Mini
              label="Inbound"
              value={warehouse.inbound}
            />

            <Mini
              label="Outbound"
              value={warehouse.outbound}
            />

            <Mini
              label="Critical"
              value={warehouse.critical}
            />

          </div>

        </div>


        <ChevronRight
          size={14}
          className={
            selected
              ? "text-emerald-400"
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

      <p className="text-[9px] text-white mt-1">
        {value}
      </p>

    </div>

  );
}


/* =========================================================
   DETAILS
========================================================= */

function WarehouseDetails({
  warehouse,
  onClose,
}) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">


      <div className="p-5 border-b border-slate-800 flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">

            <Warehouse
              size={17}
              className="text-emerald-400"
            />

          </div>


          <div>

            <p className="text-[7px] text-slate-700 uppercase">
              Facility
            </p>

            <h2 className="text-sm font-bold mt-1">
              {warehouse.name}
            </h2>

          </div>

        </div>


        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-slate-600 hover:text-white"
        >

          <X size={14} />

        </button>

      </div>


      <div className="p-5">


        {/* CAPACITY */}

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

          <div className="flex justify-between">

            <div>

              <p className="text-[7px] uppercase text-slate-700">
                Facility Utilization
              </p>

              <p className="text-2xl font-bold mt-1">
                {warehouse.capacity}%
              </p>

            </div>


            <Activity
              size={18}
              className={
                warehouse.capacity >= 90
                  ? "text-red-400"
                  : "text-emerald-400"
              }
            />

          </div>


          <div className="h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">

            <div
              className={
                warehouse.capacity >= 90
                  ? "h-full bg-red-400"
                  : warehouse.capacity >= 75
                  ? "h-full bg-orange-400"
                  : "h-full bg-emerald-400"
              }
              style={{
                width:
                  `${warehouse.capacity}%`,
              }}
            />

          </div>

        </div>


        {/* METRICS */}

        <div className="grid grid-cols-2 gap-3 mt-4">

          <Detail
            icon={Boxes}
            label="Stock"
            value={`${warehouse.stock}%`}
            color="text-purple-400"
          />

          <Detail
            icon={Package}
            label="Inbound"
            value={warehouse.inbound}
            color="text-blue-400"
          />

          <Detail
            icon={Truck}
            label="Outbound"
            value={warehouse.outbound}
            color="text-emerald-400"
          />

          <Detail
            icon={ShieldAlert}
            label="Critical"
            value={warehouse.critical}
            color="text-red-400"
          />

        </div>


        {/* ENVIRONMENT */}

        <div className="mt-5">

          <p className="text-[8px] uppercase tracking-wider text-slate-700">
            Environment
          </p>


          <div className="grid grid-cols-2 gap-3 mt-3">

            <Environment
              icon={Thermometer}
              label="Temperature"
              value={
                warehouse.temperature
              }
            />

            <Environment
              icon={Droplets}
              label="Humidity"
              value={
                warehouse.humidity
              }
            />

          </div>

        </div>


        {/* LOCATION */}

        <div className="relative h-28 mt-5 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(71,85,105,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(71,85,105,.15) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />


          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

            <div className="w-9 h-9 rounded-full border border-emerald-400 bg-emerald-400/10 flex items-center justify-center">

              <MapPin
                size={14}
                className="text-emerald-400"
              />

            </div>

          </div>


          <span className="absolute left-3 bottom-3 text-[7px] text-emerald-400 bg-slate-950/90 px-2 py-1 rounded">
            {warehouse.location}
          </span>

        </div>


        {/* MANAGER */}

        <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-3">

          <p className="text-[7px] uppercase text-slate-700">
            Facility Manager
          </p>

          <p className="text-xs font-semibold mt-1">
            {warehouse.manager}
          </p>

        </div>


        {/* AI */}

        <div className="mt-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">

          <div className="flex items-center gap-2">

            <Zap
              size={13}
              className="text-purple-400"
            />

            <span className="text-[8px] text-purple-400 uppercase tracking-wider">
              AI Recommendation
            </span>

          </div>


          <p className="text-[9px] text-slate-500 leading-5 mt-2">

            {warehouse.capacity >= 90
              ? "Redirect incoming loads to nearby facilities to prevent capacity saturation."
              : warehouse.critical >= 5
              ? "Critical inventory is elevated. Initiate replenishment from a regional hub."
              : "Facility is operating within healthy limits. Maintain current allocation."}

          </p>

        </div>


        {/* ACTIONS */}

        <div className="grid grid-cols-2 gap-2 mt-4">

          <button className="py-3 rounded-xl bg-emerald-500 text-slate-950 text-[9px] font-bold hover:bg-emerald-400 transition">
            Inventory
          </button>

          <button className="py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-[9px] hover:text-white transition">
            Dispatch
          </button>

        </div>

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

    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

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
   ENVIRONMENT
========================================================= */

function Environment({
  icon: Icon,
  label,
  value,
}) {

  return (

    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

      <Icon
        size={14}
        className="text-slate-500"
      />

      <p className="text-[7px] text-slate-700 mt-2">
        {label}
      </p>

      <p className="text-xs font-semibold mt-1">
        {value}
      </p>

    </div>

  );
}


export default Warehouses;
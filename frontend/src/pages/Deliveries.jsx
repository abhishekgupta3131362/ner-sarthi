import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Plus,
  Search,
  ShieldAlert,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";

/*
  Delivery Intelligence
  ---------------------
  Frontend-only functional version.

  Everything works locally with React state:
  - Search
  - Filters
  - Select delivery
  - New Delivery modal
  - Edit progress
  - Change status
  - Mark delivered
  - Mark delayed
  - Change priority
  - Assign vehicle
  - Update ETA
  - Cancel delivery
  - Toast feedback
*/

const initialDeliveries = [
  {
    id: "DEL-20481",
    from: "Guwahati",
    to: "Itanagar",
    status: "IN TRANSIT",
    progress: 78,
    risk: "LOW",
    eta: "42 min",
    distance: "348 km",
    vehicle: "TRK-101",
    driver: "Operator #0101",
    priority: "NORMAL",
    shipment: "Medical Supplies",
    sla: "On Track",
  },
  {
    id: "DEL-20482",
    from: "Jorhat",
    to: "Dibrugarh",
    status: "DELAYED",
    progress: 51,
    risk: "HIGH",
    eta: "1h 38m",
    distance: "121 km",
    vehicle: "TRK-104",
    driver: "Operator #0104",
    priority: "HIGH",
    shipment: "Emergency Equipment",
    sla: "Beyond SLA",
  },
  {
    id: "DEL-20483",
    from: "Siliguri",
    to: "Guwahati",
    status: "IN TRANSIT",
    progress: 63,
    risk: "MEDIUM",
    eta: "2h 05m",
    distance: "448 km",
    vehicle: "TRK-103",
    driver: "Operator #0103",
    priority: "NORMAL",
    shipment: "Food Supplies",
    sla: "On Track",
  },
  {
    id: "DEL-20484",
    from: "Shillong",
    to: "Silchar",
    status: "DELIVERED",
    progress: 100,
    risk: "LOW",
    eta: "Completed",
    distance: "290 km",
    vehicle: "TRK-102",
    driver: "Operator #0102",
    priority: "NORMAL",
    shipment: "Medical Kits",
    sla: "Delivered",
  },
  {
    id: "DEL-20485",
    from: "Tezpur",
    to: "Guwahati",
    status: "AT RISK",
    progress: 36,
    risk: "HIGH",
    eta: "3h 12m",
    distance: "181 km",
    vehicle: "TRK-105",
    driver: "Operator #0105",
    priority: "HIGH",
    shipment: "Relief Material",
    sla: "Risk Detected",
  },
];

const statusOptions = ["ALL", "IN TRANSIT", "DELIVERED", "DELAYED", "AT RISK"];

function Delivery() {
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [selectedId, setSelectedId] = useState(initialDeliveries[0].id);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [showNewDelivery, setShowNewDelivery] = useState(false);
  const [toast, setToast] = useState("");

  const selectedDelivery =
    deliveries.find((item) => item.id === selectedId) || deliveries[0] || null;

  const filteredDeliveries = useMemo(() => {
    const q = search.trim().toLowerCase();

    return deliveries.filter((item) => {
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.from.toLowerCase().includes(q) ||
        item.to.toLowerCase().includes(q) ||
        item.vehicle.toLowerCase().includes(q) ||
        item.shipment.toLowerCase().includes(q);

      const matchesFilter = filter === "ALL" || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [deliveries, search, filter]);

  const counts = {
    total: deliveries.length,
    transit: deliveries.filter((d) => d.status === "IN TRANSIT").length,
    delivered: deliveries.filter((d) => d.status === "DELIVERED").length,
    delayed: deliveries.filter((d) => d.status === "DELAYED").length,
    risk: deliveries.filter((d) => d.status === "AT RISK").length,
  };

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__deliveryToastTimer);
    window.__deliveryToastTimer = window.setTimeout(() => setToast(""), 2500);
  };

  const updateDelivery = (id, patch, message) => {
    setDeliveries((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
    if (message) showToast(message);
  };

  const markDelivered = () => {
    if (!selectedDelivery) return;
    updateDelivery(
      selectedDelivery.id,
      {
        status: "DELIVERED",
        progress: 100,
        eta: "Completed",
        risk: "LOW",
        sla: "Delivered",
      },
      `${selectedDelivery.id} marked as delivered`
    );
  };

  const markDelayed = () => {
    if (!selectedDelivery) return;
    updateDelivery(
      selectedDelivery.id,
      {
        status: "DELAYED",
        risk: "HIGH",
        sla: "Beyond SLA",
      },
      `${selectedDelivery.id} marked as delayed`
    );
  };

  const markAtRisk = () => {
    if (!selectedDelivery) return;
    updateDelivery(
      selectedDelivery.id,
      {
        status: "AT RISK",
        risk: "HIGH",
        sla: "Risk Detected",
      },
      `${selectedDelivery.id} flagged as at risk`
    );
  };

  const setInTransit = () => {
    if (!selectedDelivery) return;
    updateDelivery(
      selectedDelivery.id,
      {
        status: "IN TRANSIT",
        risk: selectedDelivery.risk === "HIGH" ? "HIGH" : "LOW",
        sla: "On Track",
      },
      `${selectedDelivery.id} is now in transit`
    );
  };

  const cancelDelivery = () => {
    if (!selectedDelivery) return;

    const confirmed = window.confirm(
      `Cancel ${selectedDelivery.id}? This will remove it from the active delivery list.`
    );

    if (!confirmed) return;

    setDeliveries((current) =>
      current.filter((item) => item.id !== selectedDelivery.id)
    );

    const next = deliveries.find((item) => item.id !== selectedDelivery.id);
    setSelectedId(next?.id || "");
    showToast(`${selectedDelivery.id} cancelled`);
  };

  return (
    <div className="p-6 min-h-full bg-slate-50 text-slate-900 space-y-5">
      <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-600">
              Logistics Operations • Live
            </span>
          </div>

          <h1 className="text-3xl font-bold mt-2">Delivery Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor shipments, delivery progress and SLA risk
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-sm text-slate-600">
            <Package size={14} className="inline mr-2 text-cyan-600" />
            {counts.total.toLocaleString()} Active Shipments
          </div>

          <button
            onClick={() => setShowNewDelivery(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition flex items-center gap-2"
          >
            <Plus size={14} />
            New Delivery
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard icon={Package} title="Total" value={counts.total} text="Active shipments" />
        <StatCard icon={Truck} title="In Transit" value={counts.transit} text="Currently moving" />
        <StatCard icon={CheckCircle2} title="Delivered" value={counts.delivered} text="Completed today" />
        <StatCard icon={Clock3} title="Delayed" value={counts.delayed} text="Beyond SLA" />
        <StatCard icon={ShieldAlert} title="At Risk" value={counts.risk} text="Needs attention" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] gap-5">
        <section className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="font-semibold">Delivery Pipeline</h2>
                <p className="text-[9px] text-slate-600 mt-1">
                  Click any shipment to inspect and control it
                </p>
              </div>

              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search delivery..."
                  className="w-full md:w-64 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pl-9 text-[10px] text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {statusOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-3 py-1.5 rounded-lg text-[8px] border transition ${
                    filter === item
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-2">
            {filteredDeliveries.length === 0 ? (
              <div className="py-16 text-center">
                <Package size={28} className="mx-auto text-slate-700" />
                <p className="text-xs text-slate-400 mt-3">No deliveries found</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("ALL");
                  }}
                  className="mt-3 text-[9px] text-emerald-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredDeliveries.map((delivery) => (
                <DeliveryRow
                  key={delivery.id}
                  delivery={delivery}
                  selected={delivery.id === selectedId}
                  onClick={() => setSelectedId(delivery.id)}
                />
              ))
            )}
          </div>
        </section>

        {selectedDelivery ? (
          <DeliveryDetails
            delivery={selectedDelivery}
            onProgress={(value) =>
              updateDelivery(
                selectedDelivery.id,
                {
                  progress: value,
                  status:
                    value >= 100 ? "DELIVERED" : "IN TRANSIT",
                  eta: value >= 100 ? "Completed" : selectedDelivery.eta,
                  sla: value >= 100 ? "Delivered" : "On Track",
                },
                `Progress updated to ${value}%`
              )
            }
            onDelivered={markDelivered}
            onDelayed={markDelayed}
            onAtRisk={markAtRisk}
            onInTransit={setInTransit}
            onCancel={cancelDelivery}
            onUpdate={(patch, message) =>
              updateDelivery(selectedDelivery.id, patch, message)
            }
          />
        ) : (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 flex items-center justify-center">
            <p className="text-xs text-slate-600">No delivery selected</p>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed right-6 bottom-6 z-[2000] bg-white border border-emerald-200 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span className="text-xs text-slate-700">{toast}</span>
        </div>
      )}

      {showNewDelivery && (
        <NewDeliveryModal
          onClose={() => setShowNewDelivery(false)}
          onCreate={(delivery) => {
            setDeliveries((current) => [delivery, ...current]);
            setSelectedId(delivery.id);
            setShowNewDelivery(false);
            showToast(`${delivery.id} created successfully`);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, title, value, text }) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 hover:border-slate-300 transition">
      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
        <Icon size={16} className="text-cyan-600" />
      </div>
      <p className="text-[8px] uppercase text-slate-600 mt-4">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
      <p className="text-[8px] text-slate-700 mt-1">{text}</p>
    </div>
  );
}

function DeliveryRow({ delivery, selected, onClick }) {
  const statusClass = {
    "IN TRANSIT": "text-blue-600 bg-blue-50 border-blue-200",
    DELIVERED: "text-emerald-600 bg-emerald-50 border-emerald-200",
    DELAYED: "text-orange-600 bg-orange-500/10 border-orange-500/20",
    "AT RISK": "text-red-600 bg-red-50 border-red-200",
  }[delivery.status];

  const riskClass = {
    LOW: "text-emerald-600",
    MEDIUM: "text-yellow-600",
    HIGH: "text-red-600",
  }[delivery.risk];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition ${
        selected
          ? "bg-emerald-50 border-emerald-200"
          : "bg-slate-50 border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            selected ? "bg-emerald-50" : "bg-white"
          }`}
        >
          <Package
            size={17}
            className={selected ? "text-emerald-600" : "text-slate-400"}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold text-slate-900">{delivery.id}</p>
            <span className={`text-[7px] px-1.5 py-0.5 rounded border ${statusClass}`}>
              {delivery.status}
            </span>
          </div>

          <p className="text-[9px] text-slate-600 mt-1">
            {delivery.from} <ArrowRight size={9} className="inline mx-1" /> {delivery.to}
          </p>

          <div className="mt-3">
            <div className="flex justify-between">
              <span className="text-[7px] uppercase text-slate-700">
                Delivery Progress
              </span>
              <span className="text-[8px] text-slate-400">
                {delivery.progress}%
              </span>
            </div>

            <div className="h-1.5 bg-slate-50 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  delivery.status === "DELAYED" || delivery.status === "AT RISK"
                    ? "bg-orange-400"
                    : "bg-emerald-400"
                }`}
                style={{ width: `${delivery.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[7px] uppercase text-slate-700">Risk</p>
          <p className={`text-xs font-bold mt-1 ${riskClass}`}>{delivery.risk}</p>
          <p className="text-[7px] text-slate-600 mt-2">ETA {delivery.eta}</p>
        </div>
      </div>
    </button>
  );
}

function DeliveryDetails({
  delivery,
  onProgress,
  onDelivered,
  onDelayed,
  onAtRisk,
  onInTransit,
  onCancel,
  onUpdate,
}) {
  const progress = delivery.progress;

  return (
    <aside className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex items-start justify-between">
        <div>
          <p className="text-[8px] uppercase tracking-widest text-slate-600">
            Selected Delivery
          </p>
          <h2 className="text-xl font-bold mt-1">{delivery.id}</h2>
        </div>

        <span className="px-2 py-1 rounded-full text-[7px] text-emerald-600 bg-emerald-50 border border-emerald-200">
          {delivery.status}
        </span>
      </div>

      <div className="p-5">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-[7px] uppercase tracking-wider text-slate-600">
            Logistics Corridor
          </p>

          <div className="flex items-center gap-3 mt-5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <MapPin size={14} className="text-emerald-600" />
            </div>

            <div className="flex-1">
              <div className="h-1 bg-slate-50 rounded-full relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-emerald-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <MapPin size={14} className="text-red-600" />
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <span className="text-[8px] text-slate-400">{delivery.from}</span>
            <span className="text-[8px] text-slate-400">{delivery.to}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <span className="text-[8px] text-slate-600">Completion</span>
            <span className="text-[9px] text-emerald-600 font-semibold">
              {progress}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => onProgress(Number(e.target.value))}
            className="w-full mt-3 accent-emerald-400 cursor-pointer"
          />

          <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert
                size={15}
                className={
                  delivery.risk === "HIGH"
                    ? "text-red-600"
                    : delivery.risk === "MEDIUM"
                    ? "text-yellow-600"
                    : "text-emerald-600"
                }
              />
              <span className="text-xs">Delivery Risk</span>
            </div>

            <span
              className={`text-[9px] font-bold ${
                delivery.risk === "HIGH"
                  ? "text-red-600"
                  : delivery.risk === "MEDIUM"
                  ? "text-yellow-600"
                  : "text-emerald-600"
              }`}
            >
              {delivery.risk}
            </span>
          </div>

          <div className="h-2 bg-slate-50 rounded-full mt-3">
            <div
              className={`h-full rounded-full ${
                delivery.risk === "HIGH"
                  ? "bg-red-400"
                  : delivery.risk === "MEDIUM"
                  ? "bg-yellow-400"
                  : "bg-emerald-400"
              }`}
              style={{
                width:
                  delivery.risk === "HIGH"
                    ? "82%"
                    : delivery.risk === "MEDIUM"
                    ? "52%"
                    : "22%",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <InfoBox icon={Clock3} label="ETA" value={delivery.eta} />
          <InfoBox icon={MapPin} label="Distance" value={delivery.distance} />
          <InfoBox icon={Truck} label="Vehicle" value={delivery.vehicle} />
          <InfoBox icon={User} label="Driver" value={delivery.driver} />
        </div>

        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-[8px] uppercase text-slate-600">Shipment</p>
          <p className="text-xs text-slate-700 mt-1">{delivery.shipment}</p>

          <p className="text-[8px] uppercase text-slate-600 mt-4">SLA Status</p>
          <p
            className={`text-xs mt-1 ${
              delivery.sla === "Delivered" || delivery.sla === "On Track"
                ? "text-emerald-600"
                : "text-orange-600"
            }`}
          >
            {delivery.sla}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-[8px] uppercase text-slate-600 mb-2">
            Priority
          </p>

          <div className="grid grid-cols-3 gap-2">
            {["LOW", "NORMAL", "HIGH"].map((priority) => (
              <button
                key={priority}
                onClick={() =>
                  onUpdate(
                    { priority },
                    `${delivery.id} priority changed to ${priority}`
                  )
                }
                className={`py-2 rounded-lg text-[8px] border ${
                  delivery.priority === priority
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={onDelivered}
            disabled={delivery.status === "DELIVERED"}
            className="py-2.5 rounded-lg bg-emerald-500 text-slate-950 text-[9px] font-bold disabled:opacity-40 hover:bg-emerald-400 transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={12} />
            Mark Delivered
          </button>

          <button
            onClick={onInTransit}
            disabled={delivery.status === "IN TRANSIT"}
            className="py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[9px] hover:border-blue-200 transition"
          >
            Set In Transit
          </button>

          <button
            onClick={onDelayed}
            disabled={delivery.status === "DELAYED"}
            className="py-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 text-[9px] hover:bg-orange-500/15 transition flex items-center justify-center gap-2"
          >
            <Clock3 size={12} />
            Mark Delayed
          </button>

          <button
            onClick={onAtRisk}
            disabled={delivery.status === "AT RISK"}
            className="py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[9px] hover:bg-red-500/15 transition flex items-center justify-center gap-2"
          >
            <AlertCircle size={12} />
            Flag At Risk
          </button>
        </div>

        <button
          onClick={() =>
            onUpdate(
              {
                eta:
                  delivery.eta === "15 min"
                    ? "42 min"
                    : "15 min",
              },
              `${delivery.id} ETA updated`
            )
          }
          className="w-full mt-2 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 text-[9px] hover:bg-cyan-500/15 transition flex items-center justify-center gap-2"
        >
          <Zap size={12} />
          Update ETA
        </button>

        <button
          onClick={onCancel}
          className="w-full mt-2 py-2.5 rounded-lg bg-slate-50 border border-red-500/10 text-slate-600 hover:text-red-600 text-[9px] transition"
        >
          Cancel Delivery
        </button>
      </div>
    </aside>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
      <Icon size={12} className="text-slate-600" />
      <p className="text-[7px] uppercase text-slate-700 mt-2">{label}</p>
      <p className="text-xs font-semibold mt-1 break-words">{value}</p>
    </div>
  );
}

function NewDeliveryModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    from: "",
    to: "",
    vehicle: "",
    driver: "",
    shipment: "",
    distance: "",
    eta: "2h",
    priority: "NORMAL",
  });

  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (!form.from || !form.to || !form.vehicle || !form.shipment) {
      setError("Please fill source, destination, vehicle and shipment.");
      return;
    }

    const id = `DEL-${20486 + Math.floor(Math.random() * 100)}`;

    onCreate({
      id,
      from: form.from,
      to: form.to,
      status: "IN TRANSIT",
      progress: 0,
      risk: form.priority === "HIGH" ? "MEDIUM" : "LOW",
      eta: form.eta || "2h",
      distance: form.distance || "—",
      vehicle: form.vehicle,
      driver: form.driver || "Unassigned",
      priority: form.priority,
      shipment: form.shipment,
      sla: "On Track",
    });
  };

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="fixed inset-0 z-[3000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-2xl bg-white border border-slate-200 shadow-sm rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-widest text-emerald-600">
              Logistics Control
            </p>
            <h2 className="text-lg font-bold mt-1">Create New Delivery</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Source">
            <input value={form.from} onChange={(e) => set("from", e.target.value)} placeholder="Guwahati" />
          </Field>

          <Field label="Destination">
            <input value={form.to} onChange={(e) => set("to", e.target.value)} placeholder="Itanagar" />
          </Field>

          <Field label="Vehicle ID">
            <input value={form.vehicle} onChange={(e) => set("vehicle", e.target.value)} placeholder="TRK-106" />
          </Field>

          <Field label="Driver">
            <input value={form.driver} onChange={(e) => set("driver", e.target.value)} placeholder="Operator #0106" />
          </Field>

          <Field label="Shipment">
            <input value={form.shipment} onChange={(e) => set("shipment", e.target.value)} placeholder="Medical Supplies" />
          </Field>

          <Field label="Distance">
            <input value={form.distance} onChange={(e) => set("distance", e.target.value)} placeholder="250 km" />
          </Field>

          <Field label="ETA">
            <input value={form.eta} onChange={(e) => set("eta", e.target.value)} placeholder="2h 30m" />
          </Field>

          <Field label="Priority">
            <select value={form.priority} onChange={(e) => set("priority", e.target.value)}>
              <option>LOW</option>
              <option>NORMAL</option>
              <option>HIGH</option>
            </select>
          </Field>

          {error && (
            <div className="md:col-span-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-400"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400"
          >
            Create Delivery
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[8px] uppercase text-slate-600">{label}</span>
      <div className="mt-1 [&>input]:w-full [&>input]:bg-slate-50 [&>input]:border [&>input]:border-slate-200 [&>input]:rounded-lg [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-xs [&>input]:text-slate-800 [&>input]:outline-none [&>input]:focus:border-emerald-500 [&>select]:w-full [&>select]:bg-slate-50 [&>select]:border [&>select]:border-slate-200 [&>select]:rounded-lg [&>select]:px-3 [&>select]:py-2.5 [&>select]:text-xs [&>select]:text-slate-800 [&>select]:outline-none">
        {children}
      </div>
    </label>
  );
}

export default Delivery;
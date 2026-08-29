import { useState } from "react";

import {
  MapPin,
  Truck,
  ShieldAlert,
  Navigation,
  ArrowDownUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  locations,
  vehicles,
} from "../../mock/routeData";


function RouteForm({
  formData,
  setFormData,
  onOptimize,
}) {

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);


  /* =========================================================
     UPDATE FIELD
  ========================================================= */

  const updateField = (field, value) => {

    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSubmitted(false);

  };


  /* =========================================================
     SWAP SOURCE / DESTINATION
  ========================================================= */

  const handleSwap = () => {

    setFormData((current) => ({
      ...current,
      source: current.destination,
      destination: current.source,
    }));

    setError("");
    setSubmitted(false);

  };


  /* =========================================================
     VALIDATE + OPTIMIZE
  ========================================================= */

  const handleOptimize = () => {

    setError("");
    setSubmitted(false);


    /* SOURCE */

    if (!formData?.source) {

      setError(
        "Please select a source location."
      );

      return;

    }


    /* DESTINATION */

    if (!formData?.destination) {

      setError(
        "Please select a destination."
      );

      return;

    }


    /* SAME LOCATION */

    if (
      formData.source ===
      formData.destination
    ) {

      setError(
        "Source and destination cannot be the same."
      );

      return;

    }


    /* VEHICLE */

    if (!formData?.vehicle) {

      setError(
        "Please select a vehicle."
      );

      return;

    }


    /* PRIORITY */

    if (!formData?.priority) {

      setError(
        "Please select cargo priority."
      );

      return;

    }


    /* RISK PREFERENCE */

    if (!formData?.riskPreference) {

      setError(
        "Please select a risk preference."
      );

      return;

    }


    /* =====================================================
       CREATE OPTIMIZATION REQUEST
    ===================================================== */

    const optimizationRequest = {

      ...formData,

      sourceLocation:
        locations.find(
          (location) =>
            location.id ===
            formData.source
        ) || null,

      destinationLocation:
        locations.find(
          (location) =>
            location.id ===
            formData.destination
        ) || null,

      vehicleDetails:
        vehicles.find(
          (vehicle) =>
            vehicle.id ===
            formData.vehicle
        ) || null,

      requestedAt:
        new Date().toISOString(),

    };


    console.log(
      "Route optimization request:",
      optimizationRequest
    );


    /* =====================================================
       SAVE LAST REQUEST
    ===================================================== */

    localStorage.setItem(
      "routeOptimizationRequest",
      JSON.stringify(
        optimizationRequest
      )
    );


    setSubmitted(true);


    /* =====================================================
       SEND TO PARENT
    ===================================================== */

    if (onOptimize) {

      onOptimize(
        optimizationRequest
      );

    }

  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center gap-3 mb-6">

        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">

          <Navigation
            size={19}
            className="text-emerald-400"
          />

        </div>


        <div>

          <h3 className="text-white font-semibold">
            Plan New Route
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Configure your delivery requirements
          </p>

        </div>

      </div>


      {/* =====================================================
          SOURCE
      ====================================================== */}

      <div className="mb-4">

        <label className="block text-xs text-slate-500 mb-2">
          Source
        </label>


        <div className="relative">

          <MapPin
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 z-10"
          />


          <select
            value={formData?.source || ""}
            onChange={(e) =>
              updateField(
                "source",
                e.target.value
              )
            }
            className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-emerald-500 transition"
          >

            <option value="">
              Select source
            </option>


            {locations.map(
              (location) => (

                <option
                  key={location.id}
                  value={location.id}
                >
                  {location.name}
                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* =====================================================
          SWAP BUTTON
      ====================================================== */}

      <div className="flex justify-center -my-1 relative z-10">

        <button
          type="button"
          onClick={handleSwap}
          disabled={
            !formData?.source &&
            !formData?.destination
          }
          title="Swap source and destination"
          className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/40 disabled:opacity-40 transition flex items-center justify-center"
        >

          <ArrowDownUp
            size={13}
          />

        </button>

      </div>


      {/* =====================================================
          DESTINATION
      ====================================================== */}

      <div className="mb-5">

        <label className="block text-xs text-slate-500 mb-2">
          Destination
        </label>


        <div className="relative">

          <MapPin
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 z-10"
          />


          <select
            value={
              formData?.destination ||
              ""
            }
            onChange={(e) =>
              updateField(
                "destination",
                e.target.value
              )
            }
            className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-emerald-500 transition"
          >

            <option value="">
              Select destination
            </option>


            {locations.map(
              (location) => (

                <option
                  key={location.id}
                  value={location.id}
                >
                  {location.name}
                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* =====================================================
          SELECTED ROUTE INFO
      ====================================================== */}

      {formData?.source &&
        formData?.destination && (
          <div className="mb-5 bg-slate-950 border border-slate-800 rounded-xl p-3">

            <div className="flex items-center gap-2">

              <CheckCircle2
                size={13}
                className="text-emerald-400"
              />

              <span className="text-[9px] uppercase tracking-wider text-emerald-400">
                Route endpoints selected
              </span>

            </div>

          </div>
        )}


      {/* =====================================================
          VEHICLE
      ====================================================== */}

      <div className="mb-5">

        <label className="block text-xs text-slate-500 mb-2">
          Vehicle
        </label>


        <div className="relative">

          <Truck
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 z-10"
          />


          <select
            value={
              formData?.vehicle ||
              ""
            }
            onChange={(e) =>
              updateField(
                "vehicle",
                e.target.value
              )
            }
            className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-emerald-500 transition"
          >

            <option value="">
              Select vehicle
            </option>


            {vehicles.map(
              (vehicle) => (

                <option
                  key={vehicle.id}
                  value={vehicle.id}
                >
                  {vehicle.name} —{" "}
                  {vehicle.capacity}
                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* =====================================================
          CARGO PRIORITY
      ====================================================== */}

      <div className="mb-5">

        <label className="block text-xs text-slate-500 mb-2">
          Cargo Priority
        </label>


        <div className="grid grid-cols-3 gap-2">

          {[
            ["normal", "Normal"],
            ["important", "Important"],
            ["critical", "Critical"],
          ].map(
            ([value, label]) => (

              <button
                key={value}
                type="button"
                onClick={() =>
                  updateField(
                    "priority",
                    value
                  )
                }
                className={`py-2.5 rounded-lg text-xs border transition ${
                  formData?.priority ===
                  value
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                    : "bg-slate-950 border-slate-800 text-slate-500 hover:text-white hover:border-slate-700"
                }`}
              >

                {label}

              </button>

            )
          )}

        </div>

      </div>


      {/* =====================================================
          RISK PREFERENCE
      ====================================================== */}

      <div className="mb-5">

        <label className="block text-xs text-slate-500 mb-2">
          Risk Preference
        </label>


        <div className="grid grid-cols-3 gap-2">

          {[
            ["fastest", "Fastest"],
            ["balanced", "Balanced"],
            ["safest", "Safest"],
          ].map(
            ([value, label]) => (

              <button
                key={value}
                type="button"
                onClick={() =>
                  updateField(
                    "riskPreference",
                    value
                  )
                }
                className={`py-2.5 rounded-lg text-xs border transition ${
                  formData?.riskPreference ===
                  value
                    ? "bg-blue-500/10 border-blue-500/40 text-blue-400"
                    : "bg-slate-950 border-slate-800 text-slate-500 hover:text-white hover:border-slate-700"
                }`}
              >

                {label}

              </button>

            )
          )}

        </div>

      </div>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">

          <AlertCircle
            size={15}
            className="text-red-400 shrink-0 mt-0.5"
          />

          <p className="text-xs text-red-400 leading-5">
            {error}
          </p>

        </div>

      )}


      {/* =====================================================
          SUCCESS
      ====================================================== */}

      {submitted && !error && (

        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">

          <CheckCircle2
            size={15}
            className="text-emerald-400"
          />

          <p className="text-xs text-emerald-400">
            Route optimization started successfully.
          </p>

        </div>

      )}


      {/* =====================================================
          OPTIMIZE BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={handleOptimize}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-semibold text-sm transition"
      >

        <ShieldAlert
          size={17}
        />

        Optimize Route

      </button>


      {/* =====================================================
          HELP TEXT
      ====================================================== */}

      <p className="text-center text-[8px] text-slate-700 mt-3">
        Select source, destination, vehicle and preferences
        before optimizing.
      </p>

    </div>

  );
}


export default RouteForm;
import { useState } from "react";

import {
  Navigation,
  MapPin,
  Route,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

import { getRoutes } from "../../services/routingService";

import {
  calculateRouteRisk,
} from "../../services/riskEngine";

import RouteRiskCard from "./RouteRiskCard";

import RouteComparison from "./RouteComparison";

import {
  findBestRoute,
} from "../../services/routeOptimizer";


/* =========================================================
   ROUTE PLANNER
========================================================= */

function RoutePlanner({
  onRouteFound,
  onRouteAssigned,
}) {

  /* =======================================================
     START
  ======================================================= */

  const [start, setStart] = useState({
    lat: "26.1445",
    lng: "91.7362",
  });


  /* =======================================================
     DESTINATION
  ======================================================= */

  const [destination, setDestination] =
    useState({
      lat: "26.6338",
      lng: "92.8000",
    });


  /* =======================================================
     STATES
  ======================================================= */

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [routeInfo, setRouteInfo] =
    useState(null);

  const [optimization, setOptimization] =
    useState(null);

  const [assignedRoute, setAssignedRoute] =
    useState(null);

  const [previewRoute, setPreviewRoute] =
    useState(null);


  /* =========================================================
     UPDATE START
  ========================================================= */

  const updateStart = (
    field,
    value
  ) => {

    setStart((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");

  };


  /* =========================================================
     UPDATE DESTINATION
  ========================================================= */

  const updateDestination = (
    field,
    value
  ) => {

    setDestination((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");

  };


  /* =========================================================
     VALIDATE COORDINATES
  ========================================================= */

  const validateCoordinates = () => {

    const startLat =
      Number(start.lat);

    const startLng =
      Number(start.lng);

    const destinationLat =
      Number(destination.lat);

    const destinationLng =
      Number(destination.lng);


    if (
      !Number.isFinite(startLat) ||
      !Number.isFinite(startLng) ||
      !Number.isFinite(destinationLat) ||
      !Number.isFinite(destinationLng)
    ) {

      return {
        valid: false,
        message:
          "Please enter valid numeric coordinates.",
      };

    }


    /* Latitude */

    if (
      startLat < -90 ||
      startLat > 90 ||
      destinationLat < -90 ||
      destinationLat > 90
    ) {

      return {
        valid: false,
        message:
          "Latitude must be between -90 and 90.",
      };

    }


    /* Longitude */

    if (
      startLng < -180 ||
      startLng > 180 ||
      destinationLng < -180 ||
      destinationLng > 180
    ) {

      return {
        valid: false,
        message:
          "Longitude must be between -180 and 180.",
      };

    }


    /* Same point */

    if (
      startLat === destinationLat &&
      startLng === destinationLng
    ) {

      return {
        valid: false,
        message:
          "Starting point and destination cannot be the same.",
      };

    }


    return {
      valid: true,

      startPoint: [
        startLat,
        startLng,
      ],

      destinationPoint: [
        destinationLat,
        destinationLng,
      ],
    };

  };


  /* =========================================================
     CREATE RISK FOR ROUTE
  ========================================================= */

  const createRouteRisk = (
    route,
    index
  ) => {

    /*
      Different temporary risk
      inputs for demonstration.

      Later these values can come
      from real incident/weather APIs.
    */

    const weatherRisk =
      index === 0
        ? 20
        : index === 1
        ? 10
        : 5;


    const roadRisk =
      index === 0
        ? 15
        : index === 1
        ? 8
        : 5;


    return calculateRouteRisk({

      distance:
        route.distance,

      duration:
        route.duration,

      incidents: [],

      weatherRisk,

      roadRisk,

    });

  };


  /* =========================================================
     BUILD ROUTES
  ========================================================= */

  const buildRoutes = (
    realRoutes
  ) => {

    return realRoutes.map(
      (route, index) => {

        const risk =
          createRouteRisk(
            route,
            index
          );


        let routeName =
          "Alternative Route";


        if (index === 0) {

          routeName =
            "Fastest Route";

        } else if (index === 1) {

          routeName =
            "Safer Alternative";

        } else if (index === 2) {

          routeName =
            "Low Risk Alternative";

        } else {

          routeName =
            `Alternative Route ${index}`;

        }


        return {

          ...route,

          id:
            route.id ||
            `ROUTE-${index + 1}`,

          name:
            routeName,

          risk,

        };

      }
    );

  };


  /* =========================================================
     CALCULATE ROUTE
  ========================================================= */

  const handleCalculate = async () => {

    setError("");

    setLoading(true);

    setRouteInfo(null);

    setOptimization(null);

    setAssignedRoute(null);

    setPreviewRoute(null);


    try {

      /* =====================================================
         VALIDATION
      ===================================================== */

      const validation =
        validateCoordinates();


      if (!validation.valid) {

        throw new Error(
          validation.message
        );

      }


      const {
        startPoint,
        destinationPoint,
      } = validation;


      console.log(
        "START:",
        startPoint
      );

      console.log(
        "DESTINATION:",
        destinationPoint
      );


      /* =====================================================
         GET REAL ROUTES
      ===================================================== */

      const routingResult =
        await getRoutes(
          startPoint,
          destinationPoint
        );


      if (
        !routingResult ||
        !routingResult.routes ||
        routingResult.routes.length === 0
      ) {

        throw new Error(
          "No routes were returned by routing service."
        );

      }


      console.log(
        "REAL ROUTES:",
        routingResult.routes
      );


      /* =====================================================
         BUILD ROUTES WITH RISK
      ===================================================== */

      const routes =
        buildRoutes(
          routingResult.routes
        );


      /* =====================================================
         OPTIMIZE
      ===================================================== */

      const optimized =
        findBestRoute(
          routes
        );


      if (
        !optimized ||
        !optimized.bestRoute
      ) {

        throw new Error(
          "Unable to determine the best route."
        );

      }


      console.log(
        "OPTIMIZATION:",
        optimized
      );


      /* =====================================================
         PRIMARY ROUTE
      ===================================================== */

      const primaryRoute =
        routes[0];


      setRouteInfo(
        primaryRoute
      );


      setOptimization({
        ...optimized,

        routes,

        bestRoute:
          optimized.bestRoute,

      });


      /* =====================================================
         SHOW BEST ROUTE ON MAP
      ===================================================== */

      setPreviewRoute(
        optimized.bestRoute
      );


      if (onRouteFound) {

        onRouteFound(
          optimized.bestRoute
        );

      }

    } catch (err) {

      console.error(
        "Route calculation error:",
        err
      );


      setError(
        err?.message ||
        "Unable to calculate route."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     PREVIEW ROUTE
  ========================================================= */

  const handleRoutePreview = (
    route
  ) => {

    if (!route) {
      return;
    }


    console.log(
      "PREVIEW ROUTE:",
      route
    );


    setPreviewRoute(
      route
    );


    if (onRouteFound) {

      onRouteFound(
        route
      );

    }

  };


  /* =========================================================
     ASSIGN ROUTE
  ========================================================= */

  const handleRouteAssigned = (
    route
  ) => {

    if (!route) {
      return;
    }


    console.log(
      "ASSIGNING ROUTE:",
      route
    );


    const assigned = {

      ...route,

      assignedAt:
        new Date().toISOString(),

      status:
        "ASSIGNED",

    };


    setAssignedRoute(
      assigned
    );


    setPreviewRoute(
      assigned
    );


    /* =====================================================
       LOCAL STORAGE
    ===================================================== */

    localStorage.setItem(

      "assignedRoute",

      JSON.stringify(
        assigned
      )

    );


    /* =====================================================
       MAP
    ===================================================== */

    if (onRouteFound) {

      onRouteFound(
        assigned
      );

    }


    /* =====================================================
       PARENT
    ===================================================== */

    if (onRouteAssigned) {

      onRouteAssigned(
        assigned
      );

    }

  };


  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {

    setRouteInfo(null);

    setOptimization(null);

    setAssignedRoute(null);

    setPreviewRoute(null);

    setError("");

  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="space-y-4">


      {/* =====================================================
          MAIN PLANNER
      ===================================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">


        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">

              <Route
                size={18}
                className="text-emerald-400"
              />

            </div>


            <div>

              <h3 className="text-white font-semibold">
                Smart Route Planner
              </h3>


              <p className="text-xs text-slate-500 mt-1">
                AI-assisted route planning and risk analysis
              </p>

            </div>

          </div>


          {(routeInfo || optimization) && (

            <button
              type="button"
              onClick={
                handleReset
              }
              className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition"
              title="Reset route"
            >

              <RotateCcw
                size={13}
              />

            </button>

          )}

        </div>


        {/* ===================================================
            STARTING POINT
        ==================================================== */}

        <div className="mt-5">

          <label className="text-[10px] uppercase tracking-wider text-slate-600">

            Starting Point

          </label>


          <div className="grid grid-cols-2 gap-2 mt-2">


            {/* LATITUDE */}

            <div className="relative">

              <MapPin
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"
              />


              <input

                type="number"

                step="any"

                value={
                  start.lat
                }

                onChange={(e) =>
                  updateStart(
                    "lat",
                    e.target.value
                  )
                }

                placeholder="Latitude"

                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pl-9 text-xs text-white outline-none focus:border-emerald-500"

              />

            </div>


            {/* LONGITUDE */}

            <input

              type="number"

              step="any"

              value={
                start.lng
              }

              onChange={(e) =>
                updateStart(
                  "lng",
                  e.target.value
                )
              }

              placeholder="Longitude"

              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"

            />

          </div>

        </div>


        {/* ===================================================
            DESTINATION
        ==================================================== */}

        <div className="mt-4">

          <label className="text-[10px] uppercase tracking-wider text-slate-600">

            Destination

          </label>


          <div className="grid grid-cols-2 gap-2 mt-2">


            {/* LATITUDE */}

            <div className="relative">

              <Navigation
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400"
              />


              <input

                type="number"

                step="any"

                value={
                  destination.lat
                }

                onChange={(e) =>
                  updateDestination(
                    "lat",
                    e.target.value
                  )
                }

                placeholder="Latitude"

                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pl-9 text-xs text-white outline-none focus:border-emerald-500"

              />

            </div>


            {/* LONGITUDE */}

            <input

              type="number"

              step="any"

              value={
                destination.lng
              }

              onChange={(e) =>
                updateDestination(
                  "lng",
                  e.target.value
                )
              }

              placeholder="Longitude"

              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"

            />

          </div>

        </div>


        {/* ===================================================
            CALCULATE BUTTON
        ==================================================== */}

        <button

          type="button"

          onClick={
            handleCalculate
          }

          disabled={
            loading
          }

          className="w-full mt-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition"

        >

          {loading ? (

            <>

              <LoaderCircle
                size={16}
                className="animate-spin"
              />

              Analyzing real routes...

            </>

          ) : (

            <>

              <Route
                size={16}
              />

              Find Best Route

            </>

          )}

        </button>


        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (

          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-2">

            <AlertCircle
              size={16}
              className="text-red-400 shrink-0"
            />


            <p className="text-xs text-red-400">
              {error}
            </p>

          </div>

        )}


        {/* ===================================================
            PRIMARY ROUTE RESULT
        ==================================================== */}

        {routeInfo && (

          <div className="mt-4">


            <div className="grid grid-cols-2 gap-3">


              {/* DISTANCE */}

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

                <p className="text-[9px] text-slate-600 uppercase">
                  Fastest Distance
                </p>


                <p className="text-lg font-semibold text-white mt-1">
                  {routeInfo.distanceText}
                </p>

              </div>


              {/* ETA */}

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

                <p className="text-[9px] text-slate-600 uppercase">
                  Fastest ETA
                </p>


                <p className="text-lg font-semibold text-white mt-1">
                  {routeInfo.durationText}
                </p>

              </div>

            </div>


            {/* ROUTE COUNT */}

            {optimization?.routes && (

              <div className="mt-3 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">

                <span className="text-[8px] uppercase text-slate-600">

                  Available Routes

                </span>


                <span className="text-[9px] text-emerald-400 font-semibold">

                  {optimization.routes.length}

                </span>

              </div>

            )}

          </div>

        )}

      </div>


      {/* =====================================================
          ASSIGNED ROUTE
      ====================================================== */}

      {assignedRoute && (

        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">

                <CheckCircle2
                  size={16}
                  className="text-emerald-400"
                />

              </div>


              <div>

                <p className="text-[8px] uppercase tracking-wider text-emerald-400">

                  Route Assigned

                </p>


                <p className="text-sm font-semibold text-white mt-1">

                  {assignedRoute.name}

                </p>

              </div>

            </div>


            <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-[7px] text-emerald-400">

              ACTIVE

            </span>

          </div>


          <div className="grid grid-cols-3 gap-2 mt-4">


            <div className="bg-slate-950 rounded-lg p-2">

              <p className="text-[7px] text-slate-600 uppercase">
                Distance
              </p>


              <p className="text-[10px] text-white mt-1">

                {assignedRoute.distanceText}

              </p>

            </div>


            <div className="bg-slate-950 rounded-lg p-2">

              <p className="text-[7px] text-slate-600 uppercase">
                ETA
              </p>


              <p className="text-[10px] text-white mt-1">

                {assignedRoute.durationText}

              </p>

            </div>


            <div className="bg-slate-950 rounded-lg p-2">

              <p className="text-[7px] text-slate-600 uppercase">
                Risk
              </p>


              <p className="text-[10px] text-white mt-1">

                {assignedRoute.risk?.riskScore ?? "—"}

              </p>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          PREVIEW STATUS
      ====================================================== */}

      {previewRoute && !assignedRoute && (

        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3">

          <div className="flex items-center gap-2">

            <MapPin
              size={13}
              className="text-cyan-400"
            />


            <p className="text-[8px] uppercase tracking-wider text-cyan-400">

              Map Preview Active

            </p>

          </div>


          <p className="text-xs text-white mt-1">

            {previewRoute.name}

          </p>

        </div>

      )}


      {/* =====================================================
          RISK
      ====================================================== */}

      {routeInfo?.risk && (

        <RouteRiskCard
          risk={
            routeInfo.risk
          }
        />

      )}


      {/* =====================================================
          ROUTE COMPARISON
      ====================================================== */}

      {optimization && (

        <RouteComparison

          routes={
            optimization.routes
          }

          bestRoute={
            optimization.bestRoute
          }

          onRoutePreview={
            handleRoutePreview
          }

          onRouteAssigned={
            handleRouteAssigned
          }

        />

      )}

    </div>

  );

}


export default RoutePlanner;
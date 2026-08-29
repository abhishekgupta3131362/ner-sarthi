import { useState } from "react";

import {
  Navigation,
  MapPin,
  Route,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { getRoutes } from "../../services/routingService";

import {
  formatDistance,
  formatDuration,
} from "../../utils/routeUtils";

import { calculateRouteRisk } from "../../services/riskEngine";

import { getWeather } from "../../services/weatherService";

import RouteRiskCard from "./RouteRiskCard";

import RouteComparison from "./RouteComparison";

import { findBestRoute } from "../../services/routeOptimizer";


function RoutePlanner({
  onRouteFound,
  onRouteAssigned,
}) {

  /* =========================================================
     START / DESTINATION
  ========================================================= */

  const [start, setStart] = useState({
    lat: "26.1445",
    lng: "91.7362",
  });

  const [destination, setDestination] = useState({
    lat: "26.6338",
    lng: "92.8000",
  });


  /* =========================================================
     STATES
  ========================================================= */

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


  /* =========================================================
     CALCULATE ROUTES
  ========================================================= */

  const handleCalculate = async () => {

    setError("");
    setRouteInfo(null);
    setOptimization(null);
    setAssignedRoute(null);

    setLoading(true);

    try {

      /* =====================================================
         VALIDATE COORDINATES
      ===================================================== */

      const startPoint = [
        Number(start.lat),
        Number(start.lng),
      ];

      const destinationPoint = [
        Number(destination.lat),
        Number(destination.lng),
      ];


      if (
        !Number.isFinite(startPoint[0]) ||
        !Number.isFinite(startPoint[1]) ||
        !Number.isFinite(destinationPoint[0]) ||
        !Number.isFinite(destinationPoint[1])
      ) {

        throw new Error(
          "Please enter valid coordinates."
        );

      }


      /* =====================================================
         LATITUDE VALIDATION
      ===================================================== */

      if (
        startPoint[0] < -90 ||
        startPoint[0] > 90 ||
        destinationPoint[0] < -90 ||
        destinationPoint[0] > 90
      ) {

        throw new Error(
          "Latitude must be between -90 and 90."
        );

      }


      /* =====================================================
         LONGITUDE VALIDATION
      ===================================================== */

      if (
        startPoint[1] < -180 ||
        startPoint[1] > 180 ||
        destinationPoint[1] < -180 ||
        destinationPoint[1] > 180
      ) {

        throw new Error(
          "Longitude must be between -180 and 180."
        );

      }


      /* =====================================================
         GET WEATHER
      ===================================================== */

      let weather;

      try {

        weather =
          await getWeather(
            destinationPoint[0],
            destinationPoint[1]
          );

      } catch (weatherError) {

        console.error(
          "Weather service error:",
          weatherError
        );

        /*
          Route calculation should continue
          even if weather API fails.
        */

        weather = {
          condition:
            "Weather unavailable",

          temperature:
            0,

          humidity:
            0,

          rain:
            0,

          precipitation:
            0,

          windSpeed:
            0,

          weatherRisk:
            30,
        };

      }


      /* =====================================================
         SAFE WEATHER VALUES
      ===================================================== */

      const safeWeather = {

        condition:
          weather?.condition ||
          "Unknown",

        temperature:
          Number.isFinite(
            Number(
              weather?.temperature
            )
          )
            ? Number(
                weather.temperature
              )
            : 0,

        humidity:
          Number.isFinite(
            Number(
              weather?.humidity
            )
          )
            ? Number(
                weather.humidity
              )
            : 0,

        rain:
          Number.isFinite(
            Number(
              weather?.rain
            )
          )
            ? Number(
                weather.rain
              )
            : 0,

        precipitation:
          Number.isFinite(
            Number(
              weather?.precipitation
            )
          )
            ? Number(
                weather.precipitation
              )
            : 0,

        windSpeed:
          Number.isFinite(
            Number(
              weather?.windSpeed
            )
          )
            ? Number(
                weather.windSpeed
              )
            : 0,

        weatherRisk:
          Number.isFinite(
            Number(
              weather?.weatherRisk
            )
          )
            ? Number(
                weather.weatherRisk
              )
            : 30,

      };


      console.log(
        "Current weather:",
        safeWeather
      );


      /* =====================================================
         GET REAL OSRM ROUTES
      ===================================================== */

      const result =
        await getRoutes(
          startPoint,
          destinationPoint
        );


      if (
        !result ||
        !Array.isArray(
          result.routes
        ) ||
        result.routes.length === 0
      ) {

        throw new Error(
          "No route could be found."
        );

      }


      /* =====================================================
         FORMAT REAL ROUTES
      ===================================================== */

      const routes =
        result.routes.map(
          (osrmRoute, index) => {

            /* ===============================================
               ROUTE-SPECIFIC RISK PROFILE
            =============================================== */

            let weatherRisk =
              safeWeather.weatherRisk;

            let roadRisk = 15;


            if (index === 1) {

              weatherRisk =
                Math.max(
                  safeWeather.weatherRisk - 5,
                  0
                );

              roadRisk = 10;

            }


            if (index >= 2) {

              weatherRisk =
                Math.max(
                  safeWeather.weatherRisk - 10,
                  0
                );

              roadRisk = 5;

            }


            /* ===============================================
               CALCULATE RISK
            =============================================== */

            const risk =
              calculateRouteRisk({

                distance:
                  osrmRoute.distance,

                duration:
                  osrmRoute.duration,

                incidents: [],

                weatherRisk:
                  weatherRisk,

                roadRisk:
                  roadRisk,

              });


            /* ===============================================
               ROUTE NAME
            =============================================== */

            let routeName =
              `Route ${index + 1}`;


            if (index === 0) {

              routeName =
                "Fastest Route";

            } else if (index === 1) {

              routeName =
                "Alternative Route";

            } else if (index === 2) {

              routeName =
                "Safer Alternative";

            }


            /* ===============================================
               FINAL ROUTE OBJECT
            =============================================== */

            return {

              ...osrmRoute,

              id:
                `ROUTE-${String(
                  index + 1
                ).padStart(2, "0")}`,

              name:
                routeName,

              distance:
                Number(
                  osrmRoute.distance
                ) || 0,

              duration:
                Number(
                  osrmRoute.duration
                ) || 0,

              distanceText:
                formatDistance(
                  osrmRoute.distance
                ),

              durationText:
                formatDuration(
                  osrmRoute.duration
                ),

              risk:

                risk,

              weather: {

                condition:
                  safeWeather.condition,

                temperature:
                  safeWeather.temperature,

                humidity:
                  safeWeather.humidity,

                rain:
                  safeWeather.rain,

                precipitation:
                  safeWeather.precipitation,

                windSpeed:
                  safeWeather.windSpeed,

                risk:
                  safeWeather.weatherRisk,

              },

            };

          }
        );


      /* =====================================================
         OPTIMIZE ROUTES
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


      /* =====================================================
         BEST ROUTE
      ===================================================== */

      const bestRoute =
        optimized.bestRoute;


      /* =====================================================
         PRIMARY ROUTE INFORMATION
      ===================================================== */

      setRouteInfo({

        ...bestRoute,

        distanceText:
          formatDistance(
            bestRoute.distance
          ),

        durationText:
          formatDuration(
            bestRoute.duration
          ),

      });


      /* =====================================================
         SAVE OPTIMIZATION
      ===================================================== */

      setOptimization(
        optimized
      );


      /* =====================================================
         SEND BEST ROUTE TO MAP
      ===================================================== */

      if (
        typeof onRouteFound ===
        "function"
      ) {

        onRouteFound(
          bestRoute
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
     ASSIGN ROUTE
  ========================================================= */

  const handleRouteAssigned = (
    route
  ) => {

    if (!route) {
      return;
    }


    setAssignedRoute(
      route
    );


    if (
      typeof onRouteAssigned ===
      "function"
    ) {

      onRouteAssigned(
        route
      );

    }


    localStorage.setItem(
      "assignedRoute",
      JSON.stringify(route)
    );

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


    if (
      typeof onRouteFound ===
      "function"
    ) {

      onRouteFound(
        route
      );

    }

  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="space-y-4">


      {/* =====================================================
          ROUTE PLANNER
      ====================================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">


        {/* HEADER */}

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
              AI-assisted route planning and real-time weather risk analysis
            </p>

          </div>

        </div>


        {/* =================================================
            STARTING POINT
        ================================================== */}

        <div className="mt-5">

          <label className="text-[10px] uppercase tracking-wider text-slate-600">
            Starting Point
          </label>


          <div className="grid grid-cols-2 gap-2 mt-2">

            <div className="relative">

              <MapPin
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"
              />

              <input
                value={start.lat}

                onChange={(e) =>
                  setStart({
                    ...start,
                    lat:
                      e.target.value,
                  })
                }

                placeholder="Latitude"

                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pl-9 text-xs text-white outline-none focus:border-emerald-500"
              />

            </div>


            <input
              value={start.lng}

              onChange={(e) =>
                setStart({
                  ...start,
                  lng:
                    e.target.value,
                })
              }

              placeholder="Longitude"

              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />

          </div>

        </div>


        {/* =================================================
            DESTINATION
        ================================================== */}

        <div className="mt-4">

          <label className="text-[10px] uppercase tracking-wider text-slate-600">
            Destination
          </label>


          <div className="grid grid-cols-2 gap-2 mt-2">

            <div className="relative">

              <Navigation
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400"
              />

              <input
                value={
                  destination.lat
                }

                onChange={(e) =>
                  setDestination({
                    ...destination,
                    lat:
                      e.target.value,
                  })
                }

                placeholder="Latitude"

                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pl-9 text-xs text-white outline-none focus:border-emerald-500"
              />

            </div>


            <input
              value={
                destination.lng
              }

              onChange={(e) =>
                setDestination({
                  ...destination,
                  lng:
                    e.target.value,
                })
              }

              placeholder="Longitude"

              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />

          </div>

        </div>


        {/* =================================================
            CALCULATE
        ================================================== */}

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

              Finding routes & weather...

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


        {/* =================================================
            ERROR
        ================================================== */}

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


        {/* =================================================
            PRIMARY RESULT
        ================================================== */}

        {routeInfo && (

          <div className="mt-4 grid grid-cols-2 gap-3">

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

              <p className="text-[9px] text-slate-600 uppercase">
                Distance
              </p>

              <p className="text-lg font-semibold text-white mt-1">
                {
                  routeInfo.distanceText
                }
              </p>

            </div>


            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

              <p className="text-[9px] text-slate-600 uppercase">
                ETA
              </p>

              <p className="text-lg font-semibold text-white mt-1">
                {
                  routeInfo.durationText
                }
              </p>

            </div>

          </div>

        )}


        {/* =================================================
            WEATHER SUMMARY
        ================================================== */}

        {routeInfo?.weather && (

          <div className="mt-3 bg-slate-950 border border-slate-800 rounded-xl p-3">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] uppercase tracking-wider text-slate-600">
                  Current Weather
                </p>

                <p className="text-xs text-white font-medium mt-1">
                  {
                    routeInfo
                      .weather
                      .condition
                  }
                </p>

              </div>


              <div className="text-right">

                <p className="text-sm font-bold text-white">
                  {
                    routeInfo
                      .weather
                      .temperature
                  }°C
                </p>

                <p className="text-[8px] text-slate-600">
                  Weather Risk{" "}
                  {
                    routeInfo
                      .weather
                      .risk
                  }/100
                </p>

              </div>

            </div>


            <div className="grid grid-cols-3 gap-2 mt-3">

              <div>

                <p className="text-[7px] text-slate-600 uppercase">
                  Rain
                </p>

                <p className="text-[9px] text-white mt-1">
                  {
                    routeInfo
                      .weather
                      .rain
                  } mm
                </p>

              </div>


              <div>

                <p className="text-[7px] text-slate-600 uppercase">
                  Humidity
                </p>

                <p className="text-[9px] text-white mt-1">
                  {
                    routeInfo
                      .weather
                      .humidity
                  }%
                </p>

              </div>


              <div>

                <p className="text-[7px] text-slate-600 uppercase">
                  Wind
                </p>

                <p className="text-[9px] text-white mt-1">
                  {
                    routeInfo
                      .weather
                      .windSpeed
                  } km/h
                </p>

              </div>

            </div>

          </div>

        )}

      </div>


      {/* =====================================================
          ASSIGNED ROUTE
      ====================================================== */}

      {assignedRoute && (

        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">

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
                {
                  assignedRoute.name
                }
              </p>

            </div>

          </div>


          <div className="grid grid-cols-3 gap-2 mt-4">

            <div className="bg-slate-950 rounded-lg p-2">

              <p className="text-[7px] text-slate-600 uppercase">
                Distance
              </p>

              <p className="text-[10px] text-white mt-1">
                {
                  assignedRoute
                    .distanceText
                }
              </p>

            </div>


            <div className="bg-slate-950 rounded-lg p-2">

              <p className="text-[7px] text-slate-600 uppercase">
                ETA
              </p>

              <p className="text-[10px] text-white mt-1">
                {
                  assignedRoute
                    .durationText
                }
              </p>

            </div>


            <div className="bg-slate-950 rounded-lg p-2">

              <p className="text-[7px] text-slate-600 uppercase">
                Risk
              </p>

              <p className="text-[10px] text-white mt-1">
                {
                  assignedRoute
                    .risk
                    ?.riskScore ??
                  "—"
                }
              </p>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          RISK CARD
      ====================================================== */}

      {routeInfo?.risk && (

        <RouteRiskCard
          risk={
            routeInfo.risk
          }

          distanceText={
            routeInfo.distanceText
          }

          durationText={
            routeInfo.durationText
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

          onRouteAssigned={
            handleRouteAssigned
          }

          onRoutePreview={
            handleRoutePreview
          }

        />

      )}

    </div>

  );
}


export default RoutePlanner;
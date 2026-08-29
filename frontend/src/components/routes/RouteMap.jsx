import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

/* =========================================================
   FIX LEAFLET MARKER ICONS
========================================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* =========================================================
   ROUTE MAP CONTROLLER
========================================================= */

function RouteMapController({
  route,
  start,
  destination,
}) {
  const map = useMap();

  useEffect(() => {
    const points = [];

    /* Route points */
    if (
      route?.geometry &&
      Array.isArray(route.geometry)
    ) {
      route.geometry.forEach((point) => {
        if (
          Array.isArray(point) &&
          point.length >= 2 &&
          Number.isFinite(Number(point[0])) &&
          Number.isFinite(Number(point[1]))
        ) {
          points.push([
            Number(point[0]),
            Number(point[1]),
          ]);
        }
      });
    }

    /* Start */
    if (
      start &&
      Number.isFinite(Number(start[0])) &&
      Number.isFinite(Number(start[1]))
    ) {
      points.push([
        Number(start[0]),
        Number(start[1]),
      ]);
    }

    /* Destination */
    if (
      destination &&
      Number.isFinite(Number(destination[0])) &&
      Number.isFinite(Number(destination[1]))
    ) {
      points.push([
        Number(destination[0]),
        Number(destination[1]),
      ]);
    }

    if (points.length < 2) {
      return;
    }

    const bounds = L.latLngBounds(points);

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 14,
      animate: true,
    });
  }, [route, start, destination, map]);

  return null;
}

/* =========================================================
   ROUTE MAP
========================================================= */

function RouteMap({
  route = null,
  start = null,
  destination = null,
}) {
  /* =======================================================
     DEFAULT CENTER
  ======================================================= */

  const center =
    start &&
    Number.isFinite(Number(start[0])) &&
    Number.isFinite(Number(start[1]))
      ? [
          Number(start[0]),
          Number(start[1]),
        ]
      : [26.1445, 91.7362];

  /* =======================================================
     VALIDATE START
  ======================================================= */

  const validStart =
    start &&
    Number.isFinite(Number(start[0])) &&
    Number.isFinite(Number(start[1]))
      ? [
          Number(start[0]),
          Number(start[1]),
        ]
      : null;

  /* =======================================================
     VALIDATE DESTINATION
  ======================================================= */

  const validDestination =
    destination &&
    Number.isFinite(Number(destination[0])) &&
    Number.isFinite(Number(destination[1]))
      ? [
          Number(destination[0]),
          Number(destination[1]),
        ]
      : null;

  /* =======================================================
     VALIDATE ROUTE
  ======================================================= */

  const validRoute =
    route?.geometry?.filter(
      (point) =>
        Array.isArray(point) &&
        point.length >= 2 &&
        Number.isFinite(Number(point[0])) &&
        Number.isFinite(Number(point[1]))
    ) || [];

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">

      {/* =====================================================
          MAP
      ====================================================== */}

      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={true}
        zoomControl={true}
        className="w-full h-full"
        style={{
          minHeight: "500px",
          background: "#020617",
        }}
      >

        {/* ===================================================
            OPEN STREET MAP
        ==================================================== */}

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ===================================================
            ROUTE LINE
        ==================================================== */}

        {validRoute.length >= 2 && (
          <Polyline
            positions={validRoute.map(
              ([lat, lng]) => [
                Number(lat),
                Number(lng),
              ]
            )}
            pathOptions={{
              color: "#10b981",
              weight: 6,
              opacity: 0.9,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}

        {/* ===================================================
            START MARKER
        ==================================================== */}

        {validStart && (
          <Marker position={validStart}>
            <Popup>
              <div className="text-sm">
                <strong>
                  Starting Point
                </strong>

                <br />

                <span>
                  {validStart[0].toFixed(5)},{" "}
                  {validStart[1].toFixed(5)}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* ===================================================
            DESTINATION MARKER
        ==================================================== */}

        {validDestination && (
          <Marker position={validDestination}>
            <Popup>
              <div className="text-sm">
                <strong>
                  Destination
                </strong>

                <br />

                <span>
                  {validDestination[0].toFixed(5)},{" "}
                  {validDestination[1].toFixed(5)}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* ===================================================
            AUTO FIT
        ==================================================== */}

        <RouteMapController
          route={route}
          start={validStart}
          destination={validDestination}
        />

      </MapContainer>

      {/* =====================================================
          MAP STATUS
      ====================================================== */}

      <div className="absolute top-3 left-3 z-[500]">

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950/90 backdrop-blur border border-slate-700">

          <span
            className={`w-2 h-2 rounded-full ${
              validRoute.length >= 2
                ? "bg-emerald-400 animate-pulse"
                : "bg-slate-600"
            }`}
          />

          <span className="text-[9px] uppercase tracking-wider text-white">
            {validRoute.length >= 2
              ? "Route Active"
              : "Waiting for Route"}
          </span>

        </div>

      </div>

      {/* =====================================================
          ROUTE INFORMATION
      ====================================================== */}

      {route && (
        <div className="absolute bottom-3 left-3 right-3 z-[500]">

          <div className="bg-slate-950/90 backdrop-blur border border-slate-700 rounded-xl p-3">

            <div className="flex items-center justify-between gap-3">

              <div>
                <p className="text-[8px] uppercase tracking-wider text-slate-500">
                  Selected Route
                </p>

                <p className="text-xs font-semibold text-white mt-1">
                  {route.name ||
                    "Optimized Route"}
                </p>
              </div>

              <div className="flex items-center gap-4">

                {/* DISTANCE */}

                {route.distanceText && (
                  <div>
                    <p className="text-[7px] uppercase text-slate-600">
                      Distance
                    </p>

                    <p className="text-[10px] text-white mt-1">
                      {route.distanceText}
                    </p>
                  </div>
                )}

                {/* ETA */}

                {route.durationText && (
                  <div>
                    <p className="text-[7px] uppercase text-slate-600">
                      ETA
                    </p>

                    <p className="text-[10px] text-white mt-1">
                      {route.durationText}
                    </p>
                  </div>
                )}

                {/* RISK */}

                {route.risk?.riskScore !==
                  undefined && (
                  <div>
                    <p className="text-[7px] uppercase text-slate-600">
                      Risk
                    </p>

                    <p className="text-[10px] text-white mt-1">
                      {route.risk.riskScore}
                    </p>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {!route && (
        <div className="absolute inset-0 z-[400] pointer-events-none flex items-center justify-center">

          <div className="bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl px-5 py-4 text-center">

            <p className="text-xs text-slate-400">
              Calculate a route to display it
              on the map.
            </p>

            <p className="text-[8px] text-slate-600 mt-1">
              Use the Route Planner on the left.
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   EXPORT
========================================================= */

export default RouteMap;
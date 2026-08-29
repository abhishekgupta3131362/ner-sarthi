const OSRM_BASE_URL =
  "https://router.project-osrm.org";

/*
  Get real road routes from OSRM.

  start       = [latitude, longitude]
  destination = [latitude, longitude]

  Returns multiple routes whenever
  OSRM provides alternatives.
*/

export async function getRoutes(
  start,
  destination
) {
  const startLat = Number(start?.[0]);
  const startLng = Number(start?.[1]);

  const destinationLat =
    Number(destination?.[0]);

  const destinationLng =
    Number(destination?.[1]);

  /* -----------------------------
     VALIDATION
  ----------------------------- */

  if (
    !Number.isFinite(startLat) ||
    !Number.isFinite(startLng) ||
    !Number.isFinite(destinationLat) ||
    !Number.isFinite(destinationLng)
  ) {
    throw new Error(
      "Invalid start or destination coordinates."
    );
  }

  if (
    startLat < -90 ||
    startLat > 90 ||
    destinationLat < -90 ||
    destinationLat > 90
  ) {
    throw new Error(
      "Latitude must be between -90 and 90."
    );
  }

  if (
    startLng < -180 ||
    startLng > 180 ||
    destinationLng < -180 ||
    destinationLng > 180
  ) {
    throw new Error(
      "Longitude must be between -180 and 180."
    );
  }

  /* -----------------------------
     OSRM COORDINATES

     OSRM expects:
     longitude,latitude
  ----------------------------- */

  const startCoordinates =
    `${startLng},${startLat}`;

  const destinationCoordinates =
    `${destinationLng},${destinationLat}`;

  const url =
    `${OSRM_BASE_URL}/route/v1/driving/` +
    `${startCoordinates};${destinationCoordinates}` +
    `?overview=full` +
    `&geometries=geojson` +
    `&steps=true` +
    `&alternatives=true`;

  /* -----------------------------
     REQUEST
  ----------------------------- */

  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Routing service failed (${response.status}).`
    );
  }

  const data =
    await response.json();

  if (
    data.code !== "Ok" ||
    !Array.isArray(data.routes) ||
    data.routes.length === 0
  ) {
    throw new Error(
      "No road route could be found."
    );
  }

  /* -----------------------------
     FORMAT REAL ROUTES
  ----------------------------- */

  const routes =
    data.routes.map(
      (route, index) => {

        const geometry =
          route.geometry?.coordinates
            ?.map(
              ([lng, lat]) => [
                lat,
                lng,
              ]
            ) || [];

        const steps =
          route.legs?.flatMap(
            (leg) =>
              leg.steps || []
          ) || [];

        return {
          id:
            `OSRM-${index + 1}`,

          distance:
            Number(route.distance) || 0,

          duration:
            Number(route.duration) || 0,

          geometry,

          steps,

          rawRoute:
            route,
        };
      }
    );

  return {
    routes,
  };
}


/*
  Backward-compatible helper.

  Returns first real OSRM route.
*/

export async function getRoute(
  start,
  destination
) {
  const result =
    await getRoutes(
      start,
      destination
    );

  return result.routes[0];
}
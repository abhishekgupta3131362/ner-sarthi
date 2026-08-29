/*
=========================================================
ROUTE OPTIMIZER
=========================================================

Compares real routes using:

1. Safety / Risk     = 50%
2. Distance          = 25%
3. Travel Time       = 25%

Higher optimization score = better route.
*/


/* =========================================================
   NUMBER
========================================================= */

function toNumber(
  value,
  fallback = 0
) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}


/* =========================================================
   CLAMP
========================================================= */

function clamp(
  value,
  min = 0,
  max = 100
) {
  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  );
}


/* =========================================================
   NORMALIZE
========================================================= */

function normalize(
  value,
  minimum,
  maximum
) {
  if (
    maximum === minimum
  ) {
    return 0;
  }

  return clamp(
    (
      (value - minimum) /
      (maximum - minimum)
    ) * 100
  );
}


/* =========================================================
   RISK
========================================================= */

function getRiskScore(
  route
) {
  return clamp(
    toNumber(
      route?.risk?.riskScore ??
      route?.riskScore,
      0
    )
  );
}


/* =========================================================
   DISTANCE
========================================================= */

function getDistance(
  route
) {
  return Math.max(
    0,
    toNumber(
      route?.distance,
      0
    )
  );
}


/* =========================================================
   DURATION
========================================================= */

function getDuration(
  route
) {
  return Math.max(
    0,
    toNumber(
      route?.duration,
      0
    )
  );
}


/* =========================================================
   SCORE
========================================================= */

export function calculateOptimizationScore(
  route,
  routes
) {
  if (
    !route ||
    !Array.isArray(routes) ||
    routes.length === 0
  ) {
    return 0;
  }

  const distances =
    routes.map(
      getDistance
    );

  const durations =
    routes.map(
      getDuration
    );

  const minDistance =
    Math.min(
      ...distances
    );

  const maxDistance =
    Math.max(
      ...distances
    );

  const minDuration =
    Math.min(
      ...durations
    );

  const maxDuration =
    Math.max(
      ...durations
    );

  const distance =
    getDistance(route);

  const duration =
    getDuration(route);

  const risk =
    getRiskScore(route);

  const distancePenalty =
    normalize(
      distance,
      minDistance,
      maxDistance
    );

  const durationPenalty =
    normalize(
      duration,
      minDuration,
      maxDuration
    );

  const safetyScore =
    100 - risk;

  const distanceScore =
    100 - distancePenalty;

  const durationScore =
    100 - durationPenalty;

  const score =
    safetyScore * 0.50 +
    distanceScore * 0.25 +
    durationScore * 0.25;

  return Math.round(
    clamp(score)
  );
}


/* =========================================================
   FIND BEST ROUTE
========================================================= */

export function findBestRoute(
  routes = []
) {
  if (
    !Array.isArray(routes) ||
    routes.length === 0
  ) {
    return {
      routes: [],
      bestRoute: null,
      bestScore: 0,
    };
  }

  const scoredRoutes =
    routes.map(
      (route) => ({
        ...route,

        optimizationScore:
          calculateOptimizationScore(
            route,
            routes
          ),
      })
    );


  /* -----------------------------
     SORT
  ----------------------------- */

  const sortedRoutes =
    [...scoredRoutes].sort(
      (a, b) => {

        if (
          b.optimizationScore !==
          a.optimizationScore
        ) {
          return (
            b.optimizationScore -
            a.optimizationScore
          );
        }

        const riskDifference =
          getRiskScore(a) -
          getRiskScore(b);

        if (
          riskDifference !== 0
        ) {
          return riskDifference;
        }

        return (
          getDistance(a) -
          getDistance(b)
        );
      }
    );


  /* -----------------------------
     RANK
  ----------------------------- */

  const rankedRoutes =
    sortedRoutes.map(
      (route, index) => ({
        ...route,

        rank:
          index + 1,
      })
    );


  const bestRoute =
    rankedRoutes[0];


  return {
    routes:
      rankedRoutes,

    bestRoute,

    bestScore:
      bestRoute?.optimizationScore || 0,
  };
}
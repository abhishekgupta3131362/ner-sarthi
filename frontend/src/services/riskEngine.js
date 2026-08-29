/* =========================================================
   ROUTE RISK ENGINE

   Calculates route risk using:

   1. Distance
   2. Travel duration
   3. Incidents
   4. Weather
   5. Road condition

   Output:
   - riskScore
   - safetyScore
   - riskLevel
   - breakdown
========================================================= */


/* =========================================================
   NUMBER HELPER
========================================================= */

function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}


/* =========================================================
   CLAMP
========================================================= */

function clamp(value, min = 0, max = 100) {
  return Math.min(
    Math.max(
      toNumber(value),
      min
    ),
    max
  );
}


/* =========================================================
   DISTANCE RISK

   Distance is supplied in meters.
========================================================= */

function calculateDistanceRisk(distance) {
  const km =
    Math.max(
      0,
      toNumber(distance) / 1000
    );

  if (km >= 500) {
    return 100;
  }

  if (km >= 300) {
    return 80;
  }

  if (km >= 200) {
    return 60;
  }

  if (km >= 100) {
    return 40;
  }

  if (km >= 50) {
    return 25;
  }

  return 10;
}


/* =========================================================
   DURATION RISK

   Duration is supplied in seconds.
========================================================= */

function calculateDurationRisk(duration) {
  const hours =
    Math.max(
      0,
      toNumber(duration) / 3600
    );

  if (hours >= 10) {
    return 100;
  }

  if (hours >= 7) {
    return 80;
  }

  if (hours >= 5) {
    return 60;
  }

  if (hours >= 3) {
    return 40;
  }

  if (hours >= 2) {
    return 25;
  }

  return 10;
}


/* =========================================================
   INCIDENT RISK
========================================================= */

function calculateIncidentRisk(
  incidents = []
) {
  if (!Array.isArray(incidents)) {
    return 0;
  }

  if (incidents.length === 0) {
    return 0;
  }

  let score = 0;

  incidents.forEach((incident) => {
    if (!incident) {
      return;
    }

    const severity =
      String(
        incident.severity || ""
      ).toUpperCase();

    if (severity === "CRITICAL") {
      score += 40;
    } else if (severity === "HIGH") {
      score += 30;
    } else if (severity === "MEDIUM") {
      score += 20;
    } else {
      score += 10;
    }
  });

  return clamp(score);
}


/* =========================================================
   WEATHER RISK
========================================================= */

function calculateWeatherRisk(
  weatherRisk
) {
  return clamp(
    weatherRisk
  );
}


/* =========================================================
   ROAD RISK
========================================================= */

function calculateRoadRisk(
  roadRisk
) {
  return clamp(
    roadRisk
  );
}


/* =========================================================
   RISK LEVEL
========================================================= */

function getRiskLevel(
  riskScore
) {
  if (riskScore >= 80) {
    return "CRITICAL";
  }

  if (riskScore >= 60) {
    return "HIGH";
  }

  if (riskScore >= 35) {
    return "MEDIUM";
  }

  return "LOW";
}


/* =========================================================
   MAIN RISK CALCULATION
========================================================= */

export function calculateRouteRisk({
  distance = 0,
  duration = 0,
  incidents = [],
  weatherRisk = 0,
  roadRisk = 0,
} = {}) {

  /* =======================================================
     INDIVIDUAL RISKS
  ======================================================= */

  const distanceRisk =
    calculateDistanceRisk(
      distance
    );

  const durationRisk =
    calculateDurationRisk(
      duration
    );

  const incidentRisk =
    calculateIncidentRisk(
      incidents
    );

  const calculatedWeatherRisk =
    calculateWeatherRisk(
      weatherRisk
    );

  const calculatedRoadRisk =
    calculateRoadRisk(
      roadRisk
    );


  /* =======================================================
     WEIGHTED RISK

     Weather       = 30%
     Road          = 25%
     Incidents     = 20%
     Distance      = 10%
     Duration      = 15%
  ======================================================= */

  const riskScore =
    (
      calculatedWeatherRisk * 0.30
    ) +
    (
      calculatedRoadRisk * 0.25
    ) +
    (
      incidentRisk * 0.20
    ) +
    (
      distanceRisk * 0.10
    ) +
    (
      durationRisk * 0.15
    );


  const finalRiskScore =
    Math.round(
      clamp(
        riskScore
      )
    );


  /* =======================================================
     SAFETY SCORE
  ======================================================= */

  const safetyScore =
    Math.round(
      100 -
      finalRiskScore
    );


  /* =======================================================
     RISK LEVEL
  ======================================================= */

  const riskLevel =
    getRiskLevel(
      finalRiskScore
    );


  /* =======================================================
     RETURN
  ======================================================= */

  return {

    riskScore:
      finalRiskScore,

    safetyScore:

      safetyScore,

    riskLevel:

      riskLevel,

    breakdown: {

      distanceRisk:
        Math.round(
          distanceRisk
        ),

      durationRisk:
        Math.round(
          durationRisk
        ),

      incidentRisk:
        Math.round(
          incidentRisk
        ),

      weatherRisk:
        Math.round(
          calculatedWeatherRisk
        ),

      roadRisk:
        Math.round(
          calculatedRoadRisk
        ),

    },

  };
}


/* =========================================================
   OPTIONAL HELPERS
========================================================= */

export {
  calculateDistanceRisk,
  calculateDurationRisk,
  calculateIncidentRisk,
  getRiskLevel,
};
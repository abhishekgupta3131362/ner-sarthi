/* =========================================================
   ROUTE UTILS
========================================================= */

/**
 * Format distance returned by OSRM.
 *
 * OSRM distance = meters
 */
export function formatDistance(
  meters
) {
  const value = Number(meters);

  if (!Number.isFinite(value)) {
    return "—";
  }

  if (value < 1000) {
    return `${Math.round(value)} m`;
  }

  return `${(value / 1000).toFixed(1)} km`;
}


/**
 * Format duration returned by OSRM.
 *
 * OSRM duration = seconds
 */
export function formatDuration(
  seconds
) {
  const value = Number(seconds);

  if (!Number.isFinite(value)) {
    return "—";
  }

  const totalMinutes =
    Math.round(value / 60);

  const hours =
    Math.floor(totalMinutes / 60);

  const minutes =
    totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}


/**
 * Convert coordinates into
 * a Leaflet-compatible point.
 *
 * Input:
 * [latitude, longitude]
 */
export function normalizeCoordinates(
  coordinates
) {
  if (
    !Array.isArray(coordinates) ||
    coordinates.length < 2
  ) {
    return null;
  }

  const lat =
    Number(coordinates[0]);

  const lng =
    Number(coordinates[1]);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return null;
  }

  return [lat, lng];
}


/**
 * Calculate simple fuel cost.
 *
 * This is a prototype calculation.
 */
export function calculateFuelCost(
  distanceMeters,
  fuelPrice = 90,
  mileage = 4
) {
  const distanceKm =
    Number(distanceMeters) / 1000;

  if (
    !Number.isFinite(distanceKm) ||
    distanceKm < 0
  ) {
    return 0;
  }

  const fuelRequired =
    distanceKm / mileage;

  return Math.round(
    fuelRequired * fuelPrice
  );
}
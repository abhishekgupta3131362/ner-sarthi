const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";


// =========================================================
// COMMON API REQUEST
// =========================================================

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;

    try {
      const data = await response.json();

      if (data?.detail) {
        message = data.detail;
      }
    } catch {
      // Response is not JSON
    }

    throw new Error(message);
  }

  return response.json();
}


// =========================================================
// HEALTH
// =========================================================

export const getHealth = () => {
  return apiRequest("/api/health/");
};


// =========================================================
// VEHICLES — CRUD
// =========================================================

export const getVehicles = () => {
  return apiRequest("/api/vehicles/");
};


export const getVehicle = (vehicleId) => {
  return apiRequest(
    `/api/vehicles/${vehicleId}`
  );
};


export const createVehicle = (vehicleData) => {
  return apiRequest("/api/vehicles/", {
    method: "POST",
    body: JSON.stringify(vehicleData),
  });
};


export const updateVehicle = (
  vehicleId,
  vehicleData
) => {
  return apiRequest(
    `/api/vehicles/${vehicleId}`,
    {
      method: "PATCH",
      body: JSON.stringify(vehicleData),
    }
  );
};


export const deleteVehicle = (
  vehicleId
) => {
  return apiRequest(
    `/api/vehicles/${vehicleId}`,
    {
      method: "DELETE",
    }
  );
};


// =========================================================
// VEHICLES — FLEET STATS
// =========================================================

export const getFleetStats = () => {
  return apiRequest("/api/vehicles/stats");
};


// =========================================================
// VEHICLES — DISPATCH & MARK IDLE
// =========================================================

export const dispatchVehicle = (vehicleId) => {
  return apiRequest(
    `/api/vehicles/${vehicleId}/dispatch`,
    {
      method: "POST",
    }
  );
};


export const markVehicleIdle = (vehicleId) => {
  return apiRequest(
    `/api/vehicles/${vehicleId}/mark-idle`,
    {
      method: "POST",
    }
  );
};

// =========================================================
// INCIDENTS
// =========================================================

export const getIncidents = () => {
  return apiRequest("/api/incidents/");
};

export const createIncident = (data) => {
  return apiRequest("/api/incidents/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateIncident = (id, data) => {
  return apiRequest(`/api/incidents/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// =========================================================
// FIELD REPORTS
// =========================================================

export const getFieldReports = () => {
  return apiRequest("/api/field-reports/");
};

export const createFieldReport = (data) => {
  return apiRequest("/api/field-reports/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateFieldReport = (id, data) => {
  return apiRequest(`/api/field-reports/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// =========================================================
// ALERTS
// =========================================================

export const getAlerts = () => {
  return apiRequest("/api/alerts/");
};

export const markAlertRead = (id) => {
  return apiRequest(`/api/alerts/${id}/read`, {
    method: "POST",
  });
};

// =========================================================
// ROUTES
// =========================================================

export const getRoutes = () => {
  return apiRequest("/api/routes/");
};

export const predictRoute = (routeId) => {
  return apiRequest(`/api/routes/${routeId}/predict`, {
    method: "POST",
  });
};

// =========================================================
// WEATHER
// =========================================================

export const getWeather = (latitude, longitude) => {
  return apiRequest("/api/weather/", {
    method: "POST",
    body: JSON.stringify({ latitude, longitude }),
  });
};
const WEATHER_BASE_URL =
  "https://api.open-meteo.com/v1/forecast";


/* =========================================================
   WEATHER RISK CALCULATOR
========================================================= */

function calculateWeatherRisk({
  precipitation = 0,
  rain = 0,
  windSpeed = 0,
}) {

  let risk = 0;


  /* Rain / precipitation */

  if (precipitation >= 20) {
    risk += 45;
  } else if (precipitation >= 10) {
    risk += 30;
  } else if (precipitation >= 5) {
    risk += 20;
  } else if (precipitation > 0) {
    risk += 10;
  }


  /* Rain intensity */

  if (rain >= 20) {
    risk += 25;
  } else if (rain >= 10) {
    risk += 15;
  } else if (rain >= 5) {
    risk += 10;
  }


  /* Wind */

  if (windSpeed >= 60) {
    risk += 30;
  } else if (windSpeed >= 40) {
    risk += 20;
  } else if (windSpeed >= 25) {
    risk += 10;
  }


  return Math.min(
    Math.round(risk),
    100
  );
}


/* =========================================================
   WEATHER CONDITION
========================================================= */

function getWeatherCondition(
  weatherCode
) {

  const code =
    Number(weatherCode);


  if (code === 0) {
    return "Clear";
  }


  if (
    code === 1 ||
    code === 2 ||
    code === 3
  ) {
    return "Cloudy";
  }


  if (
    code === 45 ||
    code === 48
  ) {
    return "Fog";
  }


  if (
    code >= 51 &&
    code <= 57
  ) {
    return "Drizzle";
  }


  if (
    code >= 61 &&
    code <= 67
  ) {
    return "Rain";
  }


  if (
    code >= 71 &&
    code <= 77
  ) {
    return "Snow";
  }


  if (
    code >= 80 &&
    code <= 82
  ) {
    return "Rain Showers";
  }


  if (
    code >= 85 &&
    code <= 86
  ) {
    return "Snow Showers";
  }


  if (
    code >= 95 &&
    code <= 99
  ) {
    return "Thunderstorm";
  }


  return "Unknown";
}


/* =========================================================
   GET WEATHER
========================================================= */

export async function getWeather(
  latitude,
  longitude
) {

  const lat =
    Number(latitude);

  const lng =
    Number(longitude);


  /* =======================================================
     VALIDATION
  ======================================================= */

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {

    throw new Error(
      "Invalid weather coordinates."
    );

  }


  if (
    lat < -90 ||
    lat > 90
  ) {

    throw new Error(
      "Invalid latitude."
    );

  }


  if (
    lng < -180 ||
    lng > 180
  ) {

    throw new Error(
      "Invalid longitude."
    );

  }


  /* =======================================================
     API URL
  ======================================================= */

  const url =
    `${WEATHER_BASE_URL}` +
    `?latitude=${lat}` +
    `&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m` +
    `&timezone=auto`;


  /* =======================================================
     REQUEST
  ======================================================= */

  const response =
    await fetch(url);


  if (!response.ok) {

    throw new Error(
      `Weather service failed (${response.status}).`
    );

  }


  const data =
    await response.json();


  if (
    !data?.current
  ) {

    throw new Error(
      "Weather data unavailable."
    );

  }


  /* =======================================================
     CURRENT DATA
  ======================================================= */

  const current =
    data.current;


  const temperature =
    Number(
      current.temperature_2m
    ) || 0;


  const humidity =
    Number(
      current.relative_humidity_2m
    ) || 0;


  const precipitation =
    Number(
      current.precipitation
    ) || 0;


  const rain =
    Number(
      current.rain
    ) || 0;


  const windSpeed =
    Number(
      current.wind_speed_10m
    ) || 0;


  const weatherCode =
    Number(
      current.weather_code
    );


  /* =======================================================
     CONDITION
  ======================================================= */

  const condition =
    getWeatherCondition(
      weatherCode
    );


  /* =======================================================
     WEATHER RISK
  ======================================================= */

  let weatherRisk =
    calculateWeatherRisk({

      precipitation,

      rain,

      windSpeed,

    });


  /* =======================================================
     EXTRA THUNDERSTORM RISK
  ======================================================= */

  if (
    weatherCode >= 95
  ) {

    weatherRisk =
      Math.min(
        weatherRisk + 30,
        100
      );

  }


  /* =======================================================
     RETURN STANDARD FORMAT
  ======================================================= */

  return {

    latitude: lat,

    longitude: lng,

    condition,

    temperature,

    humidity,

    precipitation,

    rain,

    windSpeed,

    weatherCode,

    weatherRisk,

    source: "Open-Meteo",

    updatedAt:
      new Date().toISOString(),

  };

}
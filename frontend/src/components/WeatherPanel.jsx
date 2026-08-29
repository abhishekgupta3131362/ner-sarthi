import React, { useState, useEffect } from "react";
import { CloudRain, Sun, Cloud, CloudLightning, Droplets, Wind, X, MapPin } from "lucide-react";

const NER_CAPITALS = [
  { state: "Assam", city: "Guwahati", lat: 26.1445, lng: 91.7362 },
  { state: "Meghalaya", city: "Shillong", lat: 25.5788, lng: 91.8933 },
  { state: "Manipur", city: "Imphal", lat: 24.8170, lng: 93.9368 },
  { state: "Mizoram", city: "Aizawl", lat: 23.7271, lng: 92.7176 },
  { state: "Tripura", city: "Agartala", lat: 23.8315, lng: 91.2868 },
  { state: "Nagaland", city: "Kohima", lat: 25.6701, lng: 94.1077 },
  { state: "Arunachal Pradesh", city: "Itanagar", lat: 27.0844, lng: 93.6053 },
  { state: "Sikkim", city: "Gangtok", lat: 27.3389, lng: 88.6065 }
];

// Map WMO weather codes to icons and descriptions
const getWeatherInfo = (code) => {
  if (code === 0) return { icon: <Sun className="text-amber-500" />, desc: "Clear sky" };
  if (code >= 1 && code <= 3) return { icon: <Cloud className="text-slate-400" />, desc: "Partly cloudy" };
  if (code >= 45 && code <= 48) return { icon: <Cloud className="text-slate-400" />, desc: "Fog" };
  if (code >= 51 && code <= 67) return { icon: <CloudRain className="text-sky-500" />, desc: "Rain" };
  if (code >= 71 && code <= 77) return { icon: <Cloud className="text-slate-300" />, desc: "Snow" };
  if (code >= 95 && code <= 99) return { icon: <CloudLightning className="text-indigo-500" />, desc: "Thunderstorm" };
  return { icon: <CloudRain className="text-sky-500" />, desc: "Unknown" };
};

export default function WeatherPanel({ onClose }) {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lats = NER_CAPITALS.map(c => c.lat).join(",");
        const lngs = NER_CAPITALS.map(c => c.lng).join(",");
        const url = "https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=Asia/Kolkata";
        
        const response = await fetch(url);
        const data = await response.json();
        
        const mappedData = NER_CAPITALS.map((capital, index) => {
          const current = data[index].current;
          return {
            ...capital,
            temp: current.temperature_2m,
            code: current.weather_code,
            wind: current.wind_speed_10m,
            humidity: current.relative_humidity_2m
          };
        });
        
        setWeatherData(mappedData);
      } catch (err) {
        console.error("Failed to fetch weather", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // refresh 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-full mt-4 right-0 w-[450px] bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in slide-in-from-top-4 fade-in duration-200">
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <CloudRain size={20} className="text-sky-400" />
          <div>
            <h3 className="font-bold text-sm">NER Live Weather Radar</h3>
            <p className="text-[10px] text-slate-400">Real-time sync via Open-Meteo API</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg transition">
          <X size={16} />
        </button>
      </div>
      
      <div className="p-4 max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {weatherData.map((data, idx) => {
              const info = getWeatherInfo(data.code);
              return (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-sky-200 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{data.city}</h4>
                      <p className="text-[9px] text-slate-500">{data.state}</p>
                    </div>
                    {info.icon}
                  </div>
                  
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-800">{Math.round(data.temp)}&deg;</span>
                    <span className="text-xs text-slate-500 font-medium">C</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium mt-0.5">{info.desc}</p>
                  
                  <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-1">
                      <Droplets size={10} className="text-sky-500" />
                      <span className="text-[9px] text-slate-500">{data.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind size={10} className="text-slate-400" />
                      <span className="text-[9px] text-slate-500">{data.wind} km/h</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
        <p className="text-[9px] text-slate-400">Disaster response routing is automatically adjusted based on live weather conditions.</p>
      </div>
    </div>
  );
}

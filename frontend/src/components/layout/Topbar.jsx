import {
  Search,
  Bell,
  CloudRain,
  User,
  ChevronDown,
  Globe,
} from "lucide-react";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import WeatherPanel from "../WeatherPanel";
import { languages } from "../../i18n/languages";


function Topbar() {

  const { t, i18n } = useTranslation();
  const [showWeatherPanel, setShowWeatherPanel] = useState(false);


  const changeLanguage = async (language) => {

    try {

      await i18n.changeLanguage(language);

      localStorage.setItem(
        "language",
        language
      );

    } catch (error) {

      console.error(
        "Language change failed:",
        error
      );

    }
  };


  return (
    <header className="h-20 shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between">

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-80 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-50 transition">

        <Search
          size={17}
          className="text-slate-400 shrink-0"
        />

        <input
          type="text"
          placeholder={t(
            "common.searchVehiclesRoutes"
          )}
          className="bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 w-full"
        />

        <span className="hidden sm:block text-[9px] text-slate-400 border border-slate-200 bg-white rounded-md px-1.5 py-1">
          Ctrl K
        </span>

      </div>


      {/* =====================================================
          RIGHT SECTION
      ====================================================== */}

      <div className="flex items-center gap-5">

        {/* =================================================
            LANGUAGE
        ================================================== */}

        <div className="flex items-center gap-2">

          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">

            <Globe
              size={17}
              className="text-emerald-600"
            />

          </div>

          <div className="flex flex-col">

            <span className="text-[8px] text-slate-400">
              {t("language.select")}
            </span>

            <select
              value={i18n.resolvedLanguage || "en"}
              onChange={(event) =>
                changeLanguage(
                  event.target.value
                )
              }
              aria-label={t(
                "language.select"
              )}
              className="bg-white text-[10px] font-semibold text-slate-700 outline-none cursor-pointer"
            >

              {languages.map(
                (language) => (

                  <option
                    key={language.code}
                    value={language.code}
                  >
                    {language.nativeName}
                  </option>

                )
              )}

            </select>

          </div>

        </div>


        {/* =================================================
            WEATHER
        ================================================== */}

        <div className="hidden lg:flex items-center gap-3">

          <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">

            <CloudRain
              size={17}
              className="text-sky-500"
            />

          </div>

          <div>

            <p className="text-sm font-semibold text-slate-800">
              24°C
            </p>

            <p className="text-[10px] text-slate-400">
              {t("common.rainy")} •{" "}
              {t("common.northeastIndia")}
            </p>

          </div>

        </div>


        {/* =================================================
            DIVIDER
        ================================================== */}

        <div className="hidden md:block h-8 w-px bg-slate-200" />


        {/* =================================================
            NOTIFICATIONS
        ================================================== */}

        <button
          type="button"
          className="relative w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
          title={t("common.notifications")}
          aria-label={t("common.notifications")}
        >

          <Bell size={17} />

          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />

        </button>


        {/* =================================================
            USER
        ================================================== */}

        <button
          type="button"
          className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:bg-slate-50 rounded-lg transition"
          aria-label={t("common.userMenu")}
        >

          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">

            <User
              size={17}
              className="text-emerald-600"
            />

          </div>

          <div className="hidden sm:block text-left">

            <p className="text-xs font-semibold text-slate-800">
              {t("common.admin")}
            </p>

            <p className="text-[9px] text-slate-400">
              {t("common.controlCenter")}
            </p>

          </div>

          <ChevronDown
            size={14}
            className="hidden sm:block text-slate-400"
          />

        </button>

      </div>

    </header>
  );
}


export default Topbar;
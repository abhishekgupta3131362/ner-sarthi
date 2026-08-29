import { useEffect, useRef, useState } from "react";

import {
  MapPin,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";

console.log("LOCATION AUTOCOMPLETE LOADED");

function LocationAutocomplete({
  value = "",
  onChange,
  onSelect,
  placeholder = "Search road, city, landmark...",
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // =========================================================
  // GEOAPIFY API KEY
  // =========================================================

  const API_KEY =
    import.meta.env.VITE_GEOAPIFY_API_KEY;

  console.log(
    "GEOAPIFY KEY:",
    API_KEY ? "FOUND" : "NOT FOUND"
  );

  // =========================================================
  // FETCH SUGGESTIONS
  // =========================================================

  const fetchSuggestions = async (searchText) => {
    if (!searchText || searchText.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!API_KEY) {
      setError(
        "Geoapify API key is missing. Check your .env file."
      );

      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const url =
        `https://api.geoapify.com/v1/geocode/autocomplete?` +
        `text=${encodeURIComponent(searchText)}` +
        `&limit=6` +
        `&filter=countrycode:in` +
        `&apiKey=${API_KEY}`;

      console.log("Geoapify request:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Location search failed (${response.status})`
        );
      }

      const data = await response.json();

      console.log("Geoapify response:", data);

      const results = data.features || [];

      setSuggestions(results);

      setShowSuggestions(
        results.length > 0
      );
    } catch (err) {
      console.error(
        "Geoapify error:",
        err
      );

      setError(
        "Unable to load location suggestions."
      );

      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DEBOUNCE SEARCH
  // =========================================================

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value.trim());
    }, 400);

    return () => {
      clearTimeout(debounceRef.current);
    };
  }, [value]);

  // =========================================================
  // OUTSIDE CLICK
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =========================================================
  // SELECT LOCATION
  // =========================================================

  const handleSelect = (feature) => {
    if (!feature) return;

    const properties =
      feature.properties || {};

    const coordinates =
      feature.geometry?.coordinates || [];

    const lng = Number(coordinates[0]);
    const lat = Number(coordinates[1]);

    const formatted =
      properties.formatted ||
      properties.address_line1 ||
      properties.city ||
      properties.name ||
      "";

    const place = {
      formatted,
      name: properties.name || "",
      lat,
      lng,
      city: properties.city || "",
      state: properties.state || "",
      country: properties.country || "",
      postcode: properties.postcode || "",
      countryCode:
        properties.country_code || "",
    };

    console.log(
      "Selected location:",
      place
    );

    onChange?.(formatted);
    onSelect?.(place);

    setSuggestions([]);
    setShowSuggestions(false);
    setError("");
  };

  // =========================================================
  // CLEAR
  // =========================================================

  const handleClear = () => {
    onChange?.("");
    onSelect?.(null);

    setSuggestions([]);
    setShowSuggestions(false);
    setError("");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
    >
      {/* INPUT */}

      <div className="relative">
        <MapPin
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 z-10"
        />

        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value);
            setShowSuggestions(true);
            setError("");
          }}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="
            w-full
            bg-slate-950
            border
            border-slate-800
            rounded-xl
            px-4
            py-3
            pl-11
            pr-20
            text-sm
            text-white
            placeholder:text-slate-700
            outline-none
            focus:border-cyan-400
            transition
          "
        />

        {/* LOADING */}

        {loading && (
          <LoaderCircle
            size={16}
            className="
              absolute
              right-10
              top-1/2
              -translate-y-1/2
              text-cyan-400
              animate-spin
            "
          />
        )}

        {/* CLEAR */}

        {value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              w-6
              h-6
              rounded-md
              flex
              items-center
              justify-center
              text-slate-600
              hover:text-white
              hover:bg-slate-800
              transition
            "
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* SUGGESTIONS */}

      {showSuggestions &&
        suggestions.length > 0 && (
          <div
            className="
              absolute
              z-[100]
              left-0
              right-0
              mt-2
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              shadow-2xl
              overflow-hidden
            "
          >
            {/* HEADER */}

            <div
              className="
                px-3
                py-2
                border-b
                border-slate-800
                flex
                items-center
                gap-2
              "
            >
              <Search
                size={11}
                className="text-slate-600"
              />

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-wider
                  text-slate-600
                "
              >
                Location Suggestions
              </span>
            </div>

            {/* RESULTS */}

            <div className="max-h-64 overflow-y-auto">
              {suggestions.map(
                (feature, index) => {
                  const properties =
                    feature.properties || {};

                  const mainName =
                    properties.name ||
                    properties.address_line1 ||
                    properties.city ||
                    "Unknown location";

                  const secondary =
                    properties.address_line2 ||
                    properties.formatted ||
                    "";

                  return (
                    <button
                      key={
                        properties.place_id ||
                        `${mainName}-${index}`
                      }
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onClick={() =>
                        handleSelect(feature)
                      }
                      className="
                        w-full
                        text-left
                        px-4
                        py-3
                        hover:bg-slate-800
                        transition
                        border-b
                        border-slate-800/70
                        last:border-b-0
                      "
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="
                            w-8
                            h-8
                            rounded-lg
                            bg-cyan-500/10
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          <MapPin
                            size={14}
                            className="text-cyan-400"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="
                              text-xs
                              text-white
                              font-medium
                              truncate
                            "
                          >
                            {mainName}
                          </p>

                          <p
                            className="
                              text-[9px]
                              text-slate-500
                              mt-1
                              line-clamp-2
                            "
                          >
                            {secondary}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* FOOTER */}

            <div
              className="
                px-3
                py-2
                bg-slate-950
                border-t
                border-slate-800
              "
            >
              <p className="text-[7px] text-slate-700">
                Powered by Geoapify
              </p>
            </div>
          </div>
        )}

      {/* ERROR */}

      {error && (
        <p className="text-[8px] text-red-400 mt-2">
          {error}
        </p>
      )}

      {/* HELP */}

      {!error && !value && (
        <p className="text-[8px] text-slate-700 mt-2">
          Start typing a city, road or landmark to
          see location suggestions.
        </p>
      )}
    </div>
  );
}

export default LocationAutocomplete;
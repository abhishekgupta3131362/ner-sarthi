import { useRef, useState } from "react";

import {
  X,
  ImagePlus,
  Navigation,
  Send,
  CheckCircle2,
  LoaderCircle,
  Trash2,
  FileImage,
  LocateFixed,
  MapPin,
} from "lucide-react";

import LocationAutocomplete from "../common/LocationAutocomplete";


/* =========================================================
   FIELD REPORT MODAL
========================================================= */

function FieldReportModal({
  onClose,
  onSubmitted,
}) {

  const fileInputRef = useRef(null);


  /* =========================================================
     FORM
  ========================================================= */

  const [form, setForm] = useState({
    title: "",
    type: "LANDSLIDE",
    severity: "MEDIUM",
    location: "",
    description: "",
  });


  /* =========================================================
     EVIDENCE
  ========================================================= */

  const [evidence, setEvidence] = useState(null);


  /* =========================================================
     GPS / LOCATION
  ========================================================= */

  const [gps, setGps] = useState(null);

  const [gpsLoading, setGpsLoading] =
    useState(false);


  /* =========================================================
     SUBMISSION
  ========================================================= */

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);


  /* =========================================================
     ERROR
  ========================================================= */

  const [error, setError] = useState("");


  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));


    setError("");
  };


  /* =========================================================
     LOCATION SELECT
  ========================================================= */

  const handleLocationSelect = (place) => {

    if (!place) {
      setGps(null);
      return;
    }


    const lat = Number(place.lat);
    const lng = Number(place.lng);


    setForm((prev) => ({
      ...prev,

      location:
        place.formatted ||
        place.name ||
        "",
    }));


    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    ) {

      setGps({
        lat,
        lng,
        accuracy: null,
        source: "LOCATION_SEARCH",
      });

    }


    setError("");
  };


  /* =========================================================
     EVIDENCE UPLOAD
  ========================================================= */

  const handleEvidence = (e) => {

    const file =
      e.target.files?.[0];


    if (!file) {
      return;
    }


    /* IMAGE CHECK */

    if (
      !file.type.startsWith("image/")
    ) {

      setError(
        "Please select a valid image file."
      );

      e.target.value = "";

      return;
    }


    /* SIZE CHECK */

    if (
      file.size > 5 * 1024 * 1024
    ) {

      setError(
        "Image size must be less than 5 MB."
      );

      e.target.value = "";

      return;
    }


    setError("");


    const reader = new FileReader();


    reader.onload = () => {

      setEvidence({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result,
      });

    };


    reader.onerror = () => {

      setError(
        "Unable to read the selected image."
      );

    };


    reader.readAsDataURL(file);
  };


  /* =========================================================
     REMOVE EVIDENCE
  ========================================================= */

  const removeEvidence = () => {

    setEvidence(null);


    if (fileInputRef.current) {

      fileInputRef.current.value = "";

    }


    setError("");
  };


  /* =========================================================
     CAPTURE DEVICE GPS
  ========================================================= */

  const captureGPS = () => {

    setError("");


    if (!navigator.geolocation) {

      setError(
        "Geolocation is not supported by this browser."
      );

      return;
    }


    setGpsLoading(true);


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const {
          latitude,
          longitude,
          accuracy,
        } = position.coords;


        setGps({

          lat: latitude,

          lng: longitude,

          accuracy,

          source: "DEVICE_GPS",

        });


        /*
         * If location field is empty,
         * put coordinates into it.
         */

        if (!form.location.trim()) {

          setForm((prev) => ({
            ...prev,

            location:
              `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          }));

        }


        setGpsLoading(false);
      },


      (geoError) => {

        console.error(
          "GPS error:",
          geoError
        );


        setGpsLoading(false);


        let message =
          "Unable to capture GPS location.";


        if (
          geoError.code ===
          geoError.PERMISSION_DENIED
        ) {

          message =
            "Location permission denied. Please allow location access.";

        }


        if (
          geoError.code ===
          geoError.POSITION_UNAVAILABLE
        ) {

          message =
            "Current location is unavailable.";

        }


        if (
          geoError.code ===
          geoError.TIMEOUT
        ) {

          message =
            "GPS request timed out. Please try again.";

        }


        setError(message);
      },


      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }

    );
  };


  /* =========================================================
     VALIDATE FORM
  ========================================================= */

  const validateForm = () => {

    if (!form.title.trim()) {

      return "Please enter an incident title.";

    }


    if (!form.location.trim()) {

      return "Please enter or select the incident location.";

    }


    if (!form.description.trim()) {

      return "Please describe the incident.";

    }


    if (
      !gps ||
      !Number.isFinite(Number(gps.lat)) ||
      !Number.isFinite(Number(gps.lng))
    ) {

      return "Please select a location or capture GPS before submitting.";

    }


    return "";
  };


  /* =========================================================
     SUBMIT REPORT
  ========================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();


    setError("");


    const validationError =
      validateForm();


    if (validationError) {

      setError(validationError);

      return;

    }


    setSubmitting(true);


    try {

      /* =====================================================
         CREATE REPORT
      ===================================================== */

      const report = {

        id:
          `FR-${Date.now()}`,

        title:
          form.title.trim(),

        type:
          form.type,

        severity:
          form.severity,

        location:
          form.location.trim(),

        description:
          form.description.trim(),

        gps: {

          lat:
            Number(gps.lat),

          lng:
            Number(gps.lng),

          accuracy:
            gps.accuracy ?? null,

          source:
            gps.source || "UNKNOWN",

        },

        evidence:
          evidence,

        officer:
          "Current Field Officer",

        vehicles:
          0,

        status:
          "SUBMITTED",

        reportedAt:
          new Date().toLocaleString(),

        createdAt:
          Date.now(),

      };


      /* =====================================================
         GET EXISTING REPORTS
      ===================================================== */

      let existingReports = [];


      try {

        existingReports =
          JSON.parse(
            localStorage.getItem(
              "fieldReports"
            ) || "[]"
          );

        if (
          !Array.isArray(
            existingReports
          )
        ) {

          existingReports = [];

        }

      } catch {

        existingReports = [];

      }


      /* =====================================================
         SAVE REPORT
      ===================================================== */

      const updatedReports = [
        report,
        ...existingReports,
      ];


      localStorage.setItem(
        "fieldReports",
        JSON.stringify(
          updatedReports
        )
      );


      /* =====================================================
         SEND REPORT TO PARENT
      ===================================================== */

      if (onSubmitted) {

        onSubmitted(report);

      }


      /* =====================================================
         SUCCESS
      ===================================================== */

      setSubmitted(true);


    } catch (err) {

      console.error(
        "Report submission error:",
        err
      );


      setError(
        "Unable to submit field report."
      );

    } finally {

      setSubmitting(false);

    }

  };


  /* =========================================================
     SUCCESS SCREEN
  ========================================================= */

  if (submitted) {

    return (

      <div className="
        fixed
        inset-0
        z-[9999]
        bg-black/70
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      ">

        <div className="
          w-full
          max-w-md
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          shadow-2xl
          p-8
          text-center
        ">

          <div className="
            w-16
            h-16
            mx-auto
            rounded-full
            bg-emerald-500/10
            border
            border-emerald-500/20
            flex
            items-center
            justify-center
          ">

            <CheckCircle2
              size={32}
              className="text-emerald-400"
            />

          </div>


          <p className="
            text-[9px]
            uppercase
            tracking-[0.25em]
            text-emerald-400
            mt-5
          ">
            Report Submitted
          </p>


          <h2 className="
            text-xl
            font-bold
            text-white
            mt-2
          ">
            Incident Report Created
          </h2>


          <p className="
            text-xs
            text-slate-500
            mt-3
            leading-5
          ">
            Your field report has been
            successfully recorded and is
            ready for response operations.
          </p>


          <button
            type="button"
            onClick={onClose}
            className="
              w-full
              mt-6
              py-3
              rounded-xl
              bg-cyan-400
              hover:bg-cyan-300
              text-slate-950
              font-bold
              text-sm
              transition
            "
          >
            Done
          </button>

        </div>

      </div>

    );
  }


  /* =========================================================
     MAIN MODAL
  ========================================================= */

  return (

    <div className="
      fixed
      inset-0
      z-[9999]
      bg-black/70
      backdrop-blur-sm
      flex
      items-center
      justify-center
      p-4
    ">

      <div className="
        w-full
        max-w-3xl
        max-h-[92vh]
        overflow-y-auto
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        shadow-2xl
      ">


        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="
          sticky
          top-0
          z-10
          bg-slate-900
          border-b
          border-slate-800
          p-5
          flex
          items-start
          justify-between
        ">

          <div>

            <p className="
              text-[9px]
              uppercase
              tracking-[0.25em]
              text-cyan-400
            ">
              Field Submission
            </p>


            <h2 className="
              text-xl
              font-bold
              text-white
              mt-1
            ">
              Create Incident Report
            </h2>


            <p className="
              text-[10px]
              text-slate-600
              mt-1
            ">
              Submit verified field information for emergency response
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-xl
              bg-slate-950
              border
              border-slate-800
              flex
              items-center
              justify-center
              text-slate-500
              hover:text-white
              transition
            "
          >

            <X size={18} />

          </button>

        </div>


        {/* ===================================================
            FORM
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-5"
        >


          {/* =================================================
              TITLE
          ================================================= */}

          <div>

            <label className="
              text-[9px]
              uppercase
              tracking-wider
              text-slate-600
            ">
              Incident Title
            </label>


            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Example: Landslide blocking road"
              className="
                w-full
                mt-2
                bg-slate-950
                border
                border-slate-800
                rounded-xl
                px-4
                py-3
                text-sm
                text-white
                placeholder:text-slate-700
                outline-none
                focus:border-cyan-400
              "
            />

          </div>


          {/* =================================================
              TYPE + SEVERITY
          ================================================= */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-3
          ">


            {/* TYPE */}

            <div>

              <label className="
                text-[9px]
                uppercase
                tracking-wider
                text-slate-600
              ">
                Incident Type
              </label>


              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="
                  w-full
                  mt-2
                  bg-slate-950
                  border
                  border-slate-800
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  focus:border-cyan-400
                "
              >

                <option value="LANDSLIDE">
                  LANDSLIDE
                </option>

                <option value="FLOODING">
                  FLOODING
                </option>

                <option value="ROAD BLOCK">
                  ROAD BLOCK
                </option>

                <option value="HEAVY RAIN">
                  HEAVY RAIN
                </option>

                <option value="TRAFFIC">
                  TRAFFIC
                </option>

                <option value="WEATHER">
                  WEATHER
                </option>

              </select>

            </div>


            {/* SEVERITY */}

            <div>

              <label className="
                text-[9px]
                uppercase
                tracking-wider
                text-slate-600
              ">
                Severity
              </label>


              <select
                name="severity"
                value={form.severity}
                onChange={handleChange}
                className="
                  w-full
                  mt-2
                  bg-slate-950
                  border
                  border-slate-800
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  focus:border-cyan-400
                "
              >

                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>

                <option value="CRITICAL">
                  CRITICAL
                </option>

              </select>

            </div>

          </div>


          {/* =================================================
              LOCATION AUTOCOMPLETE
          ================================================= */}

          <div>

            <label className="
              text-[9px]
              uppercase
              tracking-wider
              text-slate-600
            ">
              Incident Location
            </label>


            <div className="mt-2">

              <LocationAutocomplete

                value={
                  form.location
                }

                onChange={(value) => {

                  setForm((prev) => ({
                    ...prev,
                    location: value,
                  }));

                  /*
                   * Do not clear GPS here.
                   * LocationAutocomplete calls
                   * onSelect after the user chooses
                   * a suggestion.
                   */

                  setError("");

                }}

                onSelect={
                  handleLocationSelect
                }

                placeholder="
                  Search road, city, landmark...
                "

              />

            </div>


            {/* LOCATION COORDINATES */}

            {gps &&
              gps.source ===
                "LOCATION_SEARCH" && (

              <div className="
                flex
                items-center
                gap-2
                mt-2
                px-3
                py-2
                rounded-lg
                bg-emerald-500/5
                border
                border-emerald-500/10
              ">

                <CheckCircle2
                  size={11}
                  className="text-emerald-400"
                />


                <span className="
                  text-[8px]
                  text-emerald-400
                ">
                  Coordinates captured
                </span>


                <span className="
                  text-[8px]
                  text-slate-600
                ">
                  {gps.lat.toFixed(5)},
                  {gps.lng.toFixed(5)}
                </span>

              </div>

            )}

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div>

            <label className="
              text-[9px]
              uppercase
              tracking-wider
              text-slate-600
            ">
              Incident Description
            </label>


            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="
                Describe the situation, road condition and possible impact...
              "
              className="
                w-full
                mt-2
                bg-slate-950
                border
                border-slate-800
                rounded-xl
                px-4
                py-3
                text-sm
                text-white
                placeholder:text-slate-700
                outline-none
                resize-none
                focus:border-cyan-400
              "
            />

          </div>


          {/* =================================================
              EVIDENCE + GPS
          ================================================= */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-3
          ">


            {/* =================================================
                EVIDENCE
            ================================================= */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="
                  w-full
                  min-h-[150px]
                  rounded-xl
                  border
                  border-dashed
                  border-slate-700
                  bg-slate-950
                  hover:border-cyan-400
                  transition
                  overflow-hidden
                "
              >

                {evidence ? (

                  <div className="
                    relative
                    w-full
                    h-[150px]
                  ">

                    <img
                      src={evidence.dataUrl}
                      alt="Evidence preview"
                      className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        object-cover
                      "
                    />


                    <div className="
                      absolute
                      inset-0
                      bg-black/60
                      flex
                      flex-col
                      items-center
                      justify-center
                    ">

                      <CheckCircle2
                        size={22}
                        className="text-emerald-400"
                      />


                      <p className="
                        text-[10px]
                        text-white
                        mt-2
                      ">
                        Evidence Attached
                      </p>


                      <p className="
                        text-[8px]
                        text-slate-300
                        mt-1
                        max-w-[80%]
                        truncate
                      ">
                        {evidence.name}
                      </p>

                    </div>

                  </div>

                ) : (

                  <div className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    h-[150px]
                  ">

                    <ImagePlus
                      size={24}
                      className="text-slate-600"
                    />


                    <p className="
                      text-[9px]
                      text-slate-500
                      mt-2
                    ">
                      Attach Evidence
                    </p>


                    <p className="
                      text-[8px]
                      text-slate-700
                      mt-1
                    ">
                      JPG / PNG / WEBP • Max 5 MB
                    </p>

                  </div>

                )}

              </button>


              {/* REMOVE EVIDENCE */}

              {evidence && (

                <button
                  type="button"
                  onClick={removeEvidence}
                  title="Remove evidence"
                  className="
                    absolute
                    top-2
                    right-2
                    w-8
                    h-8
                    rounded-lg
                    bg-black/70
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                    text-red-400
                    hover:text-red-300
                    transition
                  "
                >

                  <Trash2 size={13} />

                </button>

              )}


              <input
                ref={fileInputRef}
                type="file"
                accept="
                  image/png,
                  image/jpeg,
                  image/jpg,
                  image/webp
                "
                onChange={handleEvidence}
                className="hidden"
              />

            </div>


            {/* =================================================
                GPS
            ================================================= */}

            <button
              type="button"
              onClick={captureGPS}
              disabled={gpsLoading}
              className={`
                min-h-[150px]
                rounded-xl
                border
                border-dashed
                transition
                ${
                  gps &&
                  gps.source ===
                    "DEVICE_GPS"

                    ? "border-emerald-500/40 bg-emerald-500/5"

                    : "border-slate-700 bg-slate-950 hover:border-cyan-400"
                }
              `}
            >

              {gpsLoading ? (

                <div className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  h-[150px]
                ">

                  <LoaderCircle
                    size={24}
                    className="
                      text-cyan-400
                      animate-spin
                    "
                  />


                  <p className="
                    text-[9px]
                    text-cyan-400
                    mt-2
                  ">
                    Capturing GPS...
                  </p>


                  <p className="
                    text-[8px]
                    text-slate-700
                    mt-1
                  ">
                    Waiting for device location
                  </p>

                </div>

              ) : gps &&
                gps.source ===
                  "DEVICE_GPS" ? (

                <div className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  h-[150px]
                ">

                  <CheckCircle2
                    size={24}
                    className="text-emerald-400"
                  />


                  <p className="
                    text-[9px]
                    text-emerald-400
                    mt-2
                  ">
                    GPS Captured
                  </p>


                  <p className="
                    text-[8px]
                    text-slate-500
                    mt-1
                  ">
                    {gps.lat.toFixed(5)},{" "}
                    {gps.lng.toFixed(5)}
                  </p>


                  {gps.accuracy !== null &&
                    gps.accuracy !==
                      undefined && (

                    <p className="
                      text-[7px]
                      text-slate-700
                      mt-1
                    ">
                      Accuracy ±
                      {Math.round(
                        gps.accuracy
                      )}
                      m
                    </p>

                  )}

                </div>

              ) : (

                <div className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  h-[150px]
                ">

                  <LocateFixed
                    size={24}
                    className="text-slate-600"
                  />


                  <p className="
                    text-[9px]
                    text-slate-500
                    mt-2
                  ">
                    Capture GPS
                  </p>


                  <p className="
                    text-[8px]
                    text-slate-700
                    mt-1
                  ">
                    Use current device location
                  </p>

                </div>

              )}

            </button>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="
              flex
              items-start
              gap-2
              p-3
              rounded-xl
              bg-red-500/10
              border
              border-red-500/20
            ">

              <AlertIcon />


              <p className="
                text-xs
                text-red-400
                leading-5
              ">
                {error}
              </p>

            </div>

          )}


          {/* =================================================
              SUBMISSION STATUS
          ================================================= */}

          <div className="
            bg-slate-950
            border
            border-slate-800
            rounded-xl
            p-4
          ">

            <div className="
              flex
              items-center
              gap-2
            ">

              <FileImage
                size={14}
                className="text-cyan-400"
              />


              <p className="
                text-[9px]
                uppercase
                tracking-wider
                text-slate-600
              ">
                Submission Status
              </p>

            </div>


            <div className="
              grid
              grid-cols-3
              gap-3
              mt-3
            ">

              <SummaryItem
                label="Location"
                value={
                  gps
                    ? "READY"
                    : "PENDING"
                }
                ready={
                  Boolean(gps)
                }
              />


              <SummaryItem
                label="Evidence"
                value={
                  evidence
                    ? "ATTACHED"
                    : "OPTIONAL"
                }
                ready={
                  Boolean(evidence)
                }
              />


              <SummaryItem
                label="Details"
                value={
                  form.title.trim() &&
                  form.description.trim()
                    ? "READY"
                    : "PENDING"
                }
                ready={
                  Boolean(
                    form.title.trim() &&
                    form.description.trim()
                  )
                }
              />

            </div>

          </div>


          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            disabled={submitting}
            className="
              w-full
              py-3.5
              rounded-xl
              bg-cyan-400
              hover:bg-cyan-300
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-slate-950
              font-bold
              text-sm
              flex
              items-center
              justify-center
              gap-2
              transition
            "
          >

            {submitting ? (

              <>

                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />

                Submitting Report...

              </>

            ) : (

              <>

                <Send size={16} />

                Submit Field Report

              </>

            )}

          </button>


          <p className="
            text-center
            text-[8px]
            text-slate-700
          ">
            Evidence and report data are stored locally
            in this prototype.
          </p>

        </form>

      </div>

    </div>

  );
}


/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  label,
  value,
  ready,
}) {

  return (

    <div>

      <p className="
        text-[7px]
        uppercase
        text-slate-700
      ">
        {label}
      </p>


      <div className="
        flex
        items-center
        gap-1.5
        mt-1
      ">

        <span
          className={`
            w-1.5
            h-1.5
            rounded-full
            ${
              ready
                ? "bg-emerald-400"
                : "bg-yellow-400"
            }
          `}
        />


        <span
          className={`
            text-[8px]
            ${
              ready
                ? "text-emerald-400"
                : "text-yellow-400"
            }
          `}
        >
          {value}
        </span>

      </div>

    </div>

  );
}


/* =========================================================
   ERROR ICON
========================================================= */

function AlertIcon() {

  return (

    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="
        text-red-400
        shrink-0
        mt-0.5
      "
    >

      <circle
        cx="12"
        cy="12"
        r="10"
      />

      <line
        x1="12"
        y1="8"
        x2="12"
        y2="12"
      />

      <line
        x1="12"
        y1="16"
        x2="12.01"
        y2="16"
      />

    </svg>

  );
}


export default FieldReportModal;
import { useEffect, useMemo, useState } from "react";

import {
  Camera,
  CheckCircle2,
  Clock3,
  FileText,
  ImagePlus,
  MapPin,
  Navigation,
  Search,
  Send,
  ShieldAlert,
  User,
  X,
} from "lucide-react";

import { getFieldReports, createFieldReport } from "../services/api";

/* =========================================================
   HELPERS
========================================================= */

const severityClass = (severity) => {

  if (severity === "CRITICAL") {
    return "text-red-600 bg-red-50 border-red-200";
  }

  if (severity === "HIGH") {
    return "text-orange-600 bg-orange-50 border-orange-200";
  }

  if (severity === "MEDIUM") {
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  }

  return "text-emerald-600 bg-emerald-50 border-emerald-200";
};


const getCurrentTime = () => {

  return new Date().toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

};


/* =========================================================
   MAIN COMPONENT
========================================================= */

function FieldReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getFieldReports()
      .then((data) => {
        if (!mounted) return;
        const formatted = data.map((rpt) => ({
          ...rpt,
          id: String(rpt.id),
          title: rpt.category,
          type: rpt.category,
          severity: "MEDIUM",
          location: rpt.location_name,
          road: rpt.location_name,
          reporter: rpt.submitted_by,
          time: new Date(rpt.created_at).toLocaleString(),
        }));
        setReports(formatted);
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");

  const [showForm, setShowForm] =
    useState(false);

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [toast, setToast] =
    useState("");


  /* =======================================================
     FORM STATE
  ======================================================= */

  const [form, setForm] = useState({

    title: "",
    type: "Landslide",
    severity: "MEDIUM",
    location: "",
    road: "",
    latitude: "",
    longitude: "",
    reporter: "",
    description: "",
    image: null,

  });


  /* =======================================================
     TOAST
  ======================================================= */

  const notify = (message) => {

    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2500);

  };


  /* =======================================================
     FILTER REPORTS
  ======================================================= */

  const filteredReports = useMemo(() => {

    const query =
      search
        .trim()
        .toLowerCase();

    return reports.filter((report) => {

      const matchesSearch =
        !query ||
        report.id
          .toLowerCase()
          .includes(query) ||
        report.title
          .toLowerCase()
          .includes(query) ||
        report.location
          .toLowerCase()
          .includes(query) ||
        report.road
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "ALL" ||
        report.severity === filter;

      return (
        matchesSearch &&
        matchesFilter
      );

    });

  }, [
    reports,
    search,
    filter,
  ]);


  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const updateForm = (
    field,
    value
  ) => {

    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

  };


  /* =======================================================
     IMAGE
  ======================================================= */

  const handleImage = (event) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    updateForm(
      "image",
      imageUrl
    );

  };


  /* =======================================================
     GPS LOCATION
  ======================================================= */

  const getGPSLocation = () => {

    if (!navigator.geolocation) {

      notify(
        "GPS is not supported by this browser."
      );

      return;

    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        updateForm(
          "latitude",
          position.coords.latitude.toFixed(6)
        );

        updateForm(
          "longitude",
          position.coords.longitude.toFixed(6)
        );

        notify(
          "Current GPS location captured."
        );

      },

      () => {

        notify(
          "Unable to access GPS location."
        );

      }

    );

  };


  /* =======================================================
     SUBMIT REPORT
  ======================================================= */

  const submitReport = (event) => {

    event.preventDefault();


    if (
      !form.title ||
      !form.location ||
      !form.reporter ||
      !form.description
    ) {

      notify(
        "Please fill all required fields."
      );

      return;

    }


    const newReport = {

      id:
        `RPT-${1000 + reports.length + 1}`,

      title:
        form.title,

      type:
        form.type,

      severity:
        form.severity,

      location:
        form.location,

      road:
        form.road ||
        "Road not specified",

      reporter:
        form.reporter,

      description:
        form.description,

      coordinates: [

        Number(
          form.latitude || 0
        ),

        Number(
          form.longitude || 0
        ),

      ],

      image:
        form.image,

      status:
        "SUBMITTED",

      time:
        "Just now",

    };


    setReports((previous) => [

      newReport,
      ...previous,

    ]);


    setForm({

      title: "",
      type: "Landslide",
      severity: "MEDIUM",
      location: "",
      road: "",
      latitude: "",
      longitude: "",
      reporter: "",
      description: "",
      image: null,

    });


    setShowForm(false);

    notify(
      "Incident report submitted successfully."
    );

  };


  return (

    <div className="min-h-screen bg-slate-50 p-6 space-y-6">


      {/* =====================================================
          TOAST
      ====================================================== */}

      {toast && (

        <div className="fixed right-6 bottom-6 z-[5000]">

          <div className="flex items-center gap-3 bg-white border border-emerald-200 shadow-xl rounded-xl px-4 py-3">

            <CheckCircle2
              size={17}
              className="text-emerald-500"
            />

            <span className="text-sm text-slate-700">
              {toast}
            </span>

          </div>

        </div>

      )}


      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Field Operations
            </span>

          </div>


          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Incident Reports
          </h1>


          <p className="text-sm text-slate-500 mt-1">
            Submit geo-tagged incident reports and field evidence
          </p>

        </div>


        <button
          onClick={() =>
            setShowForm(true)
          }
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition"
        >

          <FileText
            size={16}
          />

          New Field Report

        </button>

      </div>


      {/* =====================================================
          KPI
      ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <ReportKpi
          label="Total Reports"
          value={reports.length}
          icon={FileText}
        />

        <ReportKpi
          label="Critical"
          value={
            reports.filter(
              (r) =>
                r.severity ===
                "CRITICAL"
            ).length
          }
          icon={ShieldAlert}
        />

        <ReportKpi
          label="Geo Tagged"
          value={
            reports.filter(
              (r) =>
                r.coordinates?.[0] &&
                r.coordinates?.[1]
            ).length
          }
          icon={MapPin}
        />

        <ReportKpi
          label="Submitted"
          value={
            reports.filter(
              (r) =>
                r.status ===
                "SUBMITTED"
            ).length
          }
          icon={CheckCircle2}
        />

      </div>


      {/* =====================================================
          REPORT LIST
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


        {/* HEADER */}

        <div className="p-5 border-b border-slate-200">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <h2 className="text-base font-semibold text-slate-900">
                Submitted Reports
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Field incidents received from operational teams
              </p>

            </div>


            {/* SEARCH */}

            <div className="relative">

              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search reports..."
                className="w-full lg:w-72 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pl-9 text-sm text-slate-800 outline-none focus:border-emerald-500"
              />

            </div>

          </div>


          {/* FILTER */}

          <div className="flex flex-wrap gap-2 mt-4">

            {[
              "ALL",
              "CRITICAL",
              "HIGH",
              "MEDIUM",
              "LOW",
            ].map((item) => (

              <button
                key={item}
                onClick={() =>
                  setFilter(item)
                }
                className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                  filter === item
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >

                {item}

              </button>

            ))}

          </div>

        </div>


        {/* LIST */}

        <div className="p-4 space-y-3">

          {filteredReports.length ===
          0 ? (

            <div className="py-16 text-center">

              <FileText
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="text-sm text-slate-500 mt-3">
                No reports found.
              </p>

            </div>

          ) : (

            filteredReports.map(
              (report) => (

                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={() =>
                    setSelectedReport(
                      report
                    )
                  }
                />

              )
            )

          )}

        </div>

      </div>


      {/* =====================================================
          NEW REPORT MODAL
      ====================================================== */}

      {showForm && (

        <ReportForm
          form={form}
          updateForm={updateForm}
          handleImage={handleImage}
          getGPSLocation={getGPSLocation}
          submitReport={submitReport}
          onClose={() =>
            setShowForm(false)
          }
        />

      )}


      {/* =====================================================
          REPORT DETAILS
      ====================================================== */}

      {selectedReport && (

        <ReportDetails
          report={
            selectedReport
          }
          onClose={() =>
            setSelectedReport(null)
          }
        />

      )}

    </div>

  );
}


/* =========================================================
   KPI
========================================================= */

function ReportKpi({
  label,
  value,
  icon: Icon,
}) {

  return (

    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">

      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">

        <Icon
          size={17}
          className="text-emerald-600"
        />

      </div>

      <p className="text-xs uppercase tracking-wider text-slate-400 mt-4">
        {label}
      </p>

      <p className="text-2xl font-bold text-slate-900 mt-1">
        {value}
      </p>

    </div>

  );
}


/* =========================================================
   REPORT CARD
========================================================= */

function ReportCard({
  report,
  onClick,
}) {

  return (

    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm transition"
    >

      <div className="flex flex-col lg:flex-row lg:items-center gap-4">

        {/* ICON */}

        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">

          {report.type ===
          "Landslide" ? (

            <ShieldAlert
              size={19}
              className="text-red-500"
            />

          ) : (

            <FileText
              size={19}
              className="text-emerald-600"
            />

          )}

        </div>


        {/* INFO */}

        <div className="flex-1 min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <p className="text-sm font-semibold text-slate-900">
              {report.title}
            </p>

            <span className="text-[10px] text-slate-400">
              {report.id}
            </span>

          </div>


          <div className="flex flex-wrap gap-4 mt-2">

            <span className="flex items-center gap-1 text-xs text-slate-500">

              <MapPin
                size={12}
              />

              {report.location}

            </span>


            <span className="text-xs text-slate-500">
              {report.road}
            </span>


            <span className="flex items-center gap-1 text-xs text-slate-500">

              <User
                size={12}
              />

              {report.reporter}

            </span>

          </div>

        </div>


        {/* RIGHT */}

        <div className="flex items-center gap-3">

          <span
            className={`px-2.5 py-1 rounded-lg border text-[10px] font-semibold ${severityClass(
              report.severity
            )}`}
          >
            {report.severity}
          </span>


          <span className="flex items-center gap-1 text-[10px] text-slate-400">

            <Clock3
              size={11}
            />

            {report.time}

          </span>

        </div>

      </div>

    </button>

  );
}


/* =========================================================
   REPORT FORM
========================================================= */

function ReportForm({
  form,
  updateForm,
  handleImage,
  getGPSLocation,
  submitReport,
  onClose,
}) {

  return (

    <div className="fixed inset-0 z-[7000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-5">

      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200">


        {/* HEADER */}

        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-5 flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-widest text-emerald-600">
              Field Operations
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Create Incident Report
            </h2>

          </div>


          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
          >

            <X
              size={16}
            />

          </button>

        </div>


        {/* FORM */}

        <form
          onSubmit={
            submitReport
          }
          className="p-5 space-y-5"
        >


          {/* TITLE */}

          <Field
            label="Incident Title"
            required
          >

            <input
              value={
                form.title
              }
              onChange={(e) =>
                updateForm(
                  "title",
                  e.target.value
                )
              }
              placeholder="e.g. Road blocked by landslide"
              className="input-field"
            />

          </Field>


          {/* TYPE + SEVERITY */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Field
              label="Incident Type"
            >

              <select
                value={
                  form.type
                }
                onChange={(e) =>
                  updateForm(
                    "type",
                    e.target.value
                  )
                }
                className="input-field"
              >

                <option>Landslide</option>
                <option>Flood</option>
                <option>Road Block</option>
                <option>Accident</option>
                <option>Bridge Damage</option>
                <option>Traffic</option>
                <option>Other</option>

              </select>

            </Field>


            <Field
              label="Severity"
            >

              <select
                value={
                  form.severity
                }
                onChange={(e) =>
                  updateForm(
                    "severity",
                    e.target.value
                  )
                }
                className="input-field"
              >

                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>CRITICAL</option>

              </select>

            </Field>

          </div>


          {/* LOCATION */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Field
              label="Location"
              required
            >

              <input
                value={
                  form.location
                }
                onChange={(e) =>
                  updateForm(
                    "location",
                    e.target.value
                  )
                }
                placeholder="Near Jowai"
                className="input-field"
              />

            </Field>


            <Field
              label="Road / Highway"
            >

              <input
                value={
                  form.road
                }
                onChange={(e) =>
                  updateForm(
                    "road",
                    e.target.value
                  )
                }
                placeholder="NH-06"
                className="input-field"
              />

            </Field>

          </div>


          {/* GPS */}

          <div>

            <div className="flex items-center justify-between mb-2">

              <label className="text-xs font-semibold text-slate-700">
                Geo Location
              </label>


              <button
                type="button"
                onClick={
                  getGPSLocation
                }
                className="flex items-center gap-2 text-xs text-emerald-600 font-semibold hover:text-emerald-700"
              >

                <Navigation
                  size={13}
                />

                Use Current GPS

              </button>

            </div>


            <div className="grid grid-cols-2 gap-3">

              <input
                value={
                  form.latitude
                }
                onChange={(e) =>
                  updateForm(
                    "latitude",
                    e.target.value
                  )
                }
                placeholder="Latitude"
                className="input-field"
              />

              <input
                value={
                  form.longitude
                }
                onChange={(e) =>
                  updateForm(
                    "longitude",
                    e.target.value
                  )
                }
                placeholder="Longitude"
                className="input-field"
              />

            </div>

          </div>


          {/* REPORTER */}

          <Field
            label="Field Officer"
            required
          >

            <input
              value={
                form.reporter
              }
              onChange={(e) =>
                updateForm(
                  "reporter",
                  e.target.value
                )
              }
              placeholder="Officer name / ID"
              className="input-field"
            />

          </Field>


          {/* DESCRIPTION */}

          <Field
            label="Description"
            required
          >

            <textarea
              value={
                form.description
              }
              onChange={(e) =>
                updateForm(
                  "description",
                  e.target.value
                )
              }
              rows={4}
              placeholder="Describe the incident, road condition and immediate impact..."
              className="input-field resize-none"
            />

          </Field>


          {/* PHOTO */}

          <div>

            <label className="text-xs font-semibold text-slate-700">
              Photo Evidence
            </label>


            <label className="mt-2 flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition">

              {form.image ? (

                <img
                  src={
                    form.image
                  }
                  alt="Evidence preview"
                  className="h-full w-full object-cover rounded-xl"
                />

              ) : (

                <>

                  <ImagePlus
                    size={26}
                    className="text-slate-400"
                  />

                  <span className="text-xs text-slate-500 mt-2">
                    Upload incident photograph
                  </span>

                  <span className="text-[10px] text-slate-400 mt-1">
                    JPG, PNG supported
                  </span>

                </>

              )}


              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImage
                }
                className="hidden"
              />

            </label>

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
          >

            <Send
              size={15}
            />

            Submit Incident Report

          </button>

        </form>

      </div>

    </div>

  );
}


/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  required,
  children,
}) {

  return (

    <div>

      <label className="block text-xs font-semibold text-slate-700 mb-2">

        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}

      </label>

      {children}

    </div>

  );
}


/* =========================================================
   REPORT DETAILS
========================================================= */

function ReportDetails({
  report,
  onClose,
}) {

  return (

    <div className="fixed inset-0 z-[7000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-5">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">


        {/* HEADER */}

        <div className="p-5 border-b border-slate-200 flex items-start justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-widest text-emerald-600">
              Incident Report
            </p>

            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {report.id}
            </h2>

          </div>


          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"
          >

            <X
              size={15}
            />

          </button>

        </div>


        <div className="p-5 space-y-4">


          {/* IMAGE */}

          {report.image && (

            <img
              src={
                report.image
              }
              alt="Incident evidence"
              className="w-full h-52 object-cover rounded-xl border border-slate-200"
            />

          )}


          {/* TITLE */}

          <div>

            <div className="flex items-center justify-between gap-3">

              <h3 className="font-semibold text-slate-900">
                {report.title}
              </h3>

              <span
                className={`px-2 py-1 rounded-lg border text-[10px] font-semibold ${severityClass(
                  report.severity
                )}`}
              >
                {report.severity}
              </span>

            </div>

          </div>


          {/* DETAILS */}

          <div className="grid grid-cols-2 gap-3">

            <Detail
              label="Type"
              value={
                report.type
              }
            />

            <Detail
              label="Status"
              value={
                report.status
              }
            />

            <Detail
              label="Location"
              value={
                report.location
              }
            />

            <Detail
              label="Road"
              value={
                report.road
              }
            />

            <Detail
              label="Reporter"
              value={
                report.reporter
              }
            />

            <Detail
              label="Time"
              value={
                report.time
              }
            />

          </div>


          {/* GPS */}

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">

            <div className="flex items-center gap-2">

              <MapPin
                size={14}
                className="text-emerald-600"
              />

              <span className="text-xs font-semibold text-emerald-700">
                Geo-tagged Location
              </span>

            </div>


            <p className="text-xs text-slate-600 mt-2">
              {report.coordinates?.[0] || 0},{" "}
              {report.coordinates?.[1] || 0}
            </p>

          </div>


          {/* DESCRIPTION */}

          <div>

            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              Description
            </p>

            <p className="text-sm text-slate-600 mt-2 leading-6">
              {report.description}
            </p>

          </div>


          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  );
}


/* =========================================================
   DETAIL
========================================================= */

function Detail({
  label,
  value,
}) {

  return (

    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">

      <p className="text-[9px] uppercase text-slate-400">
        {label}
      </p>

      <p className="text-xs font-semibold text-slate-800 mt-1">
        {value}
      </p>

    </div>

  );
}


export default FieldReports;
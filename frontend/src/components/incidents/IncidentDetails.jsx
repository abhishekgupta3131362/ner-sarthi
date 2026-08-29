import {
  CheckCircle2,
  FileText,
  MapPin,
  Navigation,
  User,
  Clock3,
  Truck,
  Camera,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";


function FieldReportDetails({
  report,
  onClose,
  onVerified,
}) {

  if (!report) {
    return null;
  }


  /* =========================================================
     VERIFY REPORT
  ========================================================= */

  const handleVerify = () => {

    const reports =
      JSON.parse(
        localStorage.getItem(
          "fieldReports"
        ) || "[]"
      );


    const updated =
      reports.map((item) =>
        item.id === report.id
          ? {
              ...item,
              status: "VERIFIED",
              verifiedAt:
                new Date().toLocaleString(),
            }
          : item
      );


    localStorage.setItem(
      "fieldReports",
      JSON.stringify(updated)
    );


    const verifiedReport =
      updated.find(
        (item) =>
          item.id === report.id
      );


    if (onVerified) {
      onVerified(
        verifiedReport
      );
    }

  };


  /* =========================================================
     OPEN GOOGLE MAPS
  ========================================================= */

  const openMap = () => {

    if (!report.gps) {
      return;
    }


    const {
      lat,
      lng,
    } = report.gps;


    window.open(
      `https://www.google.com/maps?q=${lat},${lng}`,
      "_blank"
    );

  };


  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">


      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="p-5 border-b border-slate-800 flex items-start justify-between">

        <div>

          <p className="text-[8px] uppercase tracking-[0.2em] text-cyan-400">
            Field Report
          </p>

          <h2 className="text-lg font-bold text-white mt-1">
            {report.id}
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            {report.title}
          </p>

        </div>


        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-slate-600 hover:text-white"
        >

          <X size={15} />

        </button>

      </div>


      <div className="p-5 space-y-4">


        {/* ===================================================
            STATUS
        ==================================================== */}

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[8px] uppercase text-slate-700">
              Report Status
            </p>

            <span
              className={`inline-flex mt-2 px-2.5 py-1 rounded-full text-[8px] border ${
                report.status === "VERIFIED"
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
              }`}
            >
              {report.status}
            </span>

          </div>


          <div className="text-right">

            <p className="text-[8px] uppercase text-slate-700">
              Severity
            </p>

            <p className="text-xs font-semibold text-red-400 mt-2">
              {report.severity}
            </p>

          </div>

        </div>


        {/* ===================================================
            LOCATION
        ==================================================== */}

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

          <div className="flex items-center gap-2">

            <MapPin
              size={14}
              className="text-cyan-400"
            />

            <span className="text-[8px] uppercase tracking-wider text-slate-600">
              Location
            </span>

          </div>


          <p className="text-xs text-white mt-2">
            {report.location}
          </p>


          {report.gps && (

            <>

              <p className="text-[8px] text-slate-600 mt-2">
                GPS:{" "}
                {report.gps.lat.toFixed(6)},{" "}
                {report.gps.lng.toFixed(6)}
              </p>


              <button
                onClick={openMap}
                className="mt-3 text-[9px] text-cyan-400 flex items-center gap-1 hover:text-cyan-300"
              >

                <ExternalLink size={11} />

                Open in Google Maps

              </button>

            </>

          )}

        </div>


        {/* ===================================================
            GPS MAP
        ==================================================== */}

        <div className="relative h-36 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(71,85,105,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(71,85,105,.15) 1px, transparent 1px)",
              backgroundSize:
                "24px 24px",
            }}
          />


          {report.gps && (

            <>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

                <div className="absolute -inset-7 rounded-full bg-cyan-400/5 animate-pulse" />

                <div className="relative w-10 h-10 rounded-full border border-cyan-400 bg-cyan-400/10 flex items-center justify-center">

                  <MapPin
                    size={16}
                    className="text-cyan-400"
                  />

                </div>

              </div>


              <span className="absolute left-3 bottom-3 text-[7px] text-cyan-400 bg-slate-950/90 px-2 py-1 rounded">
                GPS LOCATION
              </span>

            </>

          )}

        </div>


        {/* ===================================================
            REPORT INFORMATION
        ==================================================== */}

        <div>

          <p className="text-[8px] uppercase tracking-wider text-slate-700 mb-3">
            Report Information
          </p>


          <div className="grid grid-cols-2 gap-2">

            <Info
              icon={FileText}
              label="Type"
              value={report.type}
            />

            <Info
              icon={User}
              label="Officer"
              value={report.officer}
            />

            <Info
              icon={Clock3}
              label="Reported"
              value={report.reportedAt}
            />

            <Info
              icon={Truck}
              label="Vehicles"
              value={report.vehicles}
            />

          </div>

        </div>


        {/* ===================================================
            DESCRIPTION
        ==================================================== */}

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

          <p className="text-[8px] uppercase text-slate-700">
            Incident Description
          </p>

          <p className="text-xs text-slate-300 leading-5 mt-2">
            {report.description}
          </p>

        </div>


        {/* ===================================================
            EVIDENCE
        ==================================================== */}

        <div>

          <p className="text-[8px] uppercase tracking-wider text-slate-700 mb-3">
            Evidence
          </p>


          <div className="grid grid-cols-2 gap-2">


            {/* FIELD PHOTO */}

            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">

              {report.evidence?.dataUrl ? (

                <button
                  onClick={() =>
                    window.open(
                      report.evidence.dataUrl,
                      "_blank"
                    )
                  }
                  className="relative w-full h-28 group"
                >

                  <img
                    src={
                      report.evidence.dataUrl
                    }
                    alt="Field evidence"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">

                    <ExternalLink
                      size={16}
                      className="text-white opacity-0 group-hover:opacity-100"
                    />

                  </div>

                </button>

              ) : (

                <div className="h-28 flex flex-col items-center justify-center">

                  <Camera
                    size={18}
                    className="text-slate-700"
                  />

                  <span className="text-[8px] text-slate-700 mt-2">
                    No Field Photo
                  </span>

                </div>

              )}

              <div className="p-2 border-t border-slate-800">

                <p className="text-[7px] uppercase text-slate-600">
                  Field Photo
                </p>

                {report.evidence?.name && (

                  <p className="text-[7px] text-slate-700 mt-1 truncate">
                    {report.evidence.name}
                  </p>

                )}

              </div>

            </div>


            {/* REPORT DATA */}

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">

              <FileText
                size={18}
                className="text-slate-600"
              />

              <p className="text-[8px] text-slate-600 mt-3">
                REPORT DATA
              </p>

              <p className="text-[8px] text-slate-500 mt-2 leading-4">
                {report.type} incident reported by{" "}
                {report.officer}.
              </p>

            </div>

          </div>

        </div>


        {/* ===================================================
            VERIFY BUTTON
        ==================================================== */}

        {report.status !== "VERIFIED" ? (

          <button
            onClick={handleVerify}
            className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition"
          >

            <ShieldCheck size={16} />

            Verify Field Report

          </button>

        ) : (

          <div className="w-full py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2">

            <CheckCircle2 size={16} />

            Field Report Verified

          </div>

        )}

      </div>

    </div>

  );
}


/* =========================================================
   INFO
========================================================= */

function Info({
  icon: Icon,
  label,
  value,
}) {

  return (

    <div className="bg-slate-950 rounded-lg p-3">

      <Icon
        size={12}
        className="text-slate-600"
      />

      <p className="text-[7px] uppercase text-slate-700 mt-2">
        {label}
      </p>

      <p className="text-[9px] text-white mt-1 truncate">
        {value}
      </p>

    </div>

  );
}


export default FieldReportDetails;
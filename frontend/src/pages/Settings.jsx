import { useState } from "react";

import {
  Bell,
  Check,
  ChevronRight,
  Database,
  Globe2,
  Lock,
  Map,
  Moon,
  Save,
  Server,
  Shield,
  SlidersHorizontal,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  UserRound,
  Truck,
  Wifi,
  X,
  Zap,
} from "lucide-react";


/* =========================================================
   MAIN
========================================================= */

function Settings() {

  const [activeSection, setActiveSection] =
    useState("GENERAL");

  const [saved, setSaved] =
    useState(false);


  const [settings, setSettings] =
    useState({

      systemName:
        "Smart Logistics Command",

      region:
        "Northeast India",

      language:
        "English",

      timezone:
        "Asia/Kolkata",

      notifications:
        true,

      criticalAlerts:
        true,

      vehicleAlerts:
        true,

      routeAlerts:
        true,

      incidentAlerts:
        true,

      autoRefresh:
        true,

      refreshRate:
        "30 seconds",

      mapStyle:
        "Dark Operations",

      riskOverlay:
        true,

      liveTracking:
        true,

      aiRecommendations:
        true,

      twoFactor:
        true,

    });


  const updateSetting = (
    key,
    value
  ) => {

    setSettings(
      (previous) => ({
        ...previous,
        [key]: value,
      })
    );

    setSaved(false);

  };


  const handleSave = () => {

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);

  };


  return (

    <div className="p-6 min-h-full bg-slate-50 text-slate-900">


      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">

        <div>

          <div className="flex items-center gap-2">

            <span className="relative flex w-2 h-2">

              <span className="absolute inset-0 rounded-full bg-slate-400 animate-ping opacity-50" />

              <span className="relative w-2 h-2 rounded-full bg-slate-400" />

            </span>

            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
              System Configuration
            </span>

          </div>


          <h1 className="text-3xl font-bold mt-2">
            Settings
          </h1>


          <p className="text-sm text-slate-400 mt-2">
            Configure platform behavior, alerts, GIS and security controls
          </p>

        </div>


        <button
          onClick={handleSave}
          className={`px-5 py-3 rounded-xl text-[9px] font-bold transition flex items-center justify-center gap-2 ${
            saved
              ? "bg-emerald-400 text-slate-950"
              : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
          }`}
        >

          {saved ? (
            <>
              <Check size={14} />
              Saved Successfully
            </>
          ) : (
            <>
              <Save size={14} />
              Save Changes
            </>
          )}

        </button>

      </div>


      {/* =====================================================
          SYSTEM STATUS
      ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">

        <StatusCard
          icon={Server}
          title="API Server"
          value="ONLINE"
          detail="99.98% uptime"
          color="text-emerald-600"
        />

        <StatusCard
          icon={Database}
          title="Database"
          value="CONNECTED"
          detail="MongoDB cluster"
          color="text-cyan-600"
        />

        <StatusCard
          icon={Wifi}
          title="GIS Services"
          value="ACTIVE"
          detail="Live map connection"
          color="text-purple-600"
        />

        <StatusCard
          icon={Shield}
          title="Security"
          value="PROTECTED"
          detail="RBAC enabled"
          color="text-orange-600"
        />

      </div>


      {/* =====================================================
          SETTINGS LAYOUT
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-[230px_minmax(0,1fr)] gap-5">


        {/* ===================================================
            SIDEBAR
        ==================================================== */}

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-3 h-fit">

          <p className="text-[7px] uppercase tracking-widest text-slate-700 px-3 py-2">
            Configuration
          </p>


          <SettingNav
            icon={SlidersHorizontal}
            label="General"
            value="GENERAL"
            active={
              activeSection ===
              "GENERAL"
            }
            onClick={() =>
              setActiveSection(
                "GENERAL"
              )
            }
          />


          <SettingNav
            icon={Bell}
            label="Notifications"
            value="NOTIFICATIONS"
            active={
              activeSection ===
              "NOTIFICATIONS"
            }
            onClick={() =>
              setActiveSection(
                "NOTIFICATIONS"
              )
            }
          />


          <SettingNav
            icon={Map}
            label="GIS & Mapping"
            value="GIS"
            active={
              activeSection ===
              "GIS"
            }
            onClick={() =>
              setActiveSection(
                "GIS"
              )
            }
          />


          <SettingNav
            icon={Zap}
            label="AI & Automation"
            value="AI"
            active={
              activeSection ===
              "AI"
            }
            onClick={() =>
              setActiveSection(
                "AI"
              )
            }
          />


          <SettingNav
            icon={Shield}
            label="Security"
            value="SECURITY"
            active={
              activeSection ===
              "SECURITY"
            }
            onClick={() =>
              setActiveSection(
                "SECURITY"
              )
            }
          />


          <SettingNav
            icon={Smartphone}
            label="System"
            value="SYSTEM"
            active={
              activeSection ===
              "SYSTEM"
            }
            onClick={() =>
              setActiveSection(
                "SYSTEM"
              )
            }
          />

        </div>


        {/* ===================================================
            CONTENT
        ==================================================== */}

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">


          {activeSection ===
            "GENERAL" && (

            <GeneralSettings
              settings={settings}
              updateSetting={
                updateSetting
              }
            />

          )}


          {activeSection ===
            "NOTIFICATIONS" && (

            <NotificationSettings
              settings={settings}
              updateSetting={
                updateSetting
              }
            />

          )}


          {activeSection ===
            "GIS" && (

            <GISSettings
              settings={settings}
              updateSetting={
                updateSetting
              }
            />

          )}


          {activeSection ===
            "AI" && (

            <AISettings
              settings={settings}
              updateSetting={
                updateSetting
              }
            />

          )}


          {activeSection ===
            "SECURITY" && (

            <SecuritySettings
              settings={settings}
              updateSetting={
                updateSetting
              }
            />

          )}


          {activeSection ===
            "SYSTEM" && (

            <SystemSettings
              settings={settings}
              updateSetting={
                updateSetting
              }
            />

          )}

        </div>

      </div>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-5 px-1">

        <div className="flex items-center gap-2">

          <span className="w-2 h-2 rounded-full bg-emerald-400" />

          <span className="text-[8px] text-slate-600">
            Configuration service operational
          </span>

        </div>


        <span className="text-[8px] text-slate-700">
          Configuration version 1.0.0
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   STATUS CARD
========================================================= */

function StatusCard({
  icon: Icon,
  title,
  value,
  detail,
  color,
}) {

  return (

    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">

      <div className="flex items-center justify-between">

        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">

          <Icon
            size={16}
            className={color}
          />

        </div>


        <span className="text-[7px] text-emerald-600">
          ● LIVE
        </span>

      </div>


      <p className="text-[8px] uppercase text-slate-600 mt-4">
        {title}
      </p>


      <p className="text-sm font-bold mt-1">
        {value}
      </p>


      <p className="text-[7px] text-slate-700 mt-1">
        {detail}
      </p>

    </div>

  );
}


/* =========================================================
   NAV
========================================================= */

function SettingNav({
  icon: Icon,
  label,
  active,
  onClick,
}) {

  return (

    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition text-left ${
        active
          ? "bg-cyan-400/10 text-cyan-600"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
      }`}
    >

      <Icon size={14} />

      <span className="text-[9px] font-medium flex-1">
        {label}
      </span>


      {active && (

        <ChevronRight
          size={12}
        />

      )}

    </button>

  );
}


/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {

  return (

    <div className="p-5 border-b border-slate-200">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">

          <Icon
            size={17}
            className="text-cyan-600"
          />

        </div>


        <div>

          <h2 className="font-semibold">
            {title}
          </h2>

          <p className="text-[8px] text-slate-600 mt-1">
            {description}
          </p>

        </div>

      </div>

    </div>

  );
}


/* =========================================================
   GENERAL
========================================================= */

function GeneralSettings({
  settings,
  updateSetting,
}) {

  return (

    <>

      <SectionHeader
        icon={SlidersHorizontal}
        title="General Configuration"
        description="Basic platform preferences and regional configuration"
      />


      <div className="p-5 space-y-5">


        <SettingInput
          label="System Name"
          value={
            settings.systemName
          }
          onChange={(value) =>
            updateSetting(
              "systemName",
              value
            )
          }
        />


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <SelectSetting
            label="Operational Region"
            value={
              settings.region
            }
            options={[
              "Northeast India",
              "North India",
              "South India",
              "Pan India",
            ]}
            onChange={(value) =>
              updateSetting(
                "region",
                value
              )
            }
          />


          <SelectSetting
            label="Language"
            value={
              settings.language
            }
            options={[
              "English",
              "Hindi",
              "Assamese",
              "Bengali",
            ]}
            onChange={(value) =>
              updateSetting(
                "language",
                value
              )
            }
          />

        </div>


        <SelectSetting
          label="Timezone"
          value={
            settings.timezone
          }
          options={[
            "Asia/Kolkata",
            "UTC",
            "Asia/Dhaka",
          ]}
          onChange={(value) =>
            updateSetting(
              "timezone",
              value
            )
          }
        />


        <ToggleSetting
          icon={Moon}
          title="Dark Operations Mode"
          description="Use the dark interface optimized for command-center environments."
          enabled={true}
          disabled
        />

      </div>

    </>

  );
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function NotificationSettings({
  settings,
  updateSetting,
}) {

  return (

    <>

      <SectionHeader
        icon={Bell}
        title="Notification Controls"
        description="Configure operational alerts and notification behavior"
      />


      <div className="p-5 space-y-2">


        <ToggleSetting
          icon={Bell}
          title="System Notifications"
          description="Enable platform-wide notifications."
          enabled={
            settings.notifications
          }
          onChange={(value) =>
            updateSetting(
              "notifications",
              value
            )
          }
        />


        <ToggleSetting
          icon={Shield}
          title="Critical Alerts"
          description="Immediately notify operators about critical incidents."
          enabled={
            settings.criticalAlerts
          }
          onChange={(value) =>
            updateSetting(
              "criticalAlerts",
              value
            )
          }
        />


        <ToggleSetting
          icon={Truck}
          title="Vehicle Alerts"
          description="Notify when fleet vehicles require attention."
          enabled={
            settings.vehicleAlerts
          }
          onChange={(value) =>
            updateSetting(
              "vehicleAlerts",
              value
            )
          }
        />


        <ToggleSetting
          icon={Map}
          title="Route Alerts"
          description="Notify operators when route conditions change."
          enabled={
            settings.routeAlerts
          }
          onChange={(value) =>
            updateSetting(
              "routeAlerts",
              value
            )
          }
        />


        <ToggleSetting
          icon={Shield}
          title="Incident Alerts"
          description="Receive notifications for newly detected incidents."
          enabled={
            settings.incidentAlerts
          }
          onChange={(value) =>
            updateSetting(
              "incidentAlerts",
              value
            )
          }
        />

      </div>

    </>

  );
}


/* =========================================================
   GIS
========================================================= */

function GISSettings({
  settings,
  updateSetting,
}) {

  return (

    <>

      <SectionHeader
        icon={Map}
        title="GIS & Mapping"
        description="Configure map visualization and live geographic intelligence"
      />


      <div className="p-5 space-y-5">


        <SelectSetting
          label="Map Theme"
          value={
            settings.mapStyle
          }
          options={[
            "Dark Operations",
            "Satellite",
            "Street",
            "Terrain",
          ]}
          onChange={(value) =>
            updateSetting(
              "mapStyle",
              value
            )
          }
        />


        <ToggleSetting
          icon={Map}
          title="Risk Overlay"
          description="Display road-risk and hazard intelligence directly on the map."
          enabled={
            settings.riskOverlay
          }
          onChange={(value) =>
            updateSetting(
              "riskOverlay",
              value
            )
          }
        />


        <ToggleSetting
          icon={Smartphone}
          title="Live Vehicle Tracking"
          description="Display active vehicles and their current positions."
          enabled={
            settings.liveTracking
          }
          onChange={(value) =>
            updateSetting(
              "liveTracking",
              value
            )
          }
        />


        <SelectSetting
          label="Map Refresh Rate"
          value={
            settings.refreshRate
          }
          options={[
            "10 seconds",
            "30 seconds",
            "60 seconds",
            "5 minutes",
          ]}
          onChange={(value) =>
            updateSetting(
              "refreshRate",
              value
            )
          }
        />

      </div>

    </>

  );
}


/* =========================================================
   AI
========================================================= */

function AISettings({
  settings,
  updateSetting,
}) {

  return (

    <>

      <SectionHeader
        icon={Zap}
        title="AI & Automation"
        description="Configure intelligent recommendations and automated analysis"
      />


      <div className="p-5">


        <div className="p-4 rounded-xl bg-purple-500/[0.035] border border-purple-200 mb-5">

          <div className="flex items-center gap-3">

            <Zap
              size={17}
              className="text-purple-600"
            />

            <div>

              <p className="text-[9px] font-semibold">
                AI Decision Engine
              </p>

              <p className="text-[7px] text-purple-600 mt-1">
                MODEL STATUS: ACTIVE
              </p>

            </div>

          </div>


          <p className="text-[8px] text-slate-600 leading-5 mt-3">

            The intelligence engine evaluates route,
            incident, weather and operational signals
            to generate recommendations.

          </p>

        </div>


        <ToggleSetting
          icon={Zap}
          title="AI Recommendations"
          description="Show intelligent recommendations across operational modules."
          enabled={
            settings.aiRecommendations
          }
          onChange={(value) =>
            updateSetting(
              "aiRecommendations",
              value
            )
          }
        />


        <ToggleSetting
          icon={ActivityIcon}
          title="Automatic Analysis"
          description="Continuously analyze incoming operational data."
          enabled={true}
          disabled
        />

      </div>

    </>

  );
}


/* =========================================================
   SECURITY
========================================================= */

function SecuritySettings({
  settings,
  updateSetting,
}) {

  return (

    <>

      <SectionHeader
        icon={Shield}
        title="Security & Access"
        description="Protect platform access and operational permissions"
      />


      <div className="p-5 space-y-4">


        <ToggleSetting
          icon={Lock}
          title="Two-Factor Authentication"
          description="Require additional authentication for privileged accounts."
          enabled={
            settings.twoFactor
          }
          onChange={(value) =>
            updateSetting(
              "twoFactor",
              value
            )
          }
        />


        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">

          <div className="flex items-center gap-3">

            <Shield
              size={15}
              className="text-emerald-600"
            />

            <div>

              <p className="text-[9px] font-semibold">
                Role-Based Access Control
              </p>

              <p className="text-[7px] text-slate-600 mt-1">
                Active across all operational modules
              </p>

            </div>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <SecurityMetric
            title="Admins"
            value="03"
          />

          <SecurityMetric
            title="Managers"
            value="07"
          />

          <SecurityMetric
            title="Field Users"
            value="14"
          />

        </div>

      </div>

    </>

  );
}


/* =========================================================
   SYSTEM
========================================================= */

function SystemSettings({
  settings,
  updateSetting,
}) {

  return (

    <>

      <SectionHeader
        icon={Server}
        title="System Configuration"
        description="Platform services and refresh behavior"
      />


      <div className="p-5 space-y-4">


        <ToggleSetting
          icon={Wifi}
          title="Automatic Data Refresh"
          description="Automatically refresh operational data without manual reload."
          enabled={
            settings.autoRefresh
          }
          onChange={(value) =>
            updateSetting(
              "autoRefresh",
              value
            )
          }
        />


        <SelectSetting
          label="Refresh Interval"
          value={
            settings.refreshRate
          }
          options={[
            "10 seconds",
            "30 seconds",
            "60 seconds",
            "5 minutes",
          ]}
          onChange={(value) =>
            updateSetting(
              "refreshRate",
              value
            )
          }
        />


        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <SystemMetric
            icon={Server}
            title="Backend"
            value="CONNECTED"
            color="text-emerald-600"
          />

          <SystemMetric
            icon={Database}
            title="Database"
            value="CONNECTED"
            color="text-cyan-600"
          />

          <SystemMetric
            icon={Globe2}
            title="GIS"
            value="ACTIVE"
            color="text-purple-600"
          />

          <SystemMetric
            icon={Shield}
            title="Auth"
            value="PROTECTED"
            color="text-orange-600"
          />

        </div>

      </div>

    </>

  );
}


/* =========================================================
   TOGGLE
========================================================= */

function ToggleSetting({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
  disabled = false,
}) {

  return (

    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">

          <Icon
            size={14}
            className={
              enabled
                ? "text-cyan-600"
                : "text-slate-600"
            }
          />

        </div>


        <div>

          <p className="text-[9px] font-semibold">
            {title}
          </p>

          <p className="text-[7px] text-slate-600 mt-1 max-w-xl">
            {description}
          </p>

        </div>

      </div>


      <button
        disabled={disabled}
        onClick={() =>
          onChange?.(!enabled)
        }
        className={`shrink-0 ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
      >

        {enabled ? (

          <ToggleRight
            size={28}
            className="text-cyan-600"
          />

        ) : (

          <ToggleLeft
            size={28}
            className="text-slate-700"
          />

        )}

      </button>

    </div>

  );
}


/* =========================================================
   INPUT
========================================================= */

function SettingInput({
  label,
  value,
  onChange,
}) {

  return (

    <div>

      <label className="text-[8px] uppercase tracking-wider text-slate-600">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-800 outline-none focus:border-cyan-400/40"
      />

    </div>

  );
}


/* =========================================================
   SELECT
========================================================= */

function SelectSetting({
  label,
  value,
  options,
  onChange,
}) {

  return (

    <div>

      <label className="text-[8px] uppercase tracking-wider text-slate-600">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-800 outline-none focus:border-cyan-400/40"
      >

        {options.map(
          (option) => (

            <option
              key={option}
              value={option}
            >
              {option}
            </option>

          )
        )}

      </select>

    </div>

  );
}


/* =========================================================
   SECURITY METRIC
========================================================= */

function SecurityMetric({
  title,
  value,
}) {

  return (

    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">

      <p className="text-[7px] uppercase text-slate-700">
        {title}
      </p>

      <p className="text-xl font-bold mt-2">
        {value}
      </p>

    </div>

  );
}


/* =========================================================
   SYSTEM METRIC
========================================================= */

function SystemMetric({
  icon: Icon,
  title,
  value,
  color,
}) {

  return (

    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">

      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">

        <Icon
          size={14}
          className={color}
        />

      </div>


      <div>

        <p className="text-[7px] uppercase text-slate-700">
          {title}
        </p>

        <p className={`text-[9px] font-semibold mt-1 ${color}`}>
          {value}
        </p>

      </div>

    </div>

  );
}


/* =========================================================
   ACTIVITY ICON
========================================================= */

function ActivityIcon(props) {

  return (
    <Zap {...props} />
  );

}


export default Settings;
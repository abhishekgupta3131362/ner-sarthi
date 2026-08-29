import { useMemo, useState } from "react";

import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  Mail,
  MapPin,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Truck,
  Users as UsersIcon,
  UserCheck,
  UserRound,
  X,
} from "lucide-react";


/* =========================================================
   INITIAL USER DATA
========================================================= */

const initialUsers = [
  {
    id: "USR-001",
    name: "Arjun Sharma",
    role: "Operations Manager",
    department: "Logistics",
    location: "Guwahati",
    status: "ONLINE",
    lastActive: "Just now",
    email: "arjun@smartlogistics.local",
    permissions: "ADMIN",
    assigned: 18,
  },

  {
    id: "USR-002",
    name: "Rahul Das",
    role: "Route Coordinator",
    department: "Routing",
    location: "Tezpur",
    status: "ONLINE",
    lastActive: "2 min ago",
    email: "rahul@smartlogistics.local",
    permissions: "MANAGER",
    assigned: 12,
  },

  {
    id: "USR-003",
    name: "Amit Roy",
    role: "Field Officer",
    department: "Emergency",
    location: "Silchar",
    status: "BUSY",
    lastActive: "5 min ago",
    email: "amit@smartlogistics.local",
    permissions: "FIELD",
    assigned: 9,
  },

  {
    id: "USR-004",
    name: "Vikash Singh",
    role: "Warehouse Manager",
    department: "Inventory",
    location: "Shillong",
    status: "ONLINE",
    lastActive: "1 min ago",
    email: "vikash@smartlogistics.local",
    permissions: "MANAGER",
    assigned: 15,
  },

  {
    id: "USR-005",
    name: "Manish Yadav",
    role: "Fleet Supervisor",
    department: "Fleet",
    location: "Kohima",
    status: "OFFLINE",
    lastActive: "28 min ago",
    email: "manish@smartlogistics.local",
    permissions: "FLEET",
    assigned: 21,
  },

  {
    id: "USR-006",
    name: "Priya Verma",
    role: "Emergency Coordinator",
    department: "Healthcare",
    location: "Guwahati",
    status: "ONLINE",
    lastActive: "3 min ago",
    email: "priya@smartlogistics.local",
    permissions: "EMERGENCY",
    assigned: 7,
  },
];


/* =========================================================
   MAIN
========================================================= */

function Users() {

  const [users, setUsers] =
    useState(initialUsers);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [showAddUser, setShowAddUser] =
    useState(false);


  /* =======================================================
     FILTER USERS
  ======================================================== */

  const filteredUsers =
    useMemo(() => {

      return users.filter(
        (user) => {

          const searchValue =
            search.toLowerCase().trim();

          const matchesSearch =
            user.name
              .toLowerCase()
              .includes(searchValue) ||
            user.role
              .toLowerCase()
              .includes(searchValue) ||
            user.location
              .toLowerCase()
              .includes(searchValue) ||
            user.email
              .toLowerCase()
              .includes(searchValue);


          const matchesFilter =
            filter === "ALL" ||
            user.status === filter ||
            user.permissions === filter;


          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );

    }, [users, search, filter]);


  /* =======================================================
     CREATE USER
  ======================================================== */

  const handleCreateUser = (newUserData) => {

    const newUser = {

      id: `USR-${String(
        users.length + 1
      ).padStart(3, "0")}`,

      name: newUserData.name,

      role: newUserData.role,

      department:
        newUserData.department ||
        "Operations",

      location:
        newUserData.location,

      status: "ONLINE",

      lastActive: "Just now",

      email: newUserData.email,

      permissions:
        newUserData.permissions,

      assigned: 0,

    };


    setUsers((previousUsers) => [
      newUser,
      ...previousUsers,
    ]);


    setShowAddUser(false);


    // Automatically select newly created user
    setSelectedUser(newUser);

  };


  /* =======================================================
     COUNTS
  ======================================================== */

  const totalUsers =
    users.length;

  const onlineUsers =
    users.filter(
      (user) =>
        user.status === "ONLINE"
    ).length;

  const fieldTeams =
    users.filter(
      (user) =>
        user.department ===
        "Emergency"
    ).length;

  const adminUsers =
    users.filter(
      (user) =>
        user.permissions ===
        "ADMIN"
    ).length;


  return (

    <div className="p-6 min-h-screen bg-slate-950 text-white">


      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">

        <div>

          <div className="flex items-center gap-2">

            <span className="relative flex w-2 h-2">

              <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-60" />

              <span className="relative w-2 h-2 rounded-full bg-cyan-400" />

            </span>

            <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-400">
              Access & Operations
            </span>

          </div>


          <h1 className="text-3xl font-bold mt-2">
            Operations Users
          </h1>


          <p className="text-sm text-slate-500 mt-2">
            Manage operational teams, roles and platform access
          </p>

        </div>


        <button
          onClick={() =>
            setShowAddUser(true)
          }
          className="px-4 py-3 rounded-xl bg-cyan-400 text-slate-950 text-[9px] font-bold hover:bg-cyan-300 transition flex items-center justify-center gap-2"
        >

          <Plus size={14} />

          Add User

        </button>

      </div>


      {/* =====================================================
          KPI
      ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">

        <UserKpi
          icon={UsersIcon}
          title="Total Users"
          value={totalUsers}
          text="Registered"
          color="text-cyan-400"
        />

        <UserKpi
          icon={UserCheck}
          title="Online"
          value={onlineUsers}
          text="Active now"
          color="text-emerald-400"
        />

        <UserKpi
          icon={Activity}
          title="Field Teams"
          value={fieldTeams}
          text="Emergency teams"
          color="text-orange-400"
        />

        <UserKpi
          icon={ShieldCheck}
          title="Admins"
          value={adminUsers}
          text="Privileged users"
          color="text-purple-400"
        />

        <UserKpi
          icon={Clock3}
          title="Availability"
          value="92%"
          text="Team readiness"
          color="text-blue-400"
        />

      </div>


      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5">

        <div className="flex flex-col lg:flex-row gap-3">


          {/* SEARCH */}

          <div className="relative flex-1">

            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search users, roles or locations..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-9 pr-3 text-xs text-white outline-none focus:border-cyan-400/40"
            />

          </div>


          {/* FILTER */}

          <div className="flex gap-2 flex-wrap">

            {[
              "ALL",
              "ONLINE",
              "BUSY",
              "OFFLINE",
              "ADMIN",
              "MANAGER",
            ].map(
              (item) => (

                <button
                  key={item}
                  onClick={() =>
                    setFilter(item)
                  }
                  className={`px-3 py-2.5 rounded-lg border text-[7px] transition ${
                    filter === item
                      ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-400"
                      : "bg-slate-950 border-slate-800 text-slate-600 hover:text-white"
                  }`}
                >
                  {item}
                </button>

              )
            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <div
        className={`grid gap-5 ${
          selectedUser
            ? "grid-cols-1 xl:grid-cols-[minmax(0,1fr)_370px]"
            : "grid-cols-1"
        }`}
      >


        {/* ===================================================
            USER TABLE
        ==================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="p-5 border-b border-slate-800 flex items-center justify-between">

            <div>

              <h2 className="font-semibold">
                Team Directory
              </h2>

              <p className="text-xs text-slate-600 mt-1">
                {filteredUsers.length} users displayed
              </p>

            </div>


            <UsersIcon
              size={17}
              className="text-cyan-400"
            />

          </div>


          {/* TABLE HEADER */}

          <div className="hidden lg:grid grid-cols-[2fr_1.3fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-slate-800">

            <span className="text-[7px] uppercase tracking-wider text-slate-700">
              User
            </span>

            <span className="text-[7px] uppercase tracking-wider text-slate-700">
              Role
            </span>

            <span className="text-[7px] uppercase tracking-wider text-slate-700">
              Location
            </span>

            <span className="text-[7px] uppercase tracking-wider text-slate-700">
              Status
            </span>

            <span />

          </div>


          {/* USERS */}

          <div>

            {filteredUsers.length === 0 ? (

              <div className="p-10 text-center">

                <Search
                  size={24}
                  className="mx-auto text-slate-700"
                />

                <p className="text-sm text-slate-500 mt-3">
                  No users found
                </p>

              </div>

            ) : (

              filteredUsers.map(
                (user) => (

                  <UserRow
                    key={user.id}
                    user={user}
                    selected={
                      selectedUser?.id ===
                      user.id
                    }
                    onClick={() =>
                      setSelectedUser(
                        user
                      )
                    }
                  />

                )
              )

            )}

          </div>

        </div>


        {/* DETAILS */}

        {selectedUser && (

          <UserDetails
            user={selectedUser}
            onClose={() =>
              setSelectedUser(null)
            }
          />

        )}

      </div>


      {/* =====================================================
          SECURITY
      ====================================================== */}

      <div className="mt-5 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <div className="flex items-center gap-3">

          <Shield
            size={15}
            className="text-emerald-400"
          />

          <div>

            <p className="text-[9px] font-semibold">
              Role-based access control enabled
            </p>

            <p className="text-[7px] text-slate-600 mt-1">
              Administrative actions are protected by permission levels.
            </p>

          </div>

        </div>


        <span className="text-[8px] text-emerald-400">
          SECURITY STATUS: HEALTHY
        </span>

      </div>


      {/* =====================================================
          ADD USER MODAL
      ====================================================== */}

      {showAddUser && (

        <AddUserModal
          onClose={() =>
            setShowAddUser(false)
          }
          onCreate={
            handleCreateUser
          }
        />

      )}

    </div>
  );
}


/* =========================================================
   KPI
========================================================= */

function UserKpi({
  icon: Icon,
  title,
  value,
  text,
  color,
}) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">

        <Icon
          size={16}
          className={color}
        />

      </div>


      <p className="text-[8px] uppercase text-slate-600 mt-4">
        {title}
      </p>


      <p className="text-xl font-bold mt-1">
        {value}
      </p>


      <p className="text-[7px] text-slate-700 mt-1">
        {text}
      </p>

    </div>

  );
}


/* =========================================================
   USER ROW
========================================================= */

function UserRow({
  user,
  selected,
  onClick,
}) {

  const statusClass =
    user.status === "ONLINE"
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : user.status === "BUSY"
      ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
      : "text-slate-500 bg-slate-800 border-slate-700";


  return (

    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 border-b border-slate-800 transition ${
        selected
          ? "bg-cyan-400/[0.035]"
          : "hover:bg-slate-950"
      }`}
    >

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.3fr_1fr_1fr_80px] gap-3 lg:gap-4 items-center">


        {/* USER */}

        <div className="flex items-center gap-3">

          <div className="relative">

            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">

              <UserRound
                size={16}
                className={
                  selected
                    ? "text-cyan-400"
                    : "text-slate-500"
                }
              />

            </div>


            <span
              className={`absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                user.status === "ONLINE"
                  ? "bg-emerald-400"
                  : user.status === "BUSY"
                  ? "bg-orange-400"
                  : "bg-slate-600"
              }`}
            />

          </div>


          <div className="min-w-0">

            <p className="text-xs font-semibold text-white">
              {user.name}
            </p>

            <p className="text-[7px] text-slate-600 mt-1">
              {user.id} • {user.email}
            </p>

          </div>

        </div>


        {/* ROLE */}

        <div>

          <p className="text-[9px] text-slate-300">
            {user.role}
          </p>

          <p className="text-[7px] text-slate-700 mt-1">
            {user.department}
          </p>

        </div>


        {/* LOCATION */}

        <div className="flex items-center gap-1">

          <MapPin
            size={10}
            className="text-slate-700"
          />

          <span className="text-[8px] text-slate-500">
            {user.location}
          </span>

        </div>


        {/* STATUS */}

        <div>

          <span
            className={`inline-flex px-2 py-1 rounded border text-[7px] ${statusClass}`}
          >
            {user.status}
          </span>

          <p className="text-[7px] text-slate-700 mt-1">
            {user.lastActive}
          </p>

        </div>


        <div className="flex justify-end">

          <ChevronRight
            size={14}
            className={
              selected
                ? "text-cyan-400"
                : "text-slate-700"
            }
          />

        </div>

      </div>

    </button>

  );
}


/* =========================================================
   USER DETAILS
========================================================= */

function UserDetails({
  user,
  onClose,
}) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-fit">

      <div className="p-5 border-b border-slate-800 flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="relative">

            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">

              <UserRound
                size={19}
                className="text-cyan-400"
              />

            </div>

            <span className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />

          </div>


          <div>

            <p className="text-[7px] uppercase text-slate-700">
              Team Member
            </p>

            <h2 className="text-sm font-bold mt-1">
              {user.name}
            </h2>

          </div>

        </div>


        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-slate-600 hover:text-white"
        >

          <X size={14} />

        </button>

      </div>


      <div className="p-5">

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

          <p className="text-[7px] uppercase text-slate-700">
            Assigned Role
          </p>

          <p className="text-sm font-semibold mt-2">
            {user.role}
          </p>

          <p className="text-[8px] text-slate-600 mt-1">
            {user.department} Department
          </p>

        </div>


        <div className="grid grid-cols-2 gap-3 mt-4">

          <Detail
            icon={Truck}
            label="Assignments"
            value={user.assigned}
            color="text-blue-400"
          />

          <Detail
            icon={Activity}
            label="Availability"
            value="94%"
            color="text-emerald-400"
          />

          <Detail
            icon={Clock3}
            label="Last Active"
            value={user.lastActive}
            color="text-orange-400"
          />

          <Detail
            icon={ShieldCheck}
            label="Access"
            value={user.permissions}
            color="text-purple-400"
          />

        </div>


        <div className="mt-5">

          <p className="text-[8px] uppercase tracking-wider text-slate-700">
            Contact
          </p>


          <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">

            <Mail
              size={14}
              className="text-slate-500"
            />

            <span className="text-[8px] text-slate-400">
              {user.email}
            </span>

          </div>


          <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">

            <MapPin
              size={14}
              className="text-slate-500"
            />

            <span className="text-[8px] text-slate-400">
              {user.location}
            </span>

          </div>

        </div>


        <div className="mt-5 p-4 rounded-xl bg-purple-500/[0.035] border border-purple-500/20">

          <div className="flex items-center gap-2">

            <Shield
              size={13}
              className="text-purple-400"
            />

            <span className="text-[8px] uppercase tracking-wider text-purple-400">
              Permission Level
            </span>

          </div>


          <p className="text-sm font-bold mt-2">
            {user.permissions}
          </p>


          <p className="text-[8px] text-slate-600 leading-5 mt-2">
            This access level controls which operational
            modules and actions are available to the user.
          </p>

        </div>


        <div className="grid grid-cols-2 gap-2 mt-4">

          <button className="py-3 rounded-xl bg-cyan-400 text-slate-950 text-[9px] font-bold hover:bg-cyan-300 transition flex items-center justify-center gap-2">

            <Edit3 size={12} />

            Edit User

          </button>


          <button className="py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-[9px] hover:text-white transition">

            Manage Access

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
  icon: Icon,
  label,
  value,
  color,
}) {

  return (

    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

      <Icon
        size={14}
        className={color}
      />

      <p className="text-[7px] uppercase text-slate-700 mt-2">
        {label}
      </p>

      <p className="text-sm font-bold mt-1">
        {value}
      </p>

    </div>

  );
}


/* =========================================================
   ADD USER MODAL
========================================================= */

function AddUserModal({
  onClose,
  onCreate,
}) {

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      role: "",
      department: "",
      location: "",
      permissions: "FIELD",
    });


  const [error, setError] =
    useState("");


  const handleChange = (
    field,
    value
  ) => {

    setForm(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );

  };


  const handleSubmit = (
    event
  ) => {

    event.preventDefault();


    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.role.trim() ||
      !form.location.trim()
    ) {

      setError(
        "Please fill all required fields."
      );

      return;

    }


    onCreate(form);

  };


  return (

    <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">

      <form
        onSubmit={
          handleSubmit
        }
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
      >


        {/* HEADER */}

        <div className="p-5 border-b border-slate-800 flex items-center justify-between">

          <div>

            <h2 className="font-semibold">
              Add Operations User
            </h2>

            <p className="text-[8px] text-slate-600 mt-1">
              Create a new operational account
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-slate-600 hover:text-white"
          >

            <X size={14} />

          </button>

        </div>


        {/* FORM */}

        <div className="p-5 space-y-4">


          <Input
            label="Full Name *"
            placeholder="Enter full name"
            value={form.name}
            onChange={(value) =>
              handleChange(
                "name",
                value
              )
            }
          />


          <Input
            label="Email Address *"
            placeholder="Enter email"
            value={form.email}
            onChange={(value) =>
              handleChange(
                "email",
                value
              )
            }
          />


          <div className="grid grid-cols-2 gap-3">

            <Input
              label="Role *"
              placeholder="Operations Manager"
              value={form.role}
              onChange={(value) =>
                handleChange(
                  "role",
                  value
                )
              }
            />


            <Input
              label="Location *"
              placeholder="Guwahati"
              value={form.location}
              onChange={(value) =>
                handleChange(
                  "location",
                  value
                )
              }
            />

          </div>


          <Input
            label="Department"
            placeholder="Logistics"
            value={form.department}
            onChange={(value) =>
              handleChange(
                "department",
                value
              )
            }
          />


          <div>

            <label className="text-[8px] uppercase tracking-wider text-slate-600">
              Permission Level
            </label>

            <select
              value={
                form.permissions
              }
              onChange={(e) =>
                handleChange(
                  "permissions",
                  e.target.value
                )
              }
              className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-xs text-white outline-none"
            >

              <option value="FIELD">
                FIELD
              </option>

              <option value="FLEET">
                FLEET
              </option>

              <option value="MANAGER">
                MANAGER
              </option>

              <option value="EMERGENCY">
                EMERGENCY
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

            </select>

          </div>


          {/* ERROR */}

          {error && (

            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">

              <p className="text-[9px] text-red-400">
                {error}
              </p>

            </div>

          )}


          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-[9px] hover:bg-cyan-300 transition flex items-center justify-center gap-2"
          >

            <CheckCircle2
              size={13}
            />

            Create User

          </button>

        </div>

      </form>

    </div>

  );
}


/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  placeholder,
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
        placeholder={placeholder}
        className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
      />

    </div>

  );
}


export default Users;
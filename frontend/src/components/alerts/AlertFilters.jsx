import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

function AlertFilters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  unreadOnly,
  setUnreadOnly,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">

      <div className="flex flex-col xl:flex-row gap-3 justify-between">

        {/* Search */}
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 xl:w-96">

          <Search
            size={16}
            className="text-slate-600"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search alerts..."
            className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-600"
          />

        </div>

        <div className="flex flex-wrap items-center gap-2">

          <SlidersHorizontal
            size={16}
            className="text-slate-600"
          />

          {[
            "ALL",
            "CRITICAL",
            "WARNING",
            "INFO",
            "SUCCESS",
          ].map((type) => (

            <button
              key={type}
              onClick={() =>
                setTypeFilter(type)
              }
              className={`px-3 py-2 rounded-lg text-[10px] border transition ${
                typeFilter === type
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-slate-950 border-slate-800 text-slate-500 hover:text-white"
              }`}
            >
              {type}
            </button>

          ))}

          <button
            onClick={() =>
              setUnreadOnly(!unreadOnly)
            }
            className={`px-3 py-2 rounded-lg text-[10px] border transition ${
              unreadOnly
                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                : "bg-slate-950 border-slate-800 text-slate-500"
            }`}
          >
            UNREAD ONLY
          </button>

        </div>

      </div>

    </div>
  );
}

export default AlertFilters;
import re

with open('src/components/layout/Topbar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Modify User menu to be a Logout button
old_user_button = '''        <button
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

            <p className="text-[11px] font-bold text-slate-800">
              Dr. R. Sharma
            </p>

            <p className="text-[9px] text-slate-500 uppercase tracking-widest">
              State Node
            </p>

          </div>

          <ChevronDown
            size={14}
            className="text-slate-400 hidden sm:block"
          />

        </button>'''

new_user_button = '''        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("user");
            window.location.reload();
          }}
          className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:bg-red-50 rounded-lg transition group"
          aria-label="Logout"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-red-100 group-hover:border-red-200 transition">
            <User size={17} className="text-emerald-600 group-hover:text-red-600 transition" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[11px] font-bold text-slate-800 group-hover:text-red-700 transition">Logout</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest group-hover:text-red-500 transition">End Session</p>
          </div>
        </button>'''

content = content.replace(old_user_button, new_user_button)

with open('src/components/layout/Topbar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Topbar Logout Added!')

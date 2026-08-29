import re

content = open('src/components/layout/Sidebar.jsx', 'r', encoding='utf-8').read()

if 'LogOut' not in content:
    content = content.replace('Settings,', 'Settings,\n  LogOut,')

logout_button = '''          <NavItem
            item={{
              nameKey: "common.settings",
              path: "/settings",
              icon: Settings,
            }}
          />

          <button
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              localStorage.removeItem("user");
              window.location.reload();
            }}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition group mt-2"
          >
            <LogOut size={16} className="text-red-500 group-hover:text-red-600" />
            <span className="text-sm font-semibold">Logout</span>
          </button>'''

# We need to escape braces for regex, or just use string replace.
old_string = '''          <NavItem
            item={{
              nameKey: "common.settings",
              path: "/settings",
              icon: Settings,
            }}
          />'''

content = content.replace(old_string, logout_button)

open('src/components/layout/Sidebar.jsx', 'w', encoding='utf-8').write(content)
print('Logout button added to Sidebar!')

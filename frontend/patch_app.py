import re
content = open('src/App.jsx', encoding='utf-8').read()

if 'import Login' not in content:
    content = content.replace('import Dashboard', 'import Login from "./pages/Login";\nimport Dashboard')

if 'useState' not in content:
    content = content.replace('import {', 'import { useState, useEffect } from "react";\nimport {', 1)

main_app_pattern = r'(function App\(\) \{\n)(  return \()'
main_app_replacement = '''function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return ('''

content = re.sub(main_app_pattern, main_app_replacement, content)

open('src/App.jsx', 'w', encoding='utf-8').write(content)
print('App.jsx patched for Login!')

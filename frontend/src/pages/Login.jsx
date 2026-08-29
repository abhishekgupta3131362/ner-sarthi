import React, { useState } from "react";
import { Shield, Lock, User, ArrowRight, Activity, Mail, Building } from "lucide-react";

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(true);
  
  // Form States
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("NDRF");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister 
        ? { name, department, email, password }
        : { email, password };
        
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setErrorMsg(data.detail || "Authentication failed");
        setLoading(false);
        return;
      }
      
      // Store user info in localStorage for display in app if needed
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      setLoading(false);
      onLogin(); // Proceed to dashboard
      
    } catch (err) {
      setErrorMsg("Network error. Unable to connect to server.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden py-10">
      
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0wIDIwaDQwdjIwSDB6bTAgMjBoNDB2MjBIMHptMjAtMjB2NDBNMjAgMHY0ME0wIDIwaDQwTTIwIDBoMjB2NDBIMjB6Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 relative">
            <Activity className="text-white absolute" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight text-center">
            NER-SARTHI
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest">
            Command Center
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-slate-900/50 p-1 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${!isRegister ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Login
          </button>
          <button 
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${isRegister ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-semibold p-3 rounded-xl flex items-center justify-center animate-in fade-in">
              {errorMsg}
            </div>
          )}

          
          {isRegister && (
            <>
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-500" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300 delay-75">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Department / Agency
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building size={18} className="text-slate-500" />
                  </div>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option value="NDRF">NDRF (National Disaster Response Force)</option>
                    <option value="SDRF">SDRF (State Disaster Response Force)</option>
                    <option value="MoHFW">MoHFW (Health Ministry)</option>
                    <option value="POLICE">State Police Dept</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Govt Email / ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-500" />
              </div>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ndma.gov.in"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Secure Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-500" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isRegister ? "Register & Authorize" : "Authenticate"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* Footer info */}
        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded-md">
            <Shield size={12} /> Secure Connection
          </div>
          <p className="text-[10px] text-slate-500 max-w-[250px]">
            {isRegister 
              ? "Your registration will be pending approval from the Central Grid Administrator." 
              : "Authorized personnel only. Access to the North East Region disaster response grid is heavily monitored."}
          </p>
        </div>

      </div>
    </div>
  );
}

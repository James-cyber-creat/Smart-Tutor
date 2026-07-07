import React, { useState } from "react";
import { 
  Shield, Server, Activity, Users, Database, Globe, RefreshCw, 
  ToggleLeft, ToggleRight, CheckCircle, Flame, Lock
} from "lucide-react";

export default function AdminDashboard() {
  const [activeModel, setActiveModel] = useState("gemini-3.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [rateLimit, setRateLimit] = useState(60); // Calls per min
  const [strictMode, setStrictMode] = useState(true);

  // Mock health metrics
  const logs = [
    { time: "10:51:02", service: "Tutor API", status: "200 OK", latency: "142ms", tokenCount: 412 },
    { time: "10:50:45", service: "Lab Grader", status: "200 OK", latency: "312ms", tokenCount: 890 },
    { time: "10:48:32", service: "Study Planner", status: "200 OK", latency: "220ms", tokenCount: 512 },
    { time: "10:45:15", service: "Coursework AI", status: "200 OK", latency: "420ms", tokenCount: 1240 }
  ];

  // Entity counts
  const institutions = [
    { name: "Technical & Vocational Training Institute (TVET)", departmentCount: 5, coursesCount: 14, userCount: 420 },
    { name: "Secondary Advanced Academy", departmentCount: 3, coursesCount: 9, userCount: 280 },
    { name: "St. Jude University of Engineering", departmentCount: 8, coursesCount: 22, userCount: 980 }
  ];

  return (
    <div className="space-y-6">
      
      {/* SECTION HEADER */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-100 shadow-sm">
        <h2 className="text-xl font-black text-slate-850 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" /> Administrative Command Center
        </h2>
        <p className="text-xs text-slate-500">Configure LLM architectures, monitor latency logs, and manage institutional profiles</p>
      </div>

      {/* ADMIN CONTROL BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ORCHESTRATION CONTROLS */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-indigo-600" /> AI Model Orchestrator
            </h3>
            <p className="text-[10px] text-slate-500">Scale neural properties across institutional tenants</p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-500">Primary Inference Model</label>
              <select 
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="w-full bg-slate-50 border rounded-xl p-2.5 outline-none text-slate-700 font-medium"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Optimized Speed)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Extreme Reasoning)</option>
                <option value="omni-flash-agents">Omni Flash Agents (Socratic Multi-turn)</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-slate-500">
                <label className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> Creativity Temperature</label>
                <span>{temperature}</span>
              </div>
              <input 
                type="range"
                min={0.1}
                max={1.0}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-500 block">Global Rate Limit (Throttles/min)</label>
              <input 
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(Number(e.target.value))}
                className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono text-slate-700"
              />
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div>
                <span className="font-bold text-slate-700 block text-[11px]">Strict Academic Guardrails</span>
                <span className="text-[9px] text-slate-400 block">Prevents homework answering shortcuts</span>
              </div>
              <button 
                onClick={() => setStrictMode(!strictMode)}
                className="text-indigo-600 focus:outline-none"
              >
                {strictMode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* LOG MONITORING TELEMETRY */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-500" /> Live AI Inference Log Monitor
              </h3>
              <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Live Streams
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px] border-collapse font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">Inference Target</th>
                    <th className="pb-2">HTTPS Header</th>
                    <th className="pb-2">Mean Latency</th>
                    <th className="pb-2 text-right">In/Out Tokens</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/55">
                      <td className="py-2.5 text-slate-400">{log.time}</td>
                      <td className="py-2.5 font-bold text-slate-600">{log.service}</td>
                      <td className="py-2.5 text-emerald-600 font-bold">{log.status}</td>
                      <td className="py-2.5 text-slate-500">{log.latency}</td>
                      <td className="py-2.5 text-right font-semibold text-indigo-600">{log.tokenCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-300 font-mono text-[9px] p-3 rounded-xl border border-slate-800 mt-4 leading-normal">
            ⚙️ SYSTEM DIAGNOSTIC: Rate throttles within limits. All semantic vector memory caches cleared. GoogleGenAI Client initialized successfully.
          </div>
        </div>

      </div>

      {/* INSTITUTIONS COMMAND LIST */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-blue-500" /> Enrolled Educational Tenants & Institutions
          </h3>
          <p className="text-xs text-slate-500">Configure separate databases or single-tenant pipelines for active academies</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                <th className="p-3.5 pl-5">Academy Name</th>
                <th className="p-3.5">Active Departments</th>
                <th className="p-3.5">Syllabus Courses</th>
                <th className="p-3.5">Active Learners</th>
                <th className="p-3.5 text-right pr-5">Pipeline Server</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {institutions.map((inst, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-3.5 pl-5 font-bold text-slate-700">{inst.name}</td>
                  <td className="p-3.5 font-mono text-slate-500">{inst.departmentCount} Depts</td>
                  <td className="p-3.5 font-mono text-slate-500">{inst.coursesCount} Courses</td>
                  <td className="p-3.5 font-semibold text-slate-600">{inst.userCount} Students</td>
                  <td className="p-3.5 text-right pr-5">
                    <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded text-[10px] border border-indigo-100">
                      Standard Cloud Container
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

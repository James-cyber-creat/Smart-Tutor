import React, { useState } from "react";
import { Database, GitBranch, Terminal, Play, RefreshCw, Layers, Check, Copy } from "lucide-react";

export default function TechnicalDocs() {
  const [activeTab, setActiveTab] = useState<"erd" | "api">("erd");

  // API Tester States
  const [selectedEndpoint, setSelectedEndpoint] = useState("/api/tutor-chat");
  const [apiPayload, setApiPayload] = useState(
    JSON.stringify({ message: "Explain recursion using a Russian doll analogy.", history: [] }, null, 2)
  );
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [copiedState, setCopiedState] = useState(false);

  // Schema listings
  const schemaEntities = [
    {
      title: "Users Table (Student/Teacher Profiles)",
      fields: [
        { name: "id", type: "UUID (Primary Key)", desc: "Unique systemic identifier" },
        { name: "name", type: "VARCHAR(255)", desc: "Full name of scholar/teacher" },
        { name: "email", type: "VARCHAR(255)", desc: "Unique auth credential email" },
        { name: "role", type: "ENUM('Student', 'Teacher', 'Admin')", desc: "Permissions control" },
        { name: "streak", type: "INTEGER", desc: "Daily active streak count tracker" },
        { name: "xp", type: "INTEGER", desc: "Cumulative gamified performance tokens" },
        { name: "coins", type: "INTEGER", desc: "Store currency coins multiplier" }
      ]
    },
    {
      title: "Courses & Lessons Tables (Relational)",
      fields: [
        { name: "id", type: "VARCHAR(64) (PK)", desc: "e.g. 'cs-201' index" },
        { name: "title", type: "VARCHAR(255)", desc: "Syllabus title text" },
        { name: "code", type: "VARCHAR(16)", desc: "Academic course prefix code" },
        { name: "instructor", type: "VARCHAR(255)", desc: "Teacher primary name" },
        { name: "lessons", type: "JSON_B / ARRAY", desc: "Linked list of Lesson records" }
      ]
    },
    {
      title: "Assessments & Submissions (Continuous Evaluation)",
      fields: [
        { name: "id", type: "UUID (PK)", desc: "Assessment instance identifier" },
        { name: "topic", type: "VARCHAR(255)", desc: "Linked curriculum topic code" },
        { name: "questions", type: "JSON_B", desc: "Serialized list of MCQs and Essay tasks" },
        { name: "score", type: "INTEGER", desc: "Graded scorecard metric out of 100" },
        { name: "rubric_scheme", type: "JSON_B", desc: "AI-generated evaluation grading parameters" }
      ]
    }
  ];

  // Map payloads automatically when selected route changes
  const handleEndpointChange = (endpoint: string) => {
    setSelectedEndpoint(endpoint);
    let defaultPayload = {};

    switch (endpoint) {
      case "/api/tutor-chat":
        defaultPayload = { message: "Explain recursion using a Russian doll analogy.", history: [] };
        break;
      case "/api/generate-quiz":
        defaultPayload = { topic: "Subnet Routing & IP Gates", difficulty: "Medium", questionType: "MCQ", count: 3 };
        break;
      case "/api/evaluate-submission":
        defaultPayload = {
          question: "Analyze the trade-offs between static and dynamic routing protocols in a core ISP.",
          studentAnswer: "Static routing has zero overhead and high speed but does not adapt to failure. Dynamic routing protocol like BGP scales and redirects packets around failure but consumes router CPU and has slow convergence times.",
          questionType: "Essay",
          context: "LMS continuous assessment grading criteria."
        };
        break;
      case "/api/generate-coursework":
        defaultPayload = { topic: "Alternating Currents & Impedance", materialType: "Lecture Notes", audience: "TVET Electronics Students" };
        break;
      case "/api/generate-study-plan":
        defaultPayload = { weakSubjects: ["Recursion Trees", "AC Impedance"], targetHours: 12, examGoal: "University Midterm Exams" };
        break;
      case "/api/career-advice":
        defaultPayload = { skills: ["Python", "Subnet Design"], performanceMetrics: { xp: 3950, streak: 7 }, interests: ["Cloud Architect"] };
        break;
      default:
        defaultPayload = { message: "Hello" };
    }

    setApiPayload(JSON.stringify(defaultPayload, null, 2));
    setApiResponse(null);
  };

  // Run actual query to backend
  const handleTestApi = async () => {
    setIsApiLoading(true);
    setApiResponse(null);

    try {
      const parsedBody = JSON.parse(apiPayload);

      const response = await fetch(selectedEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedBody)
      });

      if (!response.ok) {
        throw new Error(`Inference returned status ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
    } catch (err: any) {
      console.error(err);
      setApiResponse({
        error: "API Request completed with simulated output (Configure your GEMINI_API_KEY to test actual server inference)",
        status: "500 Internal error",
        message: err.message
      });
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(apiPayload);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* NAVIGATION TABS */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-100 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-indigo-600" /> SmartTutor AI Developer Center
          </h2>
          <p className="text-[10px] text-slate-500">View entity relationships or trigger live REST API calls against the Express backend</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab("erd")}
            className={`text-xs font-bold py-1.5 px-3.5 rounded-lg transition ${
              activeTab === "erd" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Database ERD Schema
          </button>
          <button 
            onClick={() => setActiveTab("api")}
            className={`text-xs font-bold py-1.5 px-3.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === "api" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Interactive REST Explorer
          </button>
        </div>
      </div>

      {/* ERD DIAGRAM VIEW */}
      {activeTab === "erd" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schemaEntities.map((ent, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <div className="flex gap-2 items-center border-b pb-3">
                  <GitBranch className="w-4 h-4 text-indigo-600 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-800">{ent.title}</h4>
                </div>

                <div className="space-y-3">
                  {ent.fields.map((f, fIdx) => (
                    <div key={fIdx} className="text-[10px] space-y-0.5 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between font-bold">
                        <span className="text-indigo-600 font-mono">{f.name}</span>
                        <span className="text-slate-400 font-mono text-[9px]">{f.type}</span>
                      </div>
                      <p className="text-slate-500 leading-normal">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Entity Relationship Flow Topology</h4>
            <div className="text-[10px] font-mono text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl border space-y-1 shadow-inner">
              <p>• [Users] 1 ---- N [Submissions] (Linked by user_id)</p>
              <p>• [Users] 1 ---- N [Badges] (Linked by user_id)</p>
              <p>• [Courses] 1 ---- N [Lessons] (Linked by course_id)</p>
              <p>• [Assessments] 1 ---- N [Submissions] (Linked by assessment_id)</p>
              <p>• [Users] 1 ---- N [StudyPlanSlots] (Linked by user_id)</p>
            </div>
          </div>
        </div>
      )}

      {/* REST API EXPLORER */}
      {activeTab === "api" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ENDPOINT SELECTOR AND PAYLOAD EDITOR */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Interactive REST API Request Builder</h3>
              <p className="text-[10px] text-slate-500">Select any route, customize body parameters, and send active HTTP requests to the Node server</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 block">HTTP Request Route (POST)</label>
                <div className="flex gap-2">
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1.5 rounded-lg font-mono font-bold text-[10px] uppercase shrink-0">
                    POST
                  </span>
                  <select 
                    value={selectedEndpoint}
                    onChange={(e) => handleEndpointChange(e.target.value)}
                    className="flex-1 bg-slate-50 border rounded-xl p-1.5 font-mono text-slate-700 outline-none"
                  >
                    <option value="/api/tutor-chat">/api/tutor-chat (Socratic Mentor)</option>
                    <option value="/api/generate-quiz">/api/generate-quiz (Assessments)</option>
                    <option value="/api/evaluate-submission">/api/evaluate-submission (Rubric Marker)</option>
                    <option value="/api/generate-coursework">/api/generate-coursework (Course Notes)</option>
                    <option value="/api/generate-study-plan">/api/generate-study-plan (Planners)</option>
                    <option value="/api/career-advice">/api/career-advice (Guidance Portal)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-500 block">JSON Body payload</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopyCode}
                      className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1 font-bold"
                    >
                      <Copy className="w-3 h-3" /> {copiedState ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <textarea 
                  value={apiPayload}
                  onChange={(e) => setApiPayload(e.target.value)}
                  className="w-full bg-slate-900 text-cyan-400 font-mono text-[10px] p-4 rounded-xl h-60 outline-none focus:ring-1 focus:ring-indigo-500/50 shadow-inner"
                />
              </div>

              <button 
                onClick={handleTestApi}
                disabled={isApiLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-55"
              >
                {isApiLoading ? <RefreshCw className="w-4.5 h-4.5 animate-spin" /> : <Play className="w-4 h-4 text-indigo-200" />}
                {isApiLoading ? "Processing server request..." : "Trigger Live Inference"}
              </button>
            </div>
          </div>

          {/* RESPONSE VIEWER */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-sm font-bold text-slate-800">Returned REST JSON Response payload</h3>
                {apiResponse && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                    HTTP 200 OK
                  </span>
                )}
              </div>

              {isApiLoading ? (
                <div className="h-72 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
                  <p className="text-xs font-semibold">Server-side controller is fetching inference parameters...</p>
                </div>
              ) : apiResponse ? (
                <div className="bg-slate-55 border rounded-xl p-4 font-mono text-[10px] h-96 overflow-y-auto text-slate-700 shadow-inner">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(apiResponse, null, 2)}</pre>
                </div>
              ) : (
                <div className="h-72 flex flex-col items-center justify-center gap-2 text-slate-300">
                  <Layers className="w-12 h-12" />
                  <p className="text-xs font-bold text-slate-400">Response payload empty. Send a request to preview.</p>
                </div>
              )}
            </div>

            <div className="mt-4 bg-slate-50 border p-3 rounded-xl text-[10px] text-slate-500 leading-relaxed font-mono">
              💡 ENDPOINT SPEC: All routes are secured server-side and validate the payload structure via runtime schemas to safeguard proprietary data.
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

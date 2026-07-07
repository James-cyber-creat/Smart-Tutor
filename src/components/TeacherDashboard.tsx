import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { 
  Sparkles, FileText, Download, Users, BookOpen, Clock, AlertTriangle, 
  HelpCircle, RefreshCw, Layers, CheckSquare, Plus, CheckCircle2
} from "lucide-react";

interface TeacherDashboardProps {
  onAddXp: (amount: number) => void;
  isAccessibilityMode: boolean;
}

export default function TeacherDashboard({ onAddXp, isAccessibilityMode }: TeacherDashboardProps) {
  // AI Generator state
  const [topic, setTopic] = useState("Binary Search Trees & Balancing");
  const [materialType, setMaterialType] = useState("Lecture Notes");
  const [audience, setAudience] = useState("Second Year Undergraduates");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  // Tabs
  const [activeSubTab, setActiveSubTab] = useState<"analytics" | "generator" | "assignments">("analytics");

  // Mock Students data
  const [students, setStudents] = useState([
    { name: "Timothy Drake", progress: 85, predictedGrade: "A", weakSubject: "Graph Cycles", attendance: "96%", testAverage: 92 },
    { name: "Clara Oswald", progress: 68, predictedGrade: "B+", weakSubject: "AC Resonance", attendance: "91%", testAverage: 81 },
    { name: "Sarah Jenkins", progress: 92, predictedGrade: "A+", weakSubject: "Linked Structures", attendance: "100%", testAverage: 96 },
    { name: "Alex Mercer", progress: 42, predictedGrade: "D", weakSubject: "Subnetting Static Routers", attendance: "74%", testAverage: 54 },
    { name: "Marcus Sterling", progress: 79, predictedGrade: "A-", weakSubject: "Memory Overflows", attendance: "88%", testAverage: 88 }
  ]);

  // Weak subjects aggregated stats for charts
  const classWeaknessData = [
    { subject: "Subnets & CIDR", count: 4, averageGrade: 58 },
    { subject: "Recursion Stack", count: 3, averageGrade: 71 },
    { subject: "AC Impedance", count: 2, averageGrade: 78 },
    { subject: "Linked List Trees", count: 1, averageGrade: 89 },
  ];

  const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

  // Run Coursework generator on backend
  const handleGenerateCoursework = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const response = await fetch("/api/generate-coursework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, materialType, audience })
      });

      if (!response.ok) throw new Error("Coursework service failed.");
      const data = await response.json();
      setGeneratedContent(data.content || "");
      onAddXp(60);
    } catch (err) {
      setTimeout(() => {
        setGeneratedContent(`## Syllabus Material: ${topic}
### Material Type: ${materialType}
*Target Audience: ${audience}*

---

### Introduction
This coursework resource covers the fundamental theories, architectural parameters, and conceptual trade-offs when dealing with **${topic}**.

### Core Technical Pillars
1. **Structure & Foundations:** Decompose variables into separate runtime modules.
2. **Mathematical / Algorithm Boundary Conditions:** Maintain safe boundaries to prevent stack overflow limits or routing loops.
3. **Active Reflection:** Challenge the student's current assumptions using socratic prompts.

### Class Exercise / Practice Task
Design a complete flow simulation that models these exact parameters under standard network stress conditions.

---
### 🧠 Socratic Study Questions
1. Why does changing this configuration alter the execution depth of the child nodes?
2. What happens to current measurements if resistance remains strictly infinite?
3. Calculate the available subnet pools for this specific gateway mask.

*(LMS Note: To get direct, generative AI syllabus documents, configure your \`GEMINI_API_KEY\` in Secrets).*`);
        onAddXp(40);
      }, 1500);
    } finally {
      setIsGenerating(false);
    }
  };

  // CSV Report exporter simulation
  const handleExportCSV = (reportType: string) => {
    const headers = "Student Name,Syllabus Progress,Forecasted Grade,Identified Conceptual Weakness,Attendance Rate,Exam Average\n";
    const rows = students.map(s => `${s.name},${s.progress}%,${s.predictedGrade},${s.weakSubject},${s.attendance},${s.testAverage}%`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `SmartTutor_LMS_${reportType.replace(/\s+/g, "_")}.csv`);
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER CONTROLS */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            Instructor Portal <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">Manager Mode</span>
          </h2>
          <p className="text-xs text-slate-500">Assess class performance, download academic reports, and generate custom learning materials</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => setActiveSubTab("analytics")}
            className={`text-xs font-bold py-2 px-4 rounded-xl transition ${
              activeSubTab === "analytics" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Syllabus Analytics
          </button>
          <button 
            onClick={() => setActiveSubTab("generator")}
            className={`text-xs font-bold py-2 px-4 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === "generator" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" /> AI Material Generator
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CLASS ANALYTICS & CHARTS */}
      {activeSubTab === "analytics" && (
        <div className="space-y-6">
          
          {/* TOP COUNTERS BENTO BOX */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Enrolled Scholars</span>
                <span className="text-2xl font-black text-slate-700">746</span>
                <span className="block text-[9px] text-indigo-600 font-bold mt-1">Across 3 Departments</span>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Average Quiz Score</span>
                <span className="text-2xl font-black text-emerald-600">82.4%</span>
                <span className="block text-[9px] text-slate-400 mt-1">+1.5% from last week</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Attendance Average</span>
                <span className="text-2xl font-black text-slate-700">92.1%</span>
                <span className="block text-[9px] text-rose-500 font-bold mt-1">1 Student below 75% limit</span>
              </div>
              <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">At-Risk Diagnostic</span>
                <span className="text-2xl font-black text-rose-600">1</span>
                <span className="block text-[9px] text-rose-600 font-bold mt-1">Needs immediate coaching</span>
              </div>
              <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* CHARTS CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: conceptual weaknesses */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Class Conceptual Weakness & Average Test Marks</h3>
                <p className="text-[10px] text-slate-500">Auto-calculated using diagnostic assessments</p>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classWeaknessData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="count" name="At-Risk Student Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="averageGrade" name="Average Grade Score %" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Pie chart predicted grades */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Grade Forecast distribution</h3>
                <p className="text-[10px] text-slate-500">SaaS predicted indices</p>
              </div>

              <div className="h-44 mt-3 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Grade A", value: 45 },
                        { name: "Grade B", value: 35 },
                        { name: "Grade C", value: 15 },
                        { name: "Grade D/F", value: 5 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {[0, 1, 2, 3].map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600 mt-2">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span> A-Grade (45%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> B-Grade (35%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> C-Grade (15%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> D/F-Grade (5%)</span>
              </div>
            </div>
          </div>

          {/* STUDENTS LIST & ACTIONS */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Class Performance Rosters</h3>
                <p className="text-xs text-slate-500">Complete listing of students and forecasting analytics</p>
              </div>
              <button 
                onClick={() => handleExportCSV("Student_Roster")}
                className="bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Export Roster CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                    <th className="p-3.5 pl-5">Student Name</th>
                    <th className="p-3.5">Syllabus Complete</th>
                    <th className="p-3.5">Forecast Grade</th>
                    <th className="p-3.5">Attendance</th>
                    <th className="p-3.5">Weak Knowledge Point</th>
                    <th className="p-3.5 text-right pr-5">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((student, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3.5 pl-5 font-bold text-slate-700">{student.name}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full" style={{ width: `${student.progress}%` }} />
                          </div>
                          <span>{student.progress}%</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          student.predictedGrade.startsWith("A") ? "bg-emerald-100 text-emerald-800" :
                          student.predictedGrade.startsWith("B") ? "bg-blue-100 text-blue-800" : "bg-rose-100 text-rose-800"
                        }`}>{student.predictedGrade}</span>
                      </td>
                      <td className="p-3.5">{student.attendance}</td>
                      <td className="p-3.5 font-medium text-slate-600">{student.weakSubject}</td>
                      <td className="p-3.5 text-right pr-5">
                        <button 
                          onClick={() => alert(`Socratic Intervention alert issued to ${student.name} for topic "${student.weakSubject}".`)}
                          className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold px-2 py-1 rounded text-[10px]"
                        >
                          Trigger AI Intervention
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: AI RESOURCE GENERATOR */}
      {activeSubTab === "generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form parameters */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Coursework AI Generator</h3>
              <p className="text-[10px] text-slate-500">Deploys standard-aligned lectures, assignment prompts or examination sheets instantly</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 block">Curriculum Subject Topic</label>
                <input 
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 outline-none focus:bg-white focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 block">Syllabus Material Format</label>
                <select 
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 outline-none"
                >
                  <option value="Lecture Notes">Complete Lecture Notes</option>
                  <option value="Lesson Plan">Curriculum Lesson Plan</option>
                  <option value="Assignment Prompt">Assignment Practical Sheet</option>
                  <option value="Marking Rubric">Grading Rubric Breakdown</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 block">Target Classroom Audience</label>
                <input 
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 outline-none focus:bg-white focus:border-indigo-500 transition"
                />
              </div>

              <button 
                onClick={handleGenerateCoursework}
                disabled={isGenerating}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-rose-200" />}
                {isGenerating ? "AI writing educational resource..." : "Compile AI Coursework File"}
              </button>
            </div>
          </div>

          {/* Generated Content Preview */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-sm font-bold text-slate-800">Generated Syllabus Document Preview</h3>
                {generatedContent && (
                  <button 
                    onClick={() => {
                      const blob = new Blob([generatedContent], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `SmartTutor_Coursework_${topic.replace(/\s+/g, "_")}.md`;
                      a.click();
                    }}
                    className="text-[10px] font-bold text-slate-600 border px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 transition flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Download Source .MD
                  </button>
                )}
              </div>

              {isGenerating ? (
                <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
                  <p className="text-xs font-semibold">AI is drafting standard explanations, schemas, and exercises...</p>
                </div>
              ) : generatedContent ? (
                <div className="bg-slate-50/50 border rounded-xl p-5 font-mono text-[11px] h-96 overflow-y-auto whitespace-pre-line text-slate-700 leading-relaxed shadow-inner">
                  {generatedContent}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-300">
                  <FileText className="w-12 h-12" />
                  <p className="text-xs font-bold text-slate-400">No content compiled. Click generate to start.</p>
                </div>
              )}
            </div>

            <div className="mt-4 bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-[10px] text-indigo-700">
              💡 **Pedagogical Standard:** SmartTutor AI ensures that generated materials explicitly link theoretical parameters to socratic evaluation prompts, promoting high retention active learning.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

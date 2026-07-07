import React, { useState, useEffect } from "react";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AccessibilitySettings from "./components/AccessibilitySettings";
import TechnicalDocs from "./components/TechnicalDocs";
import { 
  Sparkles, Award, Compass, Users, Shield, Accessibility, 
  Database, UserCheck, Flame, BookOpen, AlertCircle
} from "lucide-react";

export default function App() {
  // Global Gamification & User State
  const [xp, setXp] = useState(3950);
  const [coins, setCoins] = useState(140);
  const [streak, setStreak] = useState(7);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(["Socratic Scholar", "Streak Legend"]);

  // Master Navigation Selector
  const [activePortal, setActivePortal] = useState<"student" | "teacher" | "admin" | "accessibility" | "developer">("student");

  // Global Accessibility States
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    textToSpeech: false,
    highContrast: false,
    screenReader: false,
    colorBlindFilter: "none",
    fontSizeScale: 1.0
  });

  // Load progress from local storage on mount
  useEffect(() => {
    const storedXp = localStorage.getItem("smarttutor_xp");
    const storedCoins = localStorage.getItem("smarttutor_coins");
    const storedStreak = localStorage.getItem("smarttutor_streak");
    const storedBadges = localStorage.getItem("smarttutor_badges");

    if (storedXp) setXp(Number(storedXp));
    if (storedCoins) setCoins(Number(storedCoins));
    if (storedStreak) setStreak(Number(storedStreak));
    if (storedBadges) {
      try {
        setUnlockedBadges(JSON.parse(storedBadges));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync state helpers
  const handleAddXp = (amount: number) => {
    setXp(prev => {
      const updated = prev + amount;
      localStorage.setItem("smarttutor_xp", String(updated));
      return updated;
    });
  };

  const handleAddCoins = (amount: number) => {
    setCoins(prev => {
      const updated = prev + amount;
      localStorage.setItem("smarttutor_coins", String(updated));
      return updated;
    });
  };

  const handleUnlockBadge = (badgeName: string) => {
    if (!unlockedBadges.includes(badgeName)) {
      const updated = [...unlockedBadges, badgeName];
      setUnlockedBadges(updated);
      localStorage.setItem("smarttutor_badges", JSON.stringify(updated));
      handleAddXp(200); // 200 XP for achieving a badge
      handleAddCoins(50); // 50 coins
    }
  };

  // Build the dynamic CSS classes for accessibility mode
  const getAccessibilityClasses = () => {
    let classes = "";
    
    // Color blind filters
    if (accessibilitySettings.colorBlindFilter === "protanopia") {
      classes += " sepia saturate-150 hue-rotate-15";
    } else if (accessibilitySettings.colorBlindFilter === "deuteranopia") {
      classes += " saturate-120 hue-rotate-30 brightness-95";
    } else if (accessibilitySettings.colorBlindFilter === "tritanopia") {
      classes += " sepia saturate-100 hue-rotate-60";
    }

    // High contrast
    if (accessibilitySettings.highContrast) {
      classes += " contrast-125 brightness-105";
    }

    return classes;
  };

  // Get dynamic inline styling for font scaling
  const getFontSizeStyle = () => {
    return {
      fontSize: `${accessibilitySettings.fontSizeScale * 100}%`
    };
  };

  return (
    <div className={`min-h-screen bg-slate-50/50 flex flex-col antialiased selection:bg-indigo-500 selection:text-white transition-all duration-300 ${getAccessibilityClasses()}`} style={getFontSizeStyle()}>
      
      {/* COCKPIT HEADER */}
      <header className={`sticky top-0 z-50 border-b shadow-sm ${
        accessibilitySettings.highContrast ? "bg-black border-white text-white" : "bg-slate-900 text-white border-slate-850"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Platform Title */}
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight">SmartTutor AI</h1>
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent text-[9px] font-black tracking-widest uppercase">LMS Suite</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Learn Smarter. Practice Better. Succeed Faster.</p>
            </div>
          </div>

          {/* Master Portal Controller */}
          <nav className="flex bg-slate-800/80 border border-slate-700/80 p-1 rounded-xl">
            <button 
              onClick={() => setActivePortal("student")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePortal === "student" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-indigo-500" />
              <span>Student Hub</span>
            </button>

            <button 
              onClick={() => setActivePortal("teacher")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePortal === "teacher" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>Teacher Portal</span>
            </button>

            <button 
              onClick={() => setActivePortal("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePortal === "admin" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-rose-500" />
              <span>Admin Panel</span>
            </button>

            <button 
              onClick={() => setActivePortal("accessibility")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePortal === "accessibility" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Accessibility className="w-3.5 h-3.5 text-violet-500" />
              <span>Accessibility</span>
            </button>

            <button 
              onClick={() => setActivePortal("developer")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePortal === "developer" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Tech Docs</span>
            </button>
          </nav>

          {/* User Metrics Synchronization */}
          <div className="flex items-center gap-3 bg-slate-800/60 px-3.5 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-200">
            <span className="flex items-center gap-1 font-bold text-amber-400">
              🪙 {coins} <span className="text-[10px] text-slate-400 font-normal">Coins</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 font-bold text-orange-400">
              🔥 {streak} <span className="text-[10px] text-slate-400 font-normal">Days</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 font-bold text-indigo-400">
              🏆 {xp} <span className="text-[10px] text-slate-400 font-normal">XP</span>
            </span>
          </div>

        </div>
      </header>

      {/* SYSTEM WARNING IF ACCESSIBILITY MODIFIED */}
      {accessibilitySettings.highContrast && (
        <div className="bg-yellow-500 text-black text-xs font-bold text-center py-2 border-b">
          ⚠️ HIGH CONTRAST ACCESSIBILITY MODE ENABLED. Text boundary scales amplified.
        </div>
      )}

      {/* CORE WORKSPACE ROUTING */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activePortal === "student" && (
          <StudentDashboard 
            onAddXp={handleAddXp}
            onAddCoins={handleAddCoins}
            streak={streak}
            xp={xp}
            coins={coins}
            unlockedBadges={unlockedBadges}
            onUnlockBadge={handleUnlockBadge}
            isAccessibilityMode={accessibilitySettings.screenReader}
            accessibilitySettings={accessibilitySettings}
          />
        )}

        {activePortal === "teacher" && (
          <TeacherDashboard 
            onAddXp={handleAddXp}
            isAccessibilityMode={accessibilitySettings.screenReader}
          />
        )}

        {activePortal === "admin" && (
          <AdminDashboard />
        )}

        {activePortal === "accessibility" && (
          <AccessibilitySettings 
            settings={accessibilitySettings}
            onUpdateSettings={setAccessibilitySettings}
          />
        )}

        {activePortal === "developer" && (
          <TechnicalDocs />
        )}
      </main>

      {/* PLATFORM FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SmartTutor AI LMS Platform • Active Learner Profile: <b>James Shadrack (User)</b></span>
          </div>
          <div className="font-mono text-[10px] text-slate-500">
            Node.js/Express + React/TypeScript Engine • Standard Compliant 2026
          </div>
        </div>
      </footer>

    </div>
  );
}

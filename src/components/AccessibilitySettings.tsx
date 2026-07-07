import React from "react";
import { Eye, Volume2, Key, Type, Accessibility, CheckCircle2 } from "lucide-react";

interface AccessibilitySettingsProps {
  settings: {
    textToSpeech: boolean;
    highContrast: boolean;
    screenReader: boolean;
    colorBlindFilter: string;
    fontSizeScale: number;
  };
  onUpdateSettings: (newSettings: any) => void;
}

export default function AccessibilitySettings({ settings, onUpdateSettings }: AccessibilitySettingsProps) {
  
  const handleToggleTts = () => {
    onUpdateSettings({ ...settings, textToSpeech: !settings.textToSpeech });
  };

  const handleToggleContrast = () => {
    onUpdateSettings({ ...settings, highContrast: !settings.highContrast });
  };

  const handleToggleScreenReader = () => {
    onUpdateSettings({ ...settings, screenReader: !settings.screenReader });
  };

  const handleFilterChange = (filter: string) => {
    onUpdateSettings({ ...settings, colorBlindFilter: filter });
  };

  const handleSizeChange = (scale: number) => {
    onUpdateSettings({ ...settings, fontSizeScale: scale });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex gap-3 border-b pb-4">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
          <Accessibility className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Accessibility & Visual Assistances</h3>
          <p className="text-xs text-slate-500">Configure screen overlays, keyboard selectors, and audio narration controls</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: TOGGLES */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Functional Assistances</p>

          {/* Text-to-Speech Toggle */}
          <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition cursor-pointer" onClick={handleToggleTts}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                <Volume2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="font-bold text-slate-700 block text-xs">Text-To-Speech (Speech Synthesis)</span>
                <span className="text-[9px] text-slate-400 block">Read tutor chat messages and assessments aloud</span>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full flex items-center p-1 transition ${settings.textToSpeech ? "bg-indigo-600 justify-end" : "bg-slate-200 justify-start"}`}>
              <div className="w-4 h-4 rounded-full bg-white shadow" />
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition cursor-pointer" onClick={handleToggleContrast}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                <Eye className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="font-bold text-slate-700 block text-xs">High Contrast Mode</span>
                <span className="text-[9px] text-slate-400 block">Enforces sharp black/white text boundary limits</span>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full flex items-center p-1 transition ${settings.highContrast ? "bg-indigo-600 justify-end" : "bg-slate-200 justify-start"}`}>
              <div className="w-4 h-4 rounded-full bg-white shadow" />
            </div>
          </div>

          {/* Screen Reader Simulation Toggle */}
          <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition cursor-pointer" onClick={handleToggleScreenReader}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-50 text-cyan-500 rounded-lg">
                <Key className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="font-bold text-slate-700 block text-xs">Keyboard & Reader Scaffolds</span>
                <span className="text-[9px] text-slate-400 block">Optimize interactive elements with clear aria headings</span>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full flex items-center p-1 transition ${settings.screenReader ? "bg-indigo-600 justify-end" : "bg-slate-200 justify-start"}`}>
              <div className="w-4 h-4 rounded-full bg-white shadow" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FONT SIZE AND FILTERS */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visual Accommodations</p>

          {/* Font scale */}
          <div className="p-4 border rounded-xl space-y-2 bg-slate-50/50">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600 flex items-center gap-1.5"><Type className="w-4 h-4" /> Text Font Scaling</span>
              <span className="font-mono text-slate-400">{Math.round(settings.fontSizeScale * 100)}%</span>
            </div>
            <div className="flex gap-2">
              {[0.9, 1.0, 1.15, 1.3].map(scale => (
                <button 
                  key={scale}
                  onClick={() => handleSizeChange(scale)}
                  className={`flex-1 text-[10px] font-bold py-1 px-2.5 rounded-lg border transition ${
                    settings.fontSizeScale === scale 
                      ? "bg-indigo-600 text-white border-indigo-600" 
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  {scale === 0.9 ? "Compact" : scale === 1.0 ? "Normal" : scale === 1.15 ? "Large" : "Huge"}
                </button>
              ))}
            </div>
          </div>

          {/* Colorblind Filters */}
          <div className="p-4 border rounded-xl space-y-2 bg-slate-50/50">
            <span className="font-bold text-slate-600 text-xs block">Color Blind Spectrum Filters</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              {[
                { name: "Default (None)", value: "none" },
                { name: "Protanopia (Red-blind)", value: "protanopia" },
                { name: "Deuteranopia (Green-blind)", value: "deuteranopia" },
                { name: "Tritanopia (Blue-blind)", value: "tritanopia" }
              ].map(filter => (
                <button 
                  key={filter.value}
                  onClick={() => handleFilterChange(filter.value)}
                  className={`p-2 rounded-lg border text-left transition flex justify-between items-center ${
                    settings.colorBlindFilter === filter.value 
                      ? "bg-white border-indigo-500 text-indigo-700" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{filter.name}</span>
                  {settings.colorBlindFilter === filter.value && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-700 leading-relaxed">
        ⌨️ **Keyboard Navigation Assist:** When accessibility modes are toggled, keyboard focus frames highlight inputs, while socratic tutor scripts include auditory markup labels.
      </div>

    </div>
  );
}

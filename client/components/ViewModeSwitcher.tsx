import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type ViewMode = "journey" | "standard" | "animated" | "3d";

interface ModeOption {
  id: ViewMode;
  label: string;
  icon: string;
  path: string;
  description: string;
}

const modes: ModeOption[] = [
  {
    id: "journey",
    label: "Journey",
    icon: "🚀",
    path: "/",
    description: "Drone animations & clinical journey",
  },
  {
    id: "standard",
    label: "Standard",
    icon: "✦",
    path: "/standard",
    description: "Clean animated landing",
  },
  {
    id: "animated",
    label: "Animated Flows",
    icon: "⚡",
    path: "/enhanced",
    description: "Multi-stage interactive experience",
  },
  {
    id: "3d",
    label: "3D Flows",
    icon: "🌐",
    path: "/3d",
    description: "Immersive 3D scene",
  },
];

function pathToMode(pathname: string): ViewMode {
  if (pathname === "/standard" || pathname === "/ultimate") return "standard";
  if (pathname === "/enhanced") return "animated";
  if (pathname === "/3d") return "3d";
  return "journey";
}

export const ViewModeSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = pathToMode(pathname);
  const [open, setOpen] = useState(false);

  const handleSelect = (mode: ModeOption) => {
    setOpen(false);
    if (mode.id !== current) {
      navigate(mode.path);
    }
  };

  const currentMode = modes.find((m) => m.id === current) ?? modes[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Mode options panel */}
      {open && (
        <div className="flex flex-col gap-2 mb-1">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleSelect(mode)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg transition-all duration-200 border ${
                mode.id === current
                  ? "bg-blue-600 text-white border-blue-500 scale-105"
                  : "bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-slate-500"
              }`}
            >
              <span className="text-base">{mode.icon}</span>
              <div className="text-left">
                <div className="leading-tight">{mode.label}</div>
                <div
                  className={`text-xs ${mode.id === current ? "text-blue-100" : "text-slate-400"}`}
                >
                  {mode.description}
                </div>
              </div>
              {mode.id === current && (
                <span className="ml-auto text-blue-200 text-xs">●</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Switch view mode"
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold shadow-xl transition-all duration-200 border ${
          open
            ? "bg-blue-600 text-white border-blue-500 shadow-blue-500/30"
            : "bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-slate-500 hover:shadow-slate-900/50"
        }`}
      >
        <span className="text-base">{currentMode.icon}</span>
        <span>{currentMode.label}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>
  );
};

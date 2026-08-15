"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ColorTheme = {
  name: string;
  accent: string;
  accentDim: string;
  gradient: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  shimmer: string[];
};

export const COLOR_THEMES: Record<string, ColorTheme> = {
  blue: {
    name: "Electric Blue",
    accent: "#0ea5e9",
    accentDim: "rgba(14,165,233,0.15)",
    gradient: {
      primary: "rgba(14, 165, 233, 0.15)",
      secondary: "rgba(6, 182, 212, 0.08)",
      tertiary: "rgba(2, 132, 199, 0.1)",
    },
    shimmer: ["#0ea5e9", "#06b6d4", "#22d3ee", "#0ea5e9"],
  },
  purple: {
    name: "Creative Purple",
    accent: "#8b5cf6",
    accentDim: "rgba(139,92,246,0.15)",
    gradient: {
      primary: "rgba(139, 92, 246, 0.15)",
      secondary: "rgba(167, 139, 250, 0.08)",
      tertiary: "rgba(109, 40, 217, 0.1)",
    },
    shimmer: ["#8b5cf6", "#a78bfa", "#c084fc", "#8b5cf6"],
  },
  green: {
    name: "Emerald Green",
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.15)",
    gradient: {
      primary: "rgba(16, 185, 129, 0.15)",
      secondary: "rgba(20, 184, 166, 0.08)",
      tertiary: "rgba(5, 150, 105, 0.1)",
    },
    shimmer: ["#10b981", "#14b8a6", "#34d399", "#10b981"],
  },
  orange: {
    name: "Vibrant Orange",
    accent: "#f97316",
    accentDim: "rgba(249,115,22,0.15)",
    gradient: {
      primary: "rgba(249, 115, 22, 0.15)",
      secondary: "rgba(251, 146, 60, 0.08)",
      tertiary: "rgba(234, 88, 12, 0.1)",
    },
    shimmer: ["#f97316", "#fb923c", "#fdba74", "#f97316"],
  },
  pink: {
    name: "Cyber Magenta",
    accent: "#ec4899",
    accentDim: "rgba(236,72,153,0.15)",
    gradient: {
      primary: "rgba(236, 72, 153, 0.15)",
      secondary: "rgba(244, 114, 182, 0.08)",
      tertiary: "rgba(219, 39, 119, 0.1)",
    },
    shimmer: ["#ec4899", "#f472b6", "#f9a8d4", "#ec4899"],
  },
  amber: {
    name: "Golden Amber",
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.15)",
    gradient: {
      primary: "rgba(245, 158, 11, 0.15)",
      secondary: "rgba(251, 191, 36, 0.08)",
      tertiary: "rgba(217, 119, 6, 0.1)",
    },
    shimmer: ["#f59e0b", "#fbbf24", "#fcd34d", "#f59e0b"],
  },
  red: {
    name: "Neon Red",
    accent: "#ef4444",
    accentDim: "rgba(239,68,68,0.15)",
    gradient: {
      primary: "rgba(239, 68, 68, 0.15)",
      secondary: "rgba(248, 113, 113, 0.08)",
      tertiary: "rgba(220, 38, 38, 0.1)",
    },
    shimmer: ["#ef4444", "#f87171", "#fca5a5", "#ef4444"],
  },
  teal: {
    name: "Deep Teal",
    accent: "#14b8a6",
    accentDim: "rgba(20,184,166,0.15)",
    gradient: {
      primary: "rgba(20, 184, 166, 0.15)",
      secondary: "rgba(45, 212, 191, 0.08)",
      tertiary: "rgba(13, 148, 136, 0.1)",
    },
    shimmer: ["#14b8a6", "#2dd4bf", "#5eead4", "#14b8a6"],
  },
  rose: {
    name: "Rose Gold",
    accent: "#fb7185",
    accentDim: "rgba(251,113,133,0.15)",
    gradient: {
      primary: "rgba(251, 113, 133, 0.15)",
      secondary: "rgba(253, 164, 175, 0.08)",
      tertiary: "rgba(244, 63, 94, 0.1)",
    },
    shimmer: ["#fb7185", "#fda4af", "#fecdd3", "#fb7185"],
  },
  lime: {
    name: "Acid Lime",
    accent: "#84cc16",
    accentDim: "rgba(132,204,22,0.15)",
    gradient: {
      primary: "rgba(132, 204, 22, 0.15)",
      secondary: "rgba(163, 230, 53, 0.08)",
      tertiary: "rgba(101, 163, 13, 0.1)",
    },
    shimmer: ["#84cc16", "#a3e635", "#bef264", "#84cc16"],
  },
  indigo: {
    name: "Indigo",
    accent: "#6366f1",
    accentDim: "rgba(99,102,241,0.15)",
    gradient: {
      primary: "rgba(99, 102, 241, 0.15)",
      secondary: "rgba(129, 140, 248, 0.08)",
      tertiary: "rgba(79, 70, 229, 0.1)",
    },
    shimmer: ["#6366f1", "#818cf8", "#a5b4fc", "#6366f1"],
  },
};

type ColorContextType = {
  currentTheme: string;
  setTheme: (theme: string) => void;
  theme: ColorTheme;
};

const ColorContext = createContext<ColorContextType>({
  currentTheme: "blue",
  setTheme: () => {},
  theme: COLOR_THEMES.blue,
});

export const useColor = () => useContext(ColorContext);

export function ColorProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<string>("blue");

  useEffect(() => {
    // Load saved theme from localStorage
    const saved = localStorage.getItem("portfolio-color-theme");
    if (saved && COLOR_THEMES[saved]) {
      setCurrentTheme(saved);
    }
  }, []);

  useEffect(() => {
    // Apply theme to CSS variables
    const theme = COLOR_THEMES[currentTheme];
    if (theme) {
      document.documentElement.style.setProperty("--accent", theme.accent);
      document.documentElement.style.setProperty("--accent-dim", theme.accentDim);
      
      // Save to localStorage
      localStorage.setItem("portfolio-color-theme", currentTheme);
    }
  }, [currentTheme]);

  const setTheme = (theme: string) => {
    if (COLOR_THEMES[theme]) {
      setCurrentTheme(theme);
    }
  };

  return (
    <ColorContext.Provider
      value={{
        currentTheme,
        setTheme,
        theme: COLOR_THEMES[currentTheme],
      }}
    >
      {children}
    </ColorContext.Provider>
  );
}

"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type ColorThemeId = "teal" | "navy" | "burgundy" | "forest" | "charcoal";

export const COLOR_THEMES: Record<ColorThemeId, { hsl: string; label: string }> = {
  teal: { hsl: "hsl(168, 60%, 40%)", label: "Teal" },
  navy: { hsl: "hsl(220, 60%, 35%)", label: "Navy" },
  burgundy: { hsl: "hsl(345, 60%, 35%)", label: "Burgundy" },
  forest: { hsl: "hsl(150, 50%, 30%)", label: "Forest" },
  charcoal: { hsl: "hsl(0, 0%, 25%)", label: "Charcoal" },
};

const STORAGE_KEY = "resumeBuilderColorTheme";

function loadStored(): ColorThemeId {
  if (typeof window === "undefined") return "teal";
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && raw in COLOR_THEMES) return raw as ColorThemeId;
  } catch {}
  return "teal";
}

function saveToStorage(theme: ColorThemeId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}

interface ColorThemeContextValue {
  colorTheme: ColorThemeId;
  accentColor: string;
  setColorTheme: (t: ColorThemeId) => void;
}

const ColorThemeContext = createContext<ColorThemeContextValue | null>(null);

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorThemeId>("teal");

  useEffect(() => {
    setColorThemeState(loadStored());
  }, []);

  const setColorTheme = useCallback((t: ColorThemeId) => {
    setColorThemeState(t);
    saveToStorage(t);
  }, []);

  const accentColor = COLOR_THEMES[colorTheme].hsl;

  return (
    <ColorThemeContext.Provider value={{ colorTheme, accentColor, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const ctx = useContext(ColorThemeContext);
  if (!ctx) throw new Error("useColorTheme must be used within ColorThemeProvider");
  return ctx;
}

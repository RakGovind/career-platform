"use client";

import React from "react";
import { useColorTheme, COLOR_THEMES, type ColorThemeId } from "@/context/ColorThemeContext";

export function ColorPicker() {
  const { colorTheme, setColorTheme } = useColorTheme();

  return (
    <div className="color-picker">
      {(Object.keys(COLOR_THEMES) as ColorThemeId[]).map((id) => (
        <button
          key={id}
          type="button"
          className={`color-circle ${colorTheme === id ? "active" : ""}`}
          onClick={() => setColorTheme(id)}
          style={{ backgroundColor: COLOR_THEMES[id].hsl }}
          aria-pressed={colorTheme === id}
          title={COLOR_THEMES[id].label}
        />
      ))}
    </div>
  );
}

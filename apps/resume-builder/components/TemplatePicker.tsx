"use client";

import React from "react";
import { useTemplate, type TemplateId } from "@/context/TemplateContext";
import { useColorTheme } from "@/context/ColorThemeContext";

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
];

function TemplateThumbnail({ id, active }: { id: TemplateId; active: boolean }) {
  const { accentColor } = useColorTheme();
  return (
    <div
      className={`template-thumbnail template-thumbnail-${id}`}
      style={id === "modern" ? ({ "--thumb-accent": accentColor } as React.CSSProperties) : undefined}
    >
      {id === "classic" && (
        <>
          <div className="thumb-line thumb-header" />
          <div className="thumb-line thumb-rule" />
          <div className="thumb-block" />
          <div className="thumb-line thumb-rule" />
          <div className="thumb-block" />
          <div className="thumb-line thumb-rule" />
          <div className="thumb-block" />
        </>
      )}
      {id === "modern" && (
        <>
          <div className="thumb-sidebar" />
          <div className="thumb-main">
            <div className="thumb-block" />
            <div className="thumb-block" />
            <div className="thumb-block" />
          </div>
        </>
      )}
      {id === "minimal" && (
        <>
          <div className="thumb-line thumb-header" />
          <div className="thumb-spacer" />
          <div className="thumb-block" />
          <div className="thumb-spacer" />
          <div className="thumb-block" />
          <div className="thumb-spacer" />
          <div className="thumb-block" />
        </>
      )}
      {active && <span className="template-check">✓</span>}
    </div>
  );
}

export function TemplatePicker() {
  const { template, setTemplate } = useTemplate();

  return (
    <div className="template-picker">
      {TEMPLATES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`template-thumb-btn ${template === id ? "active" : ""}`}
          onClick={() => setTemplate(id)}
          aria-pressed={template === id}
          title={label}
        >
          <TemplateThumbnail id={id} active={template === id} />
          <span className="template-thumb-label">{label}</span>
        </button>
      ))}
    </div>
  );
}

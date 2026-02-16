"use client";

import React from "react";
import { useTemplate, type TemplateId } from "@/context/TemplateContext";

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
];

export function TemplateTabs() {
  const { template, setTemplate } = useTemplate();

  return (
    <div className="template-tabs">
      {TEMPLATES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`template-tab ${template === id ? "active" : ""}`}
          onClick={() => setTemplate(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

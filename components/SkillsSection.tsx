"use client";

import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { SkillTagInput } from "./SkillTagInput";

const SUGGESTED = {
  technical: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"],
  soft: ["Team Leadership", "Problem Solving"],
  tools: ["Git", "Docker", "AWS"],
};

const LABELS = {
  technical: "Technical Skills",
  soft: "Soft Skills",
  tools: "Tools & Technologies",
} as const;

export function SkillsSection() {
  const { data, updateData } = useResume();
  const { skills } = data;
  const [suggesting, setSuggesting] = useState(false);

  const updateCategory = (key: keyof typeof skills, value: string[]) => {
    updateData({
      skills: { ...skills, [key]: value },
    });
  };

  const handleSuggest = () => {
    setSuggesting(true);
    setTimeout(() => {
      const next = {
        technical: Array.from(new Set([...skills.technical, ...SUGGESTED.technical])),
        soft: Array.from(new Set([...skills.soft, ...SUGGESTED.soft])),
        tools: Array.from(new Set([...skills.tools, ...SUGGESTED.tools])),
      };
      updateData({ skills: next });
      setSuggesting(false);
    }, 1000);
  };

  return (
    <section className="form-section skills-section">
      <div className="skills-header">
        <h3>Skills</h3>
        <button
          type="button"
          className="suggest-skills-btn"
          onClick={handleSuggest}
          disabled={suggesting}
        >
          {suggesting ? "Adding…" : "✨ Suggest Skills"}
        </button>
      </div>
      <div className="skill-categories">
        {(["technical", "soft", "tools"] as const).map((key) => (
          <div key={key} className="skill-category">
            <h4 className="skill-category-label">
              {LABELS[key]} ({skills[key].length})
            </h4>
            <SkillTagInput
              value={skills[key]}
              onChange={(v) => updateCategory(key, v)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import React, { useState, useRef } from "react";

interface SkillTagInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
}

export function SkillTagInput({ value, onChange }: SkillTagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addSkill = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
  };

  const removeSkill = (i: number) => {
    onChange(value.filter((_, j) => j !== i));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) {
        addSkill(input.trim());
        setInput("");
      }
    }
  };

  return (
    <div className="skill-tag-input">
      <div className="skill-pills">
        {value.map((s, i) => (
          <span key={i} className="skill-pill">
            {s}
            <button
              type="button"
              className="skill-pill-remove"
              onClick={() => removeSkill(i)}
              aria-label={`Remove ${s}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type skill and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="skill-tag-input-field"
      />
    </div>
  );
}

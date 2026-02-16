"use client";

import React from "react";
import { useResume } from "@/context/ResumeContext";
import { computeAtsScore } from "@/lib/ats-score";

export function ATSCircularScore() {
  const { data } = useResume();
  const { score, suggestions, band, bandLabel } = computeAtsScore(data);

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`ats-circular-wrap ats-band-${band}`}>
      <div className="ats-circular">
        <svg viewBox="0 0 120 120" className="ats-circular-svg">
          <circle
            className="ats-circular-bg"
            cx="60"
            cy="60"
            r={radius}
            fill="none"
          />
          <circle
            className="ats-circular-fill"
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="ats-circular-center">
          <span className="ats-circular-value">{score}</span>
        </div>
      </div>
      <div className="ats-circular-label">{bandLabel}</div>
      {suggestions.length > 0 && (
        <ul className="ats-circular-suggestions">
          {suggestions.slice(0, 6).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

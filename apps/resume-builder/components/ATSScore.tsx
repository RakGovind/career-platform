"use client";

import React from "react";
import { useResume } from "@/context/ResumeContext";
import { computeAtsScore } from "@/lib/ats-score";

export function ATSScore() {
  const { data } = useResume();
  const { score, suggestions, band } = computeAtsScore(data);

  return (
    <div className={`ats-score-wrap ats-band-${band}`}>
      <div className="ats-score-header">
        <h3 className="ats-score-label">ATS Readiness Score</h3>
        <span className="ats-score-value">{score}</span>
      </div>
      <div className="ats-score-meter">
        <div
          className="ats-score-fill"
          style={{ width: `${score}%` }}
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="ats-suggestions">
          {suggestions.slice(0, 5).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRB } from "@/context/RBContext";
import type { StepId } from "@/context/RBContext";

interface BuildPanelProps {
  stepId: StepId;
  copyContent: string;
}

export function BuildPanel({ stepId, copyContent }: BuildPanelProps) {
  const { setArtifact } = useRB();
  const [feedback, setFeedback] = useState<"worked" | "error" | "screenshot" | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(copyContent);
  };

  const handleWorked = () => {
    setFeedback("worked");
    setArtifact(stepId, { uploaded: true, type: "worked" });
  };

  const handleError = () => {
    setFeedback("error");
    setArtifact(stepId, { uploaded: true, type: "error" });
  };

  const handleAddScreenshot = () => {
    if (screenshotUrl.trim()) {
      setFeedback("screenshot");
      setArtifact(stepId, { uploaded: true, type: "screenshot", url: screenshotUrl });
    }
  };

  return (
    <div className="build-panel-content">
      <h3 className="build-panel-title">Copy This Into Lovable</h3>
      <textarea
        className="copy-textarea"
        value={copyContent}
        readOnly
        rows={8}
      />
      <button className="copy-btn" onClick={handleCopy}>
        Copy
      </button>
      <a
        href="https://lovable.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="lovable-link"
      >
        Build in Lovable
      </a>
      <div className="feedback-buttons">
        <button
          className={feedback === "worked" ? "active" : ""}
          onClick={handleWorked}
        >
          It Worked
        </button>
        <button
          className={feedback === "error" ? "active" : ""}
          onClick={handleError}
        >
          Error
        </button>
        <div className="screenshot-row">
          <input
            type="url"
            placeholder="Screenshot URL"
            value={screenshotUrl}
            onChange={(e) => setScreenshotUrl(e.target.value)}
          />
          <button
            className={feedback === "screenshot" ? "active" : ""}
            onClick={handleAddScreenshot}
          >
            Add Screenshot
          </button>
        </div>
      </div>
    </div>
  );
}

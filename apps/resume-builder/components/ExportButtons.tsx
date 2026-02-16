"use client";

import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { toPlainText, getExportWarning } from "@/lib/export-utils";
import { Toast } from "@/components/Toast";

export function ExportButtons() {
  const { data } = useResume();
  const [showWarning, setShowWarning] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showPdfToast, setShowPdfToast] = useState(false);

  const warning = getExportWarning(data);

  const handlePrint = () => {
    if (warning) setShowWarning(true);
    setShowPdfToast(true);
    window.print();
  };

  const handleCopyText = async () => {
    if (warning) setShowWarning(true);
    const text = toPlainText(data);
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="export-buttons">
      {showPdfToast && (
        <Toast
          message="PDF export ready! Check your downloads."
          onClose={() => setShowPdfToast(false)}
        />
      )}
      <button type="button" className="export-btn" onClick={handlePrint}>
        Download PDF
      </button>
      <button type="button" className="export-btn" onClick={handleCopyText}>
        {copySuccess ? "Copied" : "Copy Resume as Text"}
      </button>
      {showWarning && warning && (
        <p className="export-warning">{warning}</p>
      )}
    </div>
  );
}

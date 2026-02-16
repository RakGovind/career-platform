"use client";

import React, { useState, useEffect } from "react";
import { PremiumLayout } from "@/components/PremiumLayout";
import { useRB } from "@/context/RBContext";
import Link from "next/link";
import {
  loadRBFinalSubmission,
  saveRBFinalSubmission,
  isValidUrl,
  allProofLinksValid,
  allChecklistPassed,
  CHECKLIST_LABELS,
  buildFinalSubmissionText,
  type RBFinalSubmission,
} from "@/lib/rb-proof";

const STEP_LABELS: Record<string, string> = {
  "01": "Problem",
  "02": "Market",
  "03": "Architecture",
  "04": "HLD",
  "05": "LLD",
  "06": "Build",
  "07": "Test",
  "08": "Ship",
};

export default function ProofPage() {
  const { artifacts, stepIds } = useRB();
  const [submission, setSubmission] = useState<RBFinalSubmission>(() => loadRBFinalSubmission());

  useEffect(() => {
    saveRBFinalSubmission(submission);
  }, [submission]);

  const allStepsComplete = stepIds.every((id) => artifacts[`rb_step_${id}_artifact`]?.uploaded);
  const linksValid = allProofLinksValid(submission);
  const checklistPassed = allChecklistPassed(submission);
  const isShipped = allStepsComplete && checklistPassed && linksValid;

  const updateLink = (key: keyof Pick<RBFinalSubmission, "lovableLink" | "githubLink" | "deployLink">, value: string) => {
    setSubmission((prev) => ({ ...prev, [key]: value }));
  };

  const toggleChecklist = (index: number) => {
    setSubmission((prev) => ({
      ...prev,
      checklist: prev.checklist.map((v, i) => (i === index ? !v : v)),
    }));
  };

  const handleCopyFinalSubmission = () => {
    navigator.clipboard.writeText(
      buildFinalSubmissionText(submission.lovableLink, submission.githubLink, submission.deployLink)
    );
  };

  const lovableError = submission.lovableLink && !isValidUrl(submission.lovableLink);
  const githubError = submission.githubLink && !isValidUrl(submission.githubLink);
  const deployError = submission.deployLink && !isValidUrl(submission.deployLink);

  return (
    <PremiumLayout
      title="AI Resume Builder"
      stepLabel="Proof"
      stepNumber={9}
      totalSteps={9}
      status={isShipped ? "shipped" : "in-progress"}
      contextHeader={<span>Proof — Final Submission</span>}
      mainContent={
        <div className="proof-content">
          <h2>Proof</h2>

          {/* A) Step Completion Overview */}
          <section className="proof-section">
            <h3>Step Completion Overview</h3>
            <div className="step-status-grid">
              {stepIds.map((id) => (
                <div key={id} className="step-status-item">
                  <span className="step-num">Step {id}</span>
                  <span className="step-name">{STEP_LABELS[id]}</span>
                  <span
                    className={`step-badge ${artifacts[`rb_step_${id}_artifact`]?.uploaded ? "complete" : "pending"}`}
                  >
                    {artifacts[`rb_step_${id}_artifact`]?.uploaded ? "✓" : "—"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* B) Artifact Collection */}
          <section className="proof-section">
            <h3>Artifact Collection (Required to mark Shipped)</h3>
            <div className="proof-inputs">
              <label>
                Lovable Project Link
                <input
                  type="url"
                  placeholder="https://lovable.dev/..."
                  value={submission.lovableLink}
                  onChange={(e) => updateLink("lovableLink", e.target.value)}
                  className={lovableError ? "input-invalid" : ""}
                />
                {lovableError && <span className="input-error">Enter a valid URL</span>}
              </label>
              <label>
                GitHub Repository Link
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={submission.githubLink}
                  onChange={(e) => updateLink("githubLink", e.target.value)}
                  className={githubError ? "input-invalid" : ""}
                />
                {githubError && <span className="input-error">Enter a valid URL</span>}
              </label>
              <label>
                Deployed URL
                <input
                  type="url"
                  placeholder="https://..."
                  value={submission.deployLink}
                  onChange={(e) => updateLink("deployLink", e.target.value)}
                  className={deployError ? "input-invalid" : ""}
                />
                {deployError && <span className="input-error">Enter a valid URL</span>}
              </label>
            </div>
          </section>

          {/* Verification checklist (10 items) */}
          <section className="proof-section">
            <h3>Verification Checklist (all required for Shipped)</h3>
            <ul className="proof-checklist">
              {CHECKLIST_LABELS.map((label, i) => (
                <li key={i}>
                  <label>
                    <input
                      type="checkbox"
                      checked={submission.checklist[i]}
                      onChange={() => toggleChecklist(i)}
                    />
                    <span>{label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {isShipped && (
            <div className="proof-shipped-message">
              Project 3 Shipped Successfully.
            </div>
          )}

          <button className="copy-final-btn" onClick={handleCopyFinalSubmission}>
            Copy Final Submission
          </button>
          <Link href="/rb/08-ship" className="back-link">
            ← Back to Step 8
          </Link>
        </div>
      }
      buildPanel={
        <div className="proof-build-placeholder">
          <p>Complete all 8 steps, the verification checklist, and provide all 3 links to mark as Shipped.</p>
        </div>
      }
      proofFooter={<span className="proof-footer-text">Project 3 — Final Submission</span>}
    />
  );
}

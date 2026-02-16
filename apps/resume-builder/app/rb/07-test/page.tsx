"use client";

import { StepPage } from "@/components/StepPage";

const COPY_CONTENT = `# Step 7 — Test
Test your AI Resume Builder.
- Manual QA checklist
- Edge cases
- Screenshots/videos`;

const MAIN_CONTENT = (
  <div>
    <h2>Test</h2>
    <p className="step-desc">Validate your AI Resume Builder before shipping.</p>
    <ul className="step-checklist">
      <li><strong>Manual QA checklist</strong> — Form, preview, export, edge cases.</li>
      <li><strong>Edge cases</strong> — Empty states, long text, special chars.</li>
      <li><strong>Screenshots/videos</strong> — Capture proof for the build panel.</li>
    </ul>
    <p className="step-placeholder">Run tests, then add screenshot or mark It Worked.</p>
  </div>
);

export default function TestPage() {
  return (
    <StepPage
      stepId="07"
      stepNumber={7}
      label="Test"
      copyContent={COPY_CONTENT}
      mainContent={MAIN_CONTENT}
    />
  );
}

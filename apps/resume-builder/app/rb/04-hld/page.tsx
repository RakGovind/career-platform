"use client";

import { StepPage } from "@/components/StepPage";

const COPY_CONTENT = `# Step 4 — HLD
High-Level Design for AI Resume Builder.
- Component diagram
- Key modules
- Interfaces`;

const MAIN_CONTENT = (
  <div>
    <h2>High-Level Design</h2>
    <p className="step-desc">Document the system design at a high level.</p>
    <ul className="step-checklist">
      <li><strong>Component diagram</strong> — Major UI and backend components.</li>
      <li><strong>Key modules</strong> — Form, preview, export, storage.</li>
      <li><strong>Interfaces</strong> — APIs, data contracts.</li>
    </ul>
    <p className="step-placeholder">Copy prompts to Lovable, build, then mark proof.</p>
  </div>
);

export default function HLDPage() {
  return (
    <StepPage
      stepId="04"
      stepNumber={4}
      label="HLD"
      copyContent={COPY_CONTENT}
      mainContent={MAIN_CONTENT}
    />
  );
}

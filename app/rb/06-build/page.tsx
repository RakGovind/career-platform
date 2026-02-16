"use client";

import { StepPage } from "@/components/StepPage";

const COPY_CONTENT = `# Step 6 — Build
Implement AI Resume Builder in Lovable.
- Copy prompts/specs
- Build iteratively
- Test as you go`;

const MAIN_CONTENT = (
  <div>
    <h2>Build</h2>
    <p className="step-desc">Implement your AI Resume Builder in Lovable.</p>
    <ul className="step-checklist">
      <li><strong>Copy prompts/specs</strong> — Paste from previous steps.</li>
      <li><strong>Build iteratively</strong> — Start with core flow, then enhance.</li>
      <li><strong>Test as you go</strong> — Verify each feature works.</li>
    </ul>
    <p className="step-placeholder">Build in Lovable, then mark proof (It Worked / Error / Screenshot).</p>
  </div>
);

export default function BuildPage() {
  return (
    <StepPage
      stepId="06"
      stepNumber={6}
      label="Build"
      copyContent={COPY_CONTENT}
      mainContent={MAIN_CONTENT}
    />
  );
}

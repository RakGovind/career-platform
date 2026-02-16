"use client";

import { StepPage } from "@/components/StepPage";

const COPY_CONTENT = `# Step 5 — LLD
Low-Level Design for AI Resume Builder.
- Class/data structures
- Algorithms
- API contracts`;

const MAIN_CONTENT = (
  <div>
    <h2>Low-Level Design</h2>
    <p className="step-desc">Detail the implementation design.</p>
    <ul className="step-checklist">
      <li><strong>Class/data structures</strong> — ResumeData, form state models.</li>
      <li><strong>Algorithms</strong> — ATS scoring, validation logic.</li>
      <li><strong>API contracts</strong> — Request/response schemas.</li>
    </ul>
    <p className="step-placeholder">Copy prompts to Lovable, build, then mark proof.</p>
  </div>
);

export default function LLDPage() {
  return (
    <StepPage
      stepId="05"
      stepNumber={5}
      label="LLD"
      copyContent={COPY_CONTENT}
      mainContent={MAIN_CONTENT}
    />
  );
}

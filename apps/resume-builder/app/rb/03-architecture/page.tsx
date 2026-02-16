"use client";

import { StepPage } from "@/components/StepPage";

const COPY_CONTENT = `# Step 3 — Architecture
High-level architecture for AI Resume Builder.
- Frontend stack
- Backend/API
- Data flow`;

const MAIN_CONTENT = (
  <div>
    <h2>Architecture</h2>
    <p className="step-desc">Define the high-level technical architecture.</p>
    <ul className="step-checklist">
      <li><strong>Frontend stack</strong> — React, Next.js, etc.</li>
      <li><strong>Backend/API</strong> — Serverless, API routes, external APIs.</li>
      <li><strong>Data flow</strong> — How data moves through the system.</li>
    </ul>
    <p className="step-placeholder">Copy prompts to Lovable, build, then mark proof.</p>
  </div>
);

export default function ArchitecturePage() {
  return (
    <StepPage
      stepId="03"
      stepNumber={3}
      label="Architecture"
      copyContent={COPY_CONTENT}
      mainContent={MAIN_CONTENT}
    />
  );
}

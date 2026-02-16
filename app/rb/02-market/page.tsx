"use client";

import { StepPage } from "@/components/StepPage";

const COPY_CONTENT = `# Step 2 — Market
Analyze the market for AI Resume Builders.
- Target audience
- Competitors
- Differentiation`;

const MAIN_CONTENT = (
  <div>
    <h2>Market Analysis</h2>
    <p className="step-desc">Understand the landscape for AI Resume Builders.</p>
    <ul className="step-checklist">
      <li><strong>Target audience</strong> — Who will use this? Size of market.</li>
      <li><strong>Competitors</strong> — Existing tools (Zety, Resume.io, etc.).</li>
      <li><strong>Differentiation</strong> — What makes yours stand out?</li>
    </ul>
    <p className="step-placeholder">Copy prompts to Lovable, build, then mark proof.</p>
  </div>
);

export default function MarketPage() {
  return (
    <StepPage
      stepId="02"
      stepNumber={2}
      label="Market"
      copyContent={COPY_CONTENT}
      mainContent={MAIN_CONTENT}
    />
  );
}

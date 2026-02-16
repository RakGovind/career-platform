"use client";

import { StepPage } from "@/components/StepPage";

const COPY_CONTENT = `# Step 8 — Ship
Deploy and ship your AI Resume Builder.
- Deployment steps
- Environment config
- Launch checklist`;

const MAIN_CONTENT = (
  <div>
    <h2>Ship</h2>
    <p className="step-desc">Deploy and launch your AI Resume Builder.</p>
    <ul className="step-checklist">
      <li><strong>Deployment steps</strong> — Vercel, Netlify, or other host.</li>
      <li><strong>Environment config</strong> — Env vars, API keys if needed.</li>
      <li><strong>Launch checklist</strong> — Final review, smoke test, go live.</li>
    </ul>
    <p className="step-placeholder">Deploy, then add deploy link as screenshot or mark It Worked.</p>
  </div>
);

export default function ShipPage() {
  return (
    <StepPage
      stepId="08"
      stepNumber={8}
      label="Ship"
      copyContent={COPY_CONTENT}
      mainContent={MAIN_CONTENT}
    />
  );
}

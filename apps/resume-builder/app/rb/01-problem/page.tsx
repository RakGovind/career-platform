"use client";

import { StepPage } from "@/components/StepPage";

const COPY_CONTENT = `# Step 1 — Problem
Define the problem your AI Resume Builder solves.
- Who is the user?
- What pain point does it address?
- Why now?`;

const MAIN_CONTENT = (
  <div>
    <h2>Define the Problem</h2>
    <p className="step-desc">
      Before building, clearly articulate the problem your AI Resume Builder solves.
    </p>
    <ul className="step-checklist">
      <li><strong>Who is the user?</strong> — Job seekers, career changers, students?</li>
      <li><strong>What pain point does it address?</strong> — Manual formatting, ATS rejection, lack of feedback?</li>
      <li><strong>Why now?</strong> — Market timing, technology readiness?</li>
    </ul>
    <p className="step-placeholder">
      Copy the prompts from the right panel into Lovable, build, then mark your proof to proceed.
    </p>
  </div>
);

export default function ProblemPage() {
  return (
    <StepPage
      stepId="01"
      stepNumber={1}
      label="Problem"
      copyContent={COPY_CONTENT}
      mainContent={MAIN_CONTENT}
    />
  );
}

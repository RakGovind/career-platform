"use client";

import React from "react";
import { PremiumLayout } from "./PremiumLayout";
import { BuildPanel } from "./BuildPanel";
import { StepNav } from "./StepNav";
import { StepGuard } from "./StepGuard";
import { useRB } from "@/context/RBContext";
import type { StepId } from "@/context/RBContext";

interface StepConfig {
  stepId: StepId;
  stepNumber: number;
  label: string;
  copyContent: string;
  mainContent?: React.ReactNode;
}

export function StepPage({ stepId, stepNumber, label, copyContent, mainContent }: StepConfig) {
  const { hasArtifact } = useRB();

  const status = hasArtifact(stepId) ? "complete" : "in-progress";

  const defaultContent = (
    <div>
      <h2>{label}</h2>
      <p className="step-placeholder">
        Complete the task in the right panel, then mark your proof (It Worked / Error / Screenshot) to unlock Next.
      </p>
      <StepNav currentStep={stepId} stepLabel={label} />
    </div>
  );

  return (
    <StepGuard stepId={stepId}>
      <PremiumLayout
        title="AI Resume Builder"
        stepLabel={label}
        stepNumber={stepNumber}
        totalSteps={8}
        status={status}
        contextHeader={<span>{label}</span>}
        mainContent={
          <div className="step-main-content">
            {mainContent ?? defaultContent}
            {mainContent && <StepNav currentStep={stepId} stepLabel={label} />}
          </div>
        }
        buildPanel={<BuildPanel stepId={stepId} copyContent={copyContent} />}
      />
    </StepGuard>
  );
}

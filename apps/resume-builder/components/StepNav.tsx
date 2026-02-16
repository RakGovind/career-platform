"use client";

import React from "react";
import Link from "next/link";
import { useRB } from "@/context/RBContext";
import type { StepId } from "@/context/RBContext";

interface StepNavProps {
  currentStep: StepId;
  stepLabel: string;
}

const STEP_LABELS: Record<StepId, string> = {
  "01": "Problem",
  "02": "Market",
  "03": "Architecture",
  "04": "HLD",
  "05": "LLD",
  "06": "Build",
  "07": "Test",
  "08": "Ship",
};

export function StepNav({ currentStep, stepLabel }: StepNavProps) {
  const { hasArtifact, stepIds } = useRB();
  const idx = stepIds.indexOf(currentStep);
  const prevStep = idx > 0 ? stepIds[idx - 1] : null;
  const nextStep = idx < stepIds.length - 1 ? stepIds[idx + 1] : null;

  const canGoNext = hasArtifact(currentStep);

  return (
    <div className="step-nav">
      {prevStep ? (
        <Link href={`/rb/${prevStep}-${STEP_LABELS[prevStep].toLowerCase()}`} className="nav-btn">
          ← Previous
        </Link>
      ) : (
        <span className="nav-placeholder" />
      )}
      <span className="step-label">{stepLabel}</span>
      {nextStep ? (
        canGoNext ? (
          <Link href={`/rb/${nextStep}-${STEP_LABELS[nextStep].toLowerCase()}`} className="nav-btn">
            Next →
          </Link>
        ) : (
          <span className="nav-btn disabled">Next →</span>
        )
      ) : (
        canGoNext ? (
          <Link href="/rb/proof" className="nav-btn">
            Finish →
          </Link>
        ) : (
          <span className="nav-btn disabled">Finish →</span>
        )
      )}
    </div>
  );
}

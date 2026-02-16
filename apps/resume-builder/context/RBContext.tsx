"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const RB_STORAGE_KEY = "kodnest_rb_artifacts";

export type StepId = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";

export interface StepArtifact {
  stepId: StepId;
  uploaded: boolean;
  type?: "worked" | "error" | "screenshot";
  url?: string;
}

export interface RBArtifacts {
  [key: string]: StepArtifact | undefined;
}

const STEP_IDS: StepId[] = ["01", "02", "03", "04", "05", "06", "07", "08"];

function loadArtifacts(): RBArtifacts {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(RB_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveArtifacts(artifacts: RBArtifacts) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RB_STORAGE_KEY, JSON.stringify(artifacts));
  } catch {}
}

interface RBContextValue {
  artifacts: RBArtifacts;
  setArtifact: (stepId: StepId, data: Partial<StepArtifact>) => void;
  hasArtifact: (stepId: StepId) => boolean;
  canProceed: (stepId: StepId) => boolean;
  stepIds: StepId[];
}

const RBContext = createContext<RBContextValue | null>(null);

export function RBProvider({ children }: { children: React.ReactNode }) {
  const [artifacts, setArtifactsState] = useState<RBArtifacts>({});

  useEffect(() => {
    setArtifactsState(loadArtifacts());
  }, []);

  const setArtifact = useCallback((stepId: StepId, data: Partial<StepArtifact>) => {
    const key = `rb_step_${stepId}_artifact`;
    setArtifactsState((prev) => {
      const next = {
        ...prev,
        [key]: {
          stepId,
          uploaded: true,
          ...prev[key],
          ...data,
        },
      };
      saveArtifacts(next);
      return next;
    });
  }, []);

  const hasArtifact = useCallback((stepId: StepId) => {
    const key = `rb_step_${stepId}_artifact`;
    return !!artifacts[key]?.uploaded;
  }, [artifacts]);

  const canProceed = useCallback(
    (stepId: StepId) => hasArtifact(stepId),
    [hasArtifact]
  );

  const value: RBContextValue = {
    artifacts,
    setArtifact,
    hasArtifact,
    canProceed,
    stepIds: STEP_IDS,
  };

  return <RBContext.Provider value={value}>{children}</RBContext.Provider>;
}

export function useRB() {
  const ctx = useContext(RBContext);
  if (!ctx) throw new Error("useRB must be used within RBProvider");
  return ctx;
}

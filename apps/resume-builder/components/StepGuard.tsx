"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRB } from "@/context/RBContext";
import type { StepId } from "@/context/RBContext";

const STEP_ROUTES: Record<StepId, string> = {
  "01": "/rb/01-problem",
  "02": "/rb/02-market",
  "03": "/rb/03-architecture",
  "04": "/rb/04-hld",
  "05": "/rb/05-lld",
  "06": "/rb/06-build",
  "07": "/rb/07-test",
  "08": "/rb/08-ship",
};

export function StepGuard({
  stepId,
  children,
}: {
  stepId: StepId;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { hasArtifact, stepIds } = useRB();
  const idx = stepIds.indexOf(stepId);

  useEffect(() => {
    for (let i = 0; i < idx; i++) {
      const prevId = stepIds[i];
      if (!hasArtifact(prevId)) {
        router.replace(STEP_ROUTES[prevId]);
        return;
      }
    }
  }, [stepId, idx, stepIds, hasArtifact, router]);

  return <>{children}</>;
}

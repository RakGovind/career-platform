"use client";

import React from "react";
import { getBulletFeedback } from "@/lib/bullet-guidance";

interface BulletGuidanceProps {
  bulletsText: string;
}

export function BulletGuidance({ bulletsText }: BulletGuidanceProps) {
  const feedback = getBulletFeedback(bulletsText);
  const items = feedback.filter((f) => f.needsActionVerb || f.needsNumbers);

  if (items.length === 0) return null;

  return (
    <div className="bullet-guidance">
      {items.map((f, i) => {
        const tips: string[] = [];
        if (f.needsActionVerb) tips.push("Start with a strong action verb.");
        if (f.needsNumbers) tips.push("Add measurable impact (numbers).");
        return (
          <div key={i} className="bullet-guidance-item">
            Bullet {f.bulletIndex}: {tips.join(" ")}
          </div>
        );
      })}
    </div>
  );
}

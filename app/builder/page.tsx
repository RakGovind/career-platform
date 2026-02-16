"use client";

import { BuilderForm } from "@/components/BuilderForm";
import { LivePreview } from "@/components/LivePreview";

export default function BuilderPage() {
  return (
    <main className="builder-main">
      <div className="builder-left">
        <BuilderForm />
      </div>
      <div className="builder-right">
        <LivePreview />
      </div>
    </main>
  );
}

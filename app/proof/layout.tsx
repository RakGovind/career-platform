"use client";

import { AppNav } from "@/components/AppNav";

export default function ProofLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <AppNav />
      {children}
    </div>
  );
}

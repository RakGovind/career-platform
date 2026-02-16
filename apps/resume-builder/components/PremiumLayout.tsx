"use client";

import React from "react";

interface PremiumLayoutProps {
  title: string;
  stepLabel: string;
  stepNumber: number;
  totalSteps?: number;
  status?: "pending" | "complete" | "in-progress" | "shipped";
  contextHeader: React.ReactNode;
  mainContent: React.ReactNode;
  buildPanel: React.ReactNode;
  proofFooter?: React.ReactNode;
}

export function PremiumLayout({
  title,
  stepLabel,
  stepNumber,
  totalSteps = 8,
  status = "in-progress",
  contextHeader,
  mainContent,
  buildPanel,
  proofFooter,
}: PremiumLayoutProps) {
  const statusText =
    status === "shipped" ? "Shipped" :
    status === "complete" ? "Complete" :
    status === "in-progress" ? "In Progress" : "Pending";
  const statusColor =
    status === "shipped" || status === "complete" ? "var(--color-success)" :
    status === "in-progress" ? "var(--color-accent)" : "var(--color-text-muted)";

  return (
    <div className="premium-layout">
      {/* Top bar */}
      <header className="top-bar">
        <div className="top-bar-left">{title}</div>
        <div className="top-bar-center">
          Project 3 — Step {stepNumber} of {totalSteps}
        </div>
        <div className="top-bar-right">
          <span className="status-badge" style={{ background: statusColor }}>
            {statusText}
          </span>
        </div>
      </header>

      {/* Context header */}
      <div className="context-header">{contextHeader}</div>

      {/* Main area: 70% workspace + 30% build panel */}
      <div className="workspace-row">
        <main className="main-workspace">{mainContent}</main>
        <aside className="build-panel">{buildPanel}</aside>
      </div>

      {/* Proof footer */}
      <footer className="proof-footer">
        {proofFooter ?? (
          <a href="/rb/proof" className="proof-footer-link">View Proof →</a>
        )}
      </footer>
    </div>
  );
}

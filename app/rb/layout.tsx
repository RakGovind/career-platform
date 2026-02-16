"use client";

import { RBProvider } from "@/context/RBContext";

export default function RBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RBProvider>{children}</RBProvider>;
}

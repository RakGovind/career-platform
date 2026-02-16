"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type TemplateId = "classic" | "modern" | "minimal";

const STORAGE_KEY = "resumeBuilderTemplate";

function loadStored(): TemplateId {
  if (typeof window === "undefined") return "classic";
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "modern" || raw === "minimal" || raw === "classic") return raw;
  } catch {}
  return "classic";
}

function saveToStorage(template: TemplateId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, template);
  } catch {}
}

interface TemplateContextValue {
  template: TemplateId;
  setTemplate: (t: TemplateId) => void;
}

const TemplateContext = createContext<TemplateContextValue | null>(null);

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [template, setTemplateState] = useState<TemplateId>("classic");

  useEffect(() => {
    setTemplateState(loadStored());
  }, []);

  const setTemplate = useCallback((t: TemplateId) => {
    setTemplateState(t);
    saveToStorage(t);
  }, []);

  return (
    <TemplateContext.Provider value={{ template, setTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const ctx = useContext(TemplateContext);
  if (!ctx) throw new Error("useTemplate must be used within TemplateProvider");
  return ctx;
}

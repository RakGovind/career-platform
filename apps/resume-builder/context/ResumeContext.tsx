"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ResumeData, SkillCategories } from "@/lib/resume-types";
import { initialResumeData, sampleData, emptySkillCategories } from "@/lib/resume-types";

const STORAGE_KEY = "resumeBuilderData";

function loadStored(): ResumeData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ResumeData;
    if (parsed && typeof parsed === "object") return parsed;
  } catch {}
  return null;
}

function saveToStorage(data: ResumeData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function migrateSkills(skills: unknown): SkillCategories {
  if (skills && typeof skills === "object" && "technical" in skills) {
    const s = skills as SkillCategories;
    return {
      technical: Array.isArray(s.technical) ? s.technical : [],
      soft: Array.isArray(s.soft) ? s.soft : [],
      tools: Array.isArray(s.tools) ? s.tools : [],
    };
  }
  if (Array.isArray(skills)) {
    return { ...emptySkillCategories, technical: skills as string[] };
  }
  return { ...emptySkillCategories };
}

function migrateProjects(projects: unknown): ResumeData["projects"] {
  if (!Array.isArray(projects)) return [];
  return projects.map((p: Record<string, unknown>) => ({
    name: String(p.name ?? ""),
    description: String(p.description ?? ""),
    techStack: Array.isArray(p.techStack) ? p.techStack : [],
    liveUrl: p.liveUrl ? String(p.liveUrl) : undefined,
    githubUrl: p.githubUrl ? String(p.githubUrl) : (p.link ? String(p.link) : undefined),
  }));
}

function mergeWithDefaults(stored: Partial<ResumeData> & { skills?: unknown; projects?: unknown }): ResumeData {
  const def = initialResumeData;
  return {
    personal: { ...def.personal, ...stored.personal },
    summary: stored.summary ?? def.summary,
    education: Array.isArray(stored.education) ? stored.education : def.education,
    experience: Array.isArray(stored.experience) ? stored.experience : def.experience,
    projects: migrateProjects(stored.projects),
    skills: migrateSkills(stored.skills),
    links: { ...def.links, ...stored.links },
  };
}

interface ResumeContextValue {
  data: ResumeData;
  updateData: (updates: Partial<ResumeData>) => void;
  loadSample: () => void;
  reset: () => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ResumeData>(initialResumeData);

  useEffect(() => {
    const stored = loadStored();
    if (stored) setData(mergeWithDefaults(stored));
  }, []);

  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  const updateData = useCallback((updates: Partial<ResumeData>) => {
    setData((prev) => {
      const next = { ...prev, ...updates };
      return next;
    });
  }, []);

  const loadSample = useCallback(() => {
    const sample = JSON.parse(JSON.stringify(sampleData));
    setData(sample);
  }, []);

  const reset = useCallback(() => {
    setData(JSON.parse(JSON.stringify(initialResumeData)));
  }, []);

  return (
    <ResumeContext.Provider value={{ data, updateData, loadSample, reset }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}

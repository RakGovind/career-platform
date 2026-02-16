import type { ResumeData } from "./resume-types";
import { hasMeasurableImpact } from "./ats-score";

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function getTop3Improvements(data: ResumeData): string[] {
  const suggestions: string[] = [];

  if (data.projects.length < 2) {
    suggestions.push("Add at least 2 projects.");
  }
  if (!hasMeasurableImpact(data) && (data.experience.length > 0 || data.projects.length > 0)) {
    suggestions.push("Add measurable impact (numbers) in bullets.");
  }
  const summaryWords = wordCount(data.summary);
  if (summaryWords > 0 && summaryWords < 40) {
    suggestions.push("Expand summary to at least 40 words.");
  }
  const totalSkills =
    (data.skills?.technical?.length ?? 0) +
    (data.skills?.soft?.length ?? 0) +
    (data.skills?.tools?.length ?? 0);
  if (totalSkills > 0 && totalSkills < 8) {
    suggestions.push("Add more skills (target 8+).");
  }
  if (data.experience.length === 0) {
    suggestions.push("Add internship or project work as experience.");
  }

  return suggestions.slice(0, 3);
}

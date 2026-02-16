const STORAGE_KEY = "rb_final_submission";

export interface RBFinalSubmission {
  lovableLink: string;
  githubLink: string;
  deployLink: string;
  checklist: boolean[];
}

const DEFAULT: RBFinalSubmission = {
  lovableLink: "",
  githubLink: "",
  deployLink: "",
  checklist: Array(10).fill(false),
};

export function loadRBFinalSubmission(): RBFinalSubmission {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<RBFinalSubmission>;
    return {
      lovableLink: typeof parsed.lovableLink === "string" ? parsed.lovableLink : "",
      githubLink: typeof parsed.githubLink === "string" ? parsed.githubLink : "",
      deployLink: typeof parsed.deployLink === "string" ? parsed.deployLink : "",
      checklist: Array.isArray(parsed.checklist) && parsed.checklist.length === 10
        ? parsed.checklist.map(Boolean)
        : DEFAULT.checklist,
    };
  } catch {
    return DEFAULT;
  }
}

export function saveRBFinalSubmission(data: RBFinalSubmission) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const URL_PATTERN = /^https?:\/\/.+/i;

export function isValidUrl(s: string): boolean {
  if (!s?.trim()) return false;
  try {
    const u = new URL(s.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function allProofLinksValid(data: RBFinalSubmission): boolean {
  return (
    isValidUrl(data.lovableLink) &&
    isValidUrl(data.githubLink) &&
    isValidUrl(data.deployLink)
  );
}

export function allChecklistPassed(data: RBFinalSubmission): boolean {
  return data.checklist.length === 10 && data.checklist.every(Boolean);
}

export const CHECKLIST_LABELS = [
  "Form sections save to localStorage",
  "Live preview updates in real-time",
  "Template switching preserves data",
  "Color theme persists after refresh",
  "ATS score calculates correctly",
  "Score updates live on edit",
  "Export buttons work (copy / download)",
  "Empty states handled gracefully",
  "Mobile responsive layout works",
  "No console errors on any page",
];

export function buildFinalSubmissionText(
  lovableLink: string,
  githubLink: string,
  deployLink: string
): string {
  return `------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${lovableLink || "(not provided)"}
GitHub Repository: ${githubLink || "(not provided)"}
Live Deployment: ${deployLink || "(not provided)"}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------`;
}

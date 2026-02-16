const ACTION_VERBS = [
  "built", "developed", "designed", "implemented", "led", "improved",
  "created", "optimized", "automated", "managed", "launched", "reduced",
  "increased", "streamlined", "established", "delivered", "achieved",
  "build", "develop", "design", "implement", "lead", "create", "optimize",
  "automate", "manage", "launch", "establish", "achieve",
];

const NUMBER_PATTERN = /[\d%]|\d+[kK]|[\d.]+\s*x\b/i;

function getBullets(text: string): string[] {
  if (!text?.trim()) return [];
  return text
    .split(/\n/)
    .map((s) => s.replace(/^[\s•\-*]+/, "").trim())
    .filter(Boolean);
}

function startsWithActionVerb(bullet: string): boolean {
  const first = bullet.trim().split(/\s+/)[0]?.toLowerCase() || "";
  if (!first) return false;
  return ACTION_VERBS.some((v) => first === v || first.startsWith(v));
}

function hasNumericIndicator(bullet: string): boolean {
  return NUMBER_PATTERN.test(bullet);
}

export interface BulletFeedback {
  bulletIndex: number;
  bullet: string;
  needsActionVerb: boolean;
  needsNumbers: boolean;
}

export function getBulletFeedback(bulletsText: string): BulletFeedback[] {
  const bullets = getBullets(bulletsText);
  return bullets.map((bullet, i) => ({
    bulletIndex: i + 1,
    bullet,
    needsActionVerb: bullet.length > 0 && !startsWithActionVerb(bullet),
    needsNumbers: bullet.length > 0 && !hasNumericIndicator(bullet),
  }));
}

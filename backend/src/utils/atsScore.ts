import type { ResumeData } from "../types/ResumeSchema";

// ─── ATS Score Computation ──────────────────────────────────────────────────
// Implements the PRD scoring rubric. Returns a value from 0–100.

const DATE_REGEX = /^\d{4}-\d{2}$/; // ISO 8601 YYYY-MM

function hasPlaceholder(text: string): boolean {
  const placeholders = ["lorem", "ipsum", "your name", "your email", "[name]", "[email]", "example.com"];
  return placeholders.some((p) => text.toLowerCase().includes(p));
}

export function computeAtsScore(data: ResumeData): number {
  let score = 0;

  // 5pts — email present
  if (data.personalInfo.email) score += 5;

  // 5pts — phone present
  if (data.personalInfo.phone) score += 5;

  // 10pts — summary ≥ 50 chars
  if (data.personalInfo.summary && data.personalInfo.summary.length >= 50) score += 10;

  // 15pts — at least 1 work experience entry
  if (data.workExperience.length >= 1) score += 15;

  // 10pts — each work experience has ≥ 3 bullets (all must qualify)
  const workWithBullets = data.workExperience.filter((w) => w.bullets.length >= 3);
  if (data.workExperience.length > 0 && workWithBullets.length === data.workExperience.length) {
    score += 10;
  }

  // 10pts — at least 1 education entry
  if (data.education.length >= 1) score += 10;

  // 10pts — at least 1 project entry
  if (data.projects.length >= 1) score += 10;

  // 15pts — skills has ≥ 2 categories
  if (data.skills.length >= 2) score += 15;

  // 10pts — no placeholder text in name, email, or summary
  const noPlaceholder =
    !hasPlaceholder(data.personalInfo.fullName) &&
    !hasPlaceholder(data.personalInfo.email) &&
    !hasPlaceholder(data.personalInfo.summary);
  if (noPlaceholder) score += 10;

  // 10pts — all date fields in correct YYYY-MM format
  const allDates: (string | null | undefined)[] = [
    ...data.workExperience.flatMap((w) => [w.startDate, w.endDate]),
    ...data.education.flatMap((e) => [e.startDate, e.endDate]),
  ];
  const validDates = allDates.filter(Boolean).every((d) => DATE_REGEX.test(d!) || d === "Present");
  if (validDates) score += 10;

  return Math.min(100, score);
}

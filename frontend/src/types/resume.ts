// Shared TypeScript types for resume data — mirrors backend ResumeSchema.ts

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  linkedIn?: string | null;
  github?: string | null;
  website?: string | null;
  summary: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string | null;
  gpa?: number | null;
  honors?: string | null;
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  url?: string | null;
  github?: string | null;
  bullets: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ResumeData {
  schemaVersion: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  certifications: string[];
  languages: string[];
}

export interface ResumeRecord {
  id: string;
  title: string;
  templateId: string;
  schemaVersion: string;
  atsScore: number | null;
  parsedData?: ResumeData;
  createdAt: string;
  updatedAt: string;
}

export const TEMPLATE_IDS = [
  { id: "minimal-clean", label: "Minimal Clean" },
  { id: "tech-pro", label: "Tech Pro" },
  { id: "corporate", label: "Corporate" },
  { id: "creative", label: "Creative" },
  { id: "terminal", label: "Terminal" },
] as const;

export type TemplateId = typeof TEMPLATE_IDS[number]["id"];

import { z } from "zod";

// ─── Canonical Resume Schema ────────────────────────────────────────────────
// This is the single source of truth aligned with the PRD contract.
// The parser service LLM prompt must output JSON matching this schema.

export const PersonalInfoSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  linkedIn: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  summary: z.string(),
});

export const WorkExperienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  bullets: z.array(z.string()),
});

export const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  gpa: z.number().optional().nullable(),
  honors: z.string().optional().nullable(),
});

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  url: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  bullets: z.array(z.string()),
});

export const SkillGroupSchema = z.object({
  category: z.string(),
  items: z.array(z.string()),
});

export const ResumeDataSchema = z.object({
  schemaVersion: z.string().default("1.0.0"),
  personalInfo: PersonalInfoSchema,
  workExperience: z.array(WorkExperienceSchema),
  education: z.array(EducationSchema),
  projects: z.array(ProjectSchema),
  skills: z.array(SkillGroupSchema),
  certifications: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type ResumeData = z.infer<typeof ResumeDataSchema>;

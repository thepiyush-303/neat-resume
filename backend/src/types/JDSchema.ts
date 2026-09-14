import { z } from 'zod';

// ─── JD Dictionary Schema ────────────────────────────────────────────────────
// Structured output from the JD Analyzer LLM call.

export const JDDictionarySchema = z.object({
  companyName: z.string(),
  roleTitle: z.string(),
  department: z.string().optional().default(''),
  requiredSkills: z.array(z.string()).default([]),
  preferredSkills: z.array(z.string()).default([]),
  atsFriendlyTerms: z.array(z.string()).default([]),
  keyResponsibilities: z.array(z.string()).default([]),
  industryKeywords: z.array(z.string()).default([]),
  experienceLevel: z.string().optional().default(''),
  educationPreference: z.string().optional().default(''),
});

export type JDDictionary = z.infer<typeof JDDictionarySchema>;

// ─── API Request Schema ───────────────────────────────────────────────────────
// Validates the incoming body for POST /api/ats-optimize.

export const OptimizeRequestSchema = z.object({
  resumeId: z.string().min(1, 'resumeId is required'),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters'),
  companyName: z.string().min(1, 'Company name is required').max(100),
  roleTitle: z.string().min(1, 'Role title is required').max(100),
});

export type OptimizeRequest = z.infer<typeof OptimizeRequestSchema>;

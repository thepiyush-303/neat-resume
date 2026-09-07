const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const ResumeDataSchema = z.object({
  schemaVersion: z.string().default("1.0.0"),
  personalInfo: z.object({
    fullName: z.string(),
    email: z.string(),
    phone: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    linkedIn: z.string().optional().nullable(),
    github: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
    summary: z.string(),
  }),
  workExperience: z.array(z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.string(),
    endDate: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    bullets: z.array(z.string()),
  })),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    startDate: z.string(),
    endDate: z.string().optional().nullable(),
    gpa: z.number().optional().nullable(),
    honors: z.string().optional().nullable(),
  })),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    url: z.string().optional().nullable(),
    github: z.string().optional().nullable(),
    bullets: z.array(z.string()),
  })),
  skills: z.array(z.object({
    category: z.string(),
    items: z.array(z.string()),
  })),
  certifications: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
});

const data = {
  personalInfo: { fullName: "Test User", email: "test@test.com", summary: "Summary" },
  workExperience: [],
  education: [],
  projects: [],
  skills: []
};

try {
  const v = ResumeDataSchema.parse(data);
  console.log("Validation matched:", v);
} catch (e) {
  console.error("Zod Error:", e.errors);
}

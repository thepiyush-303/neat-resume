import { z } from "zod";

export const PortfolioSchema = z.object({
    personalInfo: z.object({
        name: z.string().describe("The candidate's full name"),
        role: z.string().describe("Their primary professional title, e.g., Full Stack Developer"),
        bio: z.string().describe("A concise, professional summary written in the first person (max 3 sentences)"),
        github: z.string().nullable().describe("GitHub URL if present, otherwise null"),
    }),
    experience: z.array(
        z.object({
            company: z.string(),
            role: z.string(),
            duration: z.string().describe("Format as 'Month Year - Month Year' or 'Present'"),
        })
    ),
    skills: z.array(z.string()).describe("List of technical skills, frameworks, and tools"),
});
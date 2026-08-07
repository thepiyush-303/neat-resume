"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioSchema = void 0;
const zod_1 = require("zod");
exports.PortfolioSchema = zod_1.z.object({
    personalInfo: zod_1.z.object({
        name: zod_1.z.string().describe("The candidate's full name"),
        role: zod_1.z.string().describe("Their primary professional title, e.g., Full Stack Developer"),
        bio: zod_1.z.string().describe("A concise, professional summary written in the first person (max 3 sentences)"),
        email: zod_1.z.string().nullable().optional().describe("Email address if present"),
        phone: zod_1.z.string().nullable().optional().describe("Phone number if present"),
        location: zod_1.z.string().nullable().optional().describe("City, Country or location"),
        linkedin: zod_1.z.string().nullable().optional().describe("LinkedIn URL or profile handle"),
        github: zod_1.z.string().nullable().optional().describe("GitHub URL or profile handle"),
        portfolio: zod_1.z.string().nullable().optional().describe("Personal website URL if present"),
    }),
    education: zod_1.z.array(zod_1.z.object({
        institution: zod_1.z.string().describe("University, College, or Institute name"),
        degree: zod_1.z.string().describe("Degree title, e.g., Bachelor of Technology in Computer Science"),
        location: zod_1.z.string().nullable().optional().describe("Location of institution"),
        startDate: zod_1.z.string().describe("Start date, e.g., August 2023"),
        endDate: zod_1.z.string().describe("End date or Present, e.g., May 2027"),
        gpa: zod_1.z.string().nullable().optional().describe("GPA or percentage if mentioned"),
    })),
    experience: zod_1.z.array(zod_1.z.object({
        company: zod_1.z.string().describe("Company or organization name"),
        role: zod_1.z.string().describe("Job title or position held"),
        location: zod_1.z.string().nullable().optional().describe("City, Country or Remote"),
        startDate: zod_1.z.string().describe("Start date, e.g., May 2025"),
        endDate: zod_1.z.string().describe("End date or Present, e.g., August 2025"),
        bullets: zod_1.z.array(zod_1.z.string()).describe("List of key achievements and bullet points for this position"),
    })),
    projects: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().describe("Project title"),
        description: zod_1.z.string().describe("Detailed description of what was built and key achievements"),
        techStack: zod_1.z.array(zod_1.z.string()).describe("List of technologies, frameworks, and tools used"),
        links: zod_1.z.object({
            github: zod_1.z.string().nullable().optional(),
            live: zod_1.z.string().nullable().optional(),
        }).nullable().optional(),
    })),
    achievements: zod_1.z.array(zod_1.z.string()).describe("List of awards, competitive programming ranks, leadership, or honors"),
    skills: zod_1.z.array(zod_1.z.object({
        category: zod_1.z.string().describe("Skill group name, e.g., Languages, Frameworks & Libraries, Platforms & Tools"),
        items: zod_1.z.array(zod_1.z.string()).describe("Array of skill names in this category"),
    })),
});

import { z } from "zod";

export const PortfolioSchema = z.object({
  personalInfo: z.object({
    name: z.string().describe("The candidate's full name"),
    role: z.string().describe("Their primary professional title, e.g., Full Stack Developer"),
    bio: z.string().describe("A concise, professional summary written in the first person (max 3 sentences)"),
    email: z.string().nullable().optional().describe("Email address if present"),
    phone: z.string().nullable().optional().describe("Phone number if present"),
    location: z.string().nullable().optional().describe("City, Country or location"),
    linkedin: z.string().nullable().optional().describe("LinkedIn URL or profile handle"),
    github: z.string().nullable().optional().describe("GitHub URL or profile handle"),
    portfolio: z.string().nullable().optional().describe("Personal website URL if present"),
  }),
  education: z.array(
    z.object({
      institution: z.string().describe("University, College, or Institute name"),
      degree: z.string().describe("Degree title, e.g., Bachelor of Technology in Computer Science"),
      location: z.string().nullable().optional().describe("Location of institution"),
      startDate: z.string().describe("Start date, e.g., August 2023"),
      endDate: z.string().describe("End date or Present, e.g., May 2027"),
      gpa: z.string().nullable().optional().describe("GPA or percentage if mentioned"),
    })
  ),
  experience: z.array(
    z.object({
      company: z.string().describe("Company or organization name"),
      role: z.string().describe("Job title or position held"),
      location: z.string().nullable().optional().describe("City, Country or Remote"),
      startDate: z.string().describe("Start date, e.g., May 2025"),
      endDate: z.string().describe("End date or Present, e.g., August 2025"),
      bullets: z.array(z.string()).describe("List of key achievements and bullet points for this position"),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string().describe("Project title"),
      description: z.string().describe("Detailed description of what was built and key achievements"),
      techStack: z.array(z.string()).describe("List of technologies, frameworks, and tools used"),
      links: z.object({
        github: z.string().nullable().optional(),
        live: z.string().nullable().optional(),
      }).nullable().optional(),
    })
  ),
  achievements: z.array(z.string()).describe("List of awards, competitive programming ranks, leadership, or honors"),
  skills: z.array(
    z.object({
      category: z.string().describe("Skill group name, e.g., Languages, Frameworks & Libraries, Platforms & Tools"),
      items: z.array(z.string()).describe("Array of skill names in this category"),
    })
  ),
});
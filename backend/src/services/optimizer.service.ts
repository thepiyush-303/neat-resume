import { GoogleGenAI } from '@google/genai';
import { config } from '../utils/env';
import { ResumeDataSchema, type ResumeData } from '../types/ResumeSchema';
import { JDDictionarySchema, type JDDictionary } from '../types/JDSchema';

const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

// ─── Step 1: JD Analyzer Prompt ──────────────────────────────────────────────

const JD_ANALYZER_PROMPT = `You are a job description analyzer. Extract structured information from the job description and return ONLY valid JSON matching this exact schema (no markdown, no explanation):
{
  "companyName": "string",
  "roleTitle": "string",
  "department": "string or empty string",
  "requiredSkills": ["string"],
  "preferredSkills": ["string"],
  "atsFriendlyTerms": ["string - industry buzzwords and action verbs from the JD"],
  "keyResponsibilities": ["string - max 8 core responsibilities"],
  "industryKeywords": ["string - domain-specific keywords that ATS systems look for"],
  "experienceLevel": "string e.g. Senior (5+ years) or empty string",
  "educationPreference": "string or empty string"
}

Rules:
- Return ONLY the JSON object. No markdown code blocks.
- Extract skills that appear explicitly in the JD, do not invent them.
- atsFriendlyTerms should include action verbs (led, architected, optimized) and domain terms.
- industryKeywords should include technical acronyms, methodologies, and frameworks.
- If a field cannot be determined, use an empty string or empty array.`;

// ─── Step 2: Resume Rewriter Prompt ──────────────────────────────────────────

const buildRewriterPrompt = (originalData: ResumeData, jdDict: JDDictionary): string => `You are a professional resume writer specializing in ATS optimization. You will receive a user's resume data in JSON format and a Job Description Dictionary. Your task is to return an optimized version of the resume that maximizes ATS match for the target role.

TARGET ROLE: ${jdDict.roleTitle} at ${jdDict.companyName}
REQUIRED SKILLS: ${jdDict.requiredSkills.join(', ')}
PREFERRED SKILLS: ${jdDict.preferredSkills.join(', ')}
KEY RESPONSIBILITIES: ${jdDict.keyResponsibilities.join('; ')}
ATS TERMS TO INCORPORATE: ${jdDict.atsFriendlyTerms.join(', ')}
INDUSTRY KEYWORDS: ${jdDict.industryKeywords.join(', ')}

STRICT RULES — MUST FOLLOW:
1. Return ONLY valid JSON matching the exact same schema as the input. No markdown, no explanation.
2. NEVER change: email, phone, location, linkedIn, github, website, fullName, company names, role titles, institution names, degree, field, dates, GPA, project names, project URLs.
3. ONLY rewrite: personalInfo.summary, workExperience[].bullets, projects[].description, projects[].bullets.
4. For skills: append missing required/preferred skills to the most relevant existing skill category. Do NOT remove existing skills.
5. Bullets must start with a strong action verb. Naturally incorporate ATS terms and keywords where they fit the context. Do NOT fabricate accomplishments — reword existing ones.
6. The summary must be 2-4 sentences, written in third person, and explicitly mention the target role type and key skills.
7. certifications, languages, and education arrays must be returned EXACTLY as received.
8. schemaVersion must be returned exactly as received.

ORIGINAL RESUME JSON:
${JSON.stringify(originalData, null, 2)}

Return the complete optimized ResumeData JSON object now:`;

// ─── Exported Functions ───────────────────────────────────────────────────────

/**
 * Step 1 — Analyze a raw job description and extract a structured JDDictionary.
 */
export async function analyzeJobDescription(rawJD: string, maxRetries = 2): Promise<JDDictionary> {
  let lastError = '';

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let prompt = JD_ANALYZER_PROMPT;
    if (lastError) {
      prompt += `\n\nPrevious attempt had validation errors: ${lastError}\nFix these issues in your output.`;
    }
    prompt += `\n\nJOB DESCRIPTION:\n${rawJD}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let jsonText = response.text || '';
    jsonText = jsonText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
      const parsed = JSON.parse(jsonText);
      return JDDictionarySchema.parse(parsed);
    } catch (e: any) {
      lastError = e.message;
      if (attempt === maxRetries) {
        throw new Error(`JD analysis failed after ${maxRetries + 1} attempts: ${lastError}`);
      }
    }
  }

  throw new Error('JD analysis failed');
}

/**
 * Step 2 — Rewrite a resume's wording to align with the extracted JD dictionary.
 * Structure, factual data, and formatting decisions remain unchanged.
 */
export async function optimizeResume(
  originalData: ResumeData,
  jdDict: JDDictionary,
  maxRetries = 2,
): Promise<ResumeData> {
  let lastError = '';

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let prompt = buildRewriterPrompt(originalData, jdDict);
    if (lastError) {
      prompt += `\n\nPrevious attempt had validation errors: ${lastError}\nFix these issues and ensure the output is valid JSON.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let jsonText = response.text || '';
    jsonText = jsonText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
      const parsed = JSON.parse(jsonText);
      return ResumeDataSchema.parse(parsed);
    } catch (e: any) {
      lastError = e.message;
      if (attempt === maxRetries) {
        throw new Error(`Resume optimization failed after ${maxRetries + 1} attempts: ${lastError}`);
      }
    }
  }

  throw new Error('Resume optimization failed');
}

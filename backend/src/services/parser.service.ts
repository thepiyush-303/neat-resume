import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { GoogleGenAI } from '@google/genai';
import { ResumeDataSchema, type ResumeData } from '../types/ResumeSchema';
import { config } from '../utils/env';

const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

const SYSTEM_PROMPT = `You are a resume parser. Extract structured information from the resume text and return ONLY valid JSON matching this exact schema (no markdown, no explanation):
{
  "schemaVersion": "1.0.0",
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string or null",
    "location": "string or null",
    "linkedIn": "string or null",
    "github": "string or null",
    "website": "string or null",
    "summary": "2-4 sentence professional summary"
  },
  "workExperience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM or Present or null",
      "location": "string or null",
      "bullets": ["max 6 achievement-focused bullet strings"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM or Present or null",
      "gpa": number or null,
      "honors": "string or null"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "techStack": ["string"],
      "url": "string or null",
      "github": "string or null",
      "bullets": ["string"]
    }
  ],
  "skills": [
    {
      "category": "string",
      "items": ["string"]
    }
  ],
  "certifications": ["string"],
  "languages": ["string"]
}

Rules:
- Dates MUST be in YYYY-MM format (e.g. 2023-06). If only year is available use YYYY-01.
- Return ONLY the JSON object. No markdown code blocks.
- If a field is missing from the resume, use null for optional fields or an empty array for lists.
- Write the summary in third person if not present in the resume.`;

/**
 * Extract raw text from a PDF or DOCX buffer.
 */
export async function extractText(buffer: Buffer, mimetype: string): Promise<string> {
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text as string;
  }
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

/**
 * Send raw resume text to Gemini and parse the structured JSON response.
 * Retries up to `maxRetries` times if validation fails.
 */
export async function structureResume(rawText: string, maxRetries = 2): Promise<ResumeData> {
  let lastError = '';

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let prompt = SYSTEM_PROMPT;
    if (lastError) {
      prompt += `\n\nPrevious attempt had validation errors: ${lastError}\nFix these issues in your output.`;
    }
    prompt += `\n\nRESUME TEXT:\n${rawText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let jsonText = response.text || '';
    // Strip markdown code fences if present
    jsonText = jsonText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
      const parsed = JSON.parse(jsonText);
      return ResumeDataSchema.parse(parsed);
    } catch (e: any) {
      lastError = e.message;
      if (attempt === maxRetries) {
        throw new Error(`Resume parsing failed after ${maxRetries + 1} attempts: ${lastError}`);
      }
    }
  }

  // Unreachable — satisfies TypeScript
  throw new Error('Resume parsing failed');
}

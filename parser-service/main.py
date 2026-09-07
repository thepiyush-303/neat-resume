import io
import json
import os
import re

import pdfplumber
from docx import Document
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from pydantic import BaseModel, ValidationError
from typing import Optional, List
from dotenv import load_dotenv
from jinja2 import Environment, FileSystemLoader

load_dotenv("../.env") # Try root .env first
load_dotenv() # Then backend/parser specific .env


# ─── App Setup ────────────────────────────────────────────────────────────────

app = FastAPI(title="NeatResume Parser Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "5"))
MAX_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

client = genai.Client(api_key=GEMINI_API_KEY)

# ─── Pydantic Schema (mirrors backend ResumeSchema.ts) ────────────────────────

class PersonalInfo(BaseModel):
    fullName: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedIn: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    summary: str

class WorkExperience(BaseModel):
    company: str
    role: str
    startDate: str
    endDate: Optional[str] = None
    location: Optional[str] = None
    bullets: List[str]

class Education(BaseModel):
    institution: str
    degree: str
    field: str
    startDate: str
    endDate: Optional[str] = None
    gpa: Optional[float] = None
    honors: Optional[str] = None

class Project(BaseModel):
    name: str
    description: str
    techStack: List[str]
    url: Optional[str] = None
    github: Optional[str] = None
    bullets: List[str]

class SkillGroup(BaseModel):
    category: str
    items: List[str]

class ResumeData(BaseModel):
    schemaVersion: str = "1.0.0"
    personalInfo: PersonalInfo
    workExperience: List[WorkExperience]
    education: List[Education]
    projects: List[Project]
    skills: List[SkillGroup]
    certifications: List[str] = []
    languages: List[str] = []

# ─── Text Extraction ──────────────────────────────────────────────────────────

def extract_text_from_pdf(data: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(data)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

def extract_text_from_docx(data: bytes) -> str:
    doc = Document(io.BytesIO(data))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())

# ─── LLM Structuring ──────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are a resume parser. Extract structured information from the resume text and return ONLY valid JSON matching this exact schema (no markdown, no explanation):

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
- Write the summary in third person if not present in the resume.
"""

def call_gemini(raw_text: str, error_context: str = "") -> dict:
    prompt = SYSTEM_PROMPT
    if error_context:
        prompt += f"\n\nPrevious attempt had validation errors: {error_context}\nFix these issues in your output."
    prompt += f"\n\nRESUME TEXT:\n{raw_text}"

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    text = response.text.strip()

    # Strip markdown code fences if present
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    return json.loads(text)

def structure_resume(raw_text: str, max_retries: int = 2) -> tuple[ResumeData, float]:
    last_error = ""
    for attempt in range(max_retries + 1):
        try:
            raw = call_gemini(raw_text, last_error)
            parsed = ResumeData(**raw)
            confidence = 0.95 - (attempt * 0.05)
            return parsed, confidence
        except (json.JSONDecodeError, ValidationError, Exception) as e:
            last_error = str(e)
            if attempt == max_retries:
                raise HTTPException(
                    status_code=422,
                    detail={"error": "parse_failed", "details": last_error}
                )

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    # Validate file type
    allowed = {"application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
    content_type = file.content_type or ""
    if content_type not in allowed and not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=415, detail="Unsupported file type. Only PDF and DOCX are accepted.")

    contents = await file.read()

    # Validate file size
    if len(contents) > MAX_BYTES:
        raise HTTPException(status_code=413, detail=f"File exceeds {MAX_FILE_SIZE_MB}MB limit.")

    # Extract raw text
    try:
        if file.filename.endswith(".docx") or "wordprocessingml" in content_type:
            raw_text = extract_text_from_docx(contents)
        else:
            raw_text = extract_text_from_pdf(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

    if not raw_text.strip():
        raise HTTPException(status_code=422, detail={"error": "parse_failed", "details": "No text could be extracted from the file."})

    # Structure via Gemini
    parsed, confidence = structure_resume(raw_text)

    return {
        "success": True,
        "data": parsed.model_dump(),
        "confidence": confidence
    }

# ─── Portfolio Builder ────────────────────────────────────────────────────────

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")
jinja_env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

@app.post("/generate-portfolio")
async def generate_portfolio(data: ResumeData):
    try:
        with open(os.path.join(TEMPLATE_DIR, "styles.css"), "r", encoding="utf-8") as f:
            css_content = f.read()
            
        template = jinja_env.get_template("index.html")
        html_content = template.render(data=data.model_dump())
        
        return {
            "success": True,
            "files": {
                "index.html": html_content,
                "styles.css": css_content
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Portfolio generation failed: {str(e)}")

# Backward compat alias
@app.post("/extract")
async def extract_file(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        raw_text = extract_text_from_pdf(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
    return {"success": True, "text": raw_text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

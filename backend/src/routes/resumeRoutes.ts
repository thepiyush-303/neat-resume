import { Router, Request, Response } from "express";
import axios from "axios";
import FormData from "form-data";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middlewares/authMiddleware";
import { ResumeDataSchema } from "../types/ResumeSchema";
import { computeAtsScore } from "../utils/atsScore";

const router = Router();
const prisma = new PrismaClient();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith(".pdf") || file.originalname.endsWith(".docx")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are accepted."));
    }
  },
});

const PARSER_URL = process.env.PARSER_SERVICE_URL || "http://localhost:8000";

// ── POST /api/resumes/upload ─────────────────────────────────────────────────
router.post("/upload", authenticate, upload.single("file"), async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  try {
    // 1. Forward file to the Python parser service
    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const parserRes = await axios.post(`${PARSER_URL}/parse`, form, {
      headers: form.getHeaders(),
      timeout: 120_000,
    });

    if (!parserRes.data.success) {
      res.status(422).json({ error: "Parser service failed.", details: parserRes.data });
      return;
    }

    // 2. Validate against our canonical schema
    const parsed = ResumeDataSchema.parse(parserRes.data.data);

    // 3. Compute ATS score
    const atsScore = computeAtsScore(parsed);

    // 4. Derive a title from the resume
    const title = parsed.personalInfo.fullName
      ? `${parsed.personalInfo.fullName}'s Resume`
      : req.file.originalname.replace(/\.(pdf|docx)$/i, "");

    // 5. Save to DB
    const resume = await prisma.resume.create({
      data: {
        userId: req.user!.id,
        title,
        templateId: "minimal-clean",
        parsedData: parsed as object,
        schemaVersion: "1.0.0",
        atsScore,
        isDeleted: false,
      },
    });

    res.status(201).json({ success: true, resume });
  } catch (err: any) {
    console.error("[upload error]", err?.message || err);
    if (err.response) {
      res.status(422).json({ error: "Parser failed.", details: err.response.data });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
});

// ── GET /api/resumes ─────────────────────────────────────────────────────────
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user!.id, isDeleted: false },
      select: {
        id: true,
        title: true,
        templateId: true,
        schemaVersion: true,
        atsScore: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    res.json({ resumes });
  } catch (err) {
    console.error("[list resumes error]", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ── GET /api/resumes/:id ─────────────────────────────────────────────────────
router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  try {
    const resume = await prisma.resume.findFirst({
      where: { id, userId: req.user!.id, isDeleted: false },
    });
    if (!resume) {
      res.status(404).json({ error: "Resume not found." });
      return;
    }
    res.json({ resume });
  } catch (err) {
    console.error("[get resume error]", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ── PATCH /api/resumes/:id ───────────────────────────────────────────────────
router.patch("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  try {
    const existing = await prisma.resume.findFirst({
      where: { id, userId: req.user!.id, isDeleted: false },
    });
    if (!existing) {
      res.status(404).json({ error: "Resume not found." });
      return;
    }

    const { parsedData, templateId, title } = req.body;

    let parsedJson: object | undefined;
    let atsScore: number | undefined;
    if (parsedData) {
      const validated = ResumeDataSchema.parse(parsedData);
      parsedJson = validated as object;
      atsScore = computeAtsScore(validated);
    }

    const updated = await prisma.resume.update({
      where: { id },
      data: {
        ...(title ? { title: title as string } : {}),
        ...(templateId ? { templateId: templateId as string } : {}),
        ...(parsedJson !== undefined ? { parsedData: parsedJson, atsScore } : {}),
      },
    });

    res.json({ success: true, resume: updated });
  } catch (err: any) {
    console.error("[update resume error]", err);
    if (err.name === "ZodError") {
      res.status(400).json({ error: "Invalid resume data.", details: err.errors });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
});

// ── DELETE /api/resumes/:id ──────────────────────────────────────────────────
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  try {
    const existing = await prisma.resume.findFirst({
      where: { id, userId: req.user!.id, isDeleted: false },
    });
    if (!existing) {
      res.status(404).json({ error: "Resume not found." });
      return;
    }
    await prisma.resume.update({
      where: { id },
      data: { isDeleted: true },
    });
    res.json({ success: true });
  } catch (err) {
    console.error("[delete resume error]", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ── POST /api/resumes/:id/duplicate ─────────────────────────────────────────
router.post("/:id/duplicate", authenticate, async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  try {
    const original = await prisma.resume.findFirst({
      where: { id, userId: req.user!.id, isDeleted: false },
    });
    if (!original) {
      res.status(404).json({ error: "Resume not found." });
      return;
    }
    const copy = await prisma.resume.create({
      data: {
        userId: req.user!.id,
        title: `${original.title} (Copy)`,
        templateId: original.templateId,
        parsedData: original.parsedData as object,
        schemaVersion: original.schemaVersion,
        atsScore: original.atsScore,
        isDeleted: false,
      },
    });
    res.status(201).json({ success: true, resume: copy });
  } catch (err) {
    console.error("[duplicate resume error]", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
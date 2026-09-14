import { Router, Response } from 'express';
import multer from 'multer';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middlewares/authMiddleware';
import { ResumeDataSchema } from '../types/ResumeSchema';
import { computeAtsScore } from '../utils/atsScore';
import { extractText, structureResume } from '../services/parser.service';
import { z } from 'zod';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (
      allowed.includes(file.mimetype) ||
      file.originalname.endsWith('.pdf') ||
      file.originalname.endsWith('.docx')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are accepted.'));
    }
  },
});

// Validation schema for PATCH updates
const UpdateResumeSchema = z.object({
  parsedData: ResumeDataSchema.optional(),
  templateId: z.string().min(1).max(50).optional(),
  title: z.string().min(1).max(200).optional(),
}).refine(data => data.parsedData || data.templateId || data.title, {
  message: 'At least one field must be provided',
});

// ── POST /api/resumes/upload ─────────────────────────────────────────────────
router.post('/upload', authenticate, upload.single('file'), async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded.' });
      return;
    }

    // 1. Extract text
    const rawText = await extractText(req.file.buffer, req.file.mimetype);
    if (!rawText || !rawText.trim()) {
      res.status(422).json({ error: 'No text could be extracted from the document.' });
      return;
    }

    // 2. Structure via AI
    const parsed = await structureResume(rawText);

    // 3. Compute ATS score
    const atsScore = computeAtsScore(parsed);

    // 4. Derive a title
    const title = parsed.personalInfo.fullName
      ? `${parsed.personalInfo.fullName}'s Resume`
      : req.file.originalname.replace(/\.(pdf|docx)$/i, '');

    // 5. Save to DB
    const resume = await prisma.resume.create({
      data: {
        userId: req.user!.id,
        title,
        templateId: 'minimal-clean',
        parsedData: parsed as object,
        schemaVersion: '1.0.0',
        atsScore,
        isDeleted: false,
      },
    });

    res.status(201).json({ success: true, resume });
  } catch (err: any) {
    // If it's a parsing error, return 422
    if (err.message?.includes('parsing failed')) {
      res.status(422).json({ error: 'Resume parsing failed', details: err.message });
      return;
    }
    next(err);
  }
});

// ── GET /api/resumes ─────────────────────────────────────────────────────────
router.get('/', authenticate, async (req: AuthRequest, res: Response, next) => {
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
        portfolioUrl: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ resumes });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/resumes/:id ─────────────────────────────────────────────────────
router.get('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: String(req.params.id), userId: req.user!.id, isDeleted: false },
    });
    if (!resume) {
      res.status(404).json({ error: 'Resume not found.' });
      return;
    }
    res.json({ resume });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/resumes/:id ───────────────────────────────────────────────────
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const existing = await prisma.resume.findFirst({
      where: { id: String(req.params.id), userId: req.user!.id, isDeleted: false },
    });
    if (!existing) {
      res.status(404).json({ error: 'Resume not found.' });
      return;
    }

    // Validate the update payload
    const { parsedData, templateId, title } = UpdateResumeSchema.parse(req.body);

    let parsedJson: object | undefined;
    let atsScore: number | undefined;
    if (parsedData) {
      parsedJson = parsedData as object;
      atsScore = computeAtsScore(parsedData);
    }

    const updated = await prisma.resume.update({
      where: { id: String(req.params.id) },
      data: {
        ...(title ? { title } : {}),
        ...(templateId ? { templateId } : {}),
        ...(parsedJson !== undefined ? { parsedData: parsedJson, atsScore } : {}),
      },
    });

    res.json({ success: true, resume: updated });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/resumes/:id ──────────────────────────────────────────────────
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const existing = await prisma.resume.findFirst({
      where: { id: String(req.params.id), userId: req.user!.id, isDeleted: false },
    });
    if (!existing) {
      res.status(404).json({ error: 'Resume not found.' });
      return;
    }
    await prisma.resume.update({
      where: { id: String(req.params.id) },
      data: { isDeleted: true },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/resumes/:id/duplicate ──────────────────────────────────────────
router.post('/:id/duplicate', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const original = await prisma.resume.findFirst({
      where: { id: String(req.params.id), userId: req.user!.id, isDeleted: false },
    });
    if (!original) {
      res.status(404).json({ error: 'Resume not found.' });
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
    next(err);
  }
});

export default router;
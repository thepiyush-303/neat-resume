import { Router, Response } from 'express';
import multer from 'multer';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middlewares/authMiddleware';
import { validate } from '../middleware/validate.middleware';
import { extractText, structureResume } from '../services/parser.service';
import { analyzeJobDescription, optimizeResume } from '../services/optimizer.service';
import { computeAtsScore } from '../utils/atsScore';
import type { ResumeData } from '../types/ResumeSchema';
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
    if (allowed.includes(file.mimetype) || file.originalname.endsWith('.pdf') || file.originalname.endsWith('.docx')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are accepted.'));
    }
  },
});

const OptimizeSchema = z.object({
  uploadId: z.string().min(1),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters'),
  companyName: z.string().min(1).max(100),
  roleTitle: z.string().min(1).max(100),
});

// ── POST /api/ats-optimizer/upload ───────────────────────────────────────────
// Upload and parse a PDF/DOCX exclusively for ATS optimization.
// This does NOT create a Resume record visible in the dashboard.
router.post('/upload', authenticate, upload.single('file'), async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded.' });
      return;
    }

    const rawText = await extractText(req.file.buffer, req.file.mimetype);
    if (!rawText || !rawText.trim()) {
      res.status(422).json({ error: 'No text could be extracted from the document.' });
      return;
    }

    const parsedData = await structureResume(rawText);
    const atsScore = computeAtsScore(parsedData);

    const atsUpload = await prisma.atsResumeUpload.create({
      data: {
        userId: req.user!.id,
        originalName: req.file.originalname,
        parsedData: parsedData as object,
        atsScore,
        pdfBuffer: req.file.buffer,
      },
    });

    res.status(201).json({
      success: true,
      upload: {
        id: atsUpload.id,
        originalName: atsUpload.originalName,
        atsScore: atsUpload.atsScore,
        parsedData: atsUpload.parsedData,
        createdAt: atsUpload.createdAt,
      },
    });
  } catch (err: any) {
    if (err.message?.includes('parsing failed')) {
      res.status(422).json({ error: 'Resume parsing failed', details: err.message });
      return;
    }
    next(err);
  }
});

// ── GET /api/ats-optimizer/uploads ──────────────────────────────────────────
// List resumes previously uploaded via the ATS optimizer (not dashboard resumes).
router.get('/uploads', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const uploads = await prisma.atsResumeUpload.findMany({
      where: { userId: req.user!.id },
      select: {
        id: true,
        originalName: true,
        atsScore: true,
        parsedData: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ uploads });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/ats-optimizer/optimize ────────────────────────────────────────
// Run the two-step LLM optimization and save the result.
router.post('/optimize', authenticate, validate(OptimizeSchema), async (req: AuthRequest, res: Response, next) => {
  try {
    const { uploadId, jobDescription, companyName, roleTitle } = req.body;

    const source = await prisma.atsResumeUpload.findFirst({
      where: { id: uploadId, userId: req.user!.id },
    });

    if (!source) {
      res.status(404).json({ error: 'Source upload not found.' });
      return;
    }

    const originalData = source.parsedData as ResumeData;

    // Step 1: Analyze JD
    const jdDictionary = await analyzeJobDescription(jobDescription);

    // Step 2: Rewrite resume
    const optimizedData = await optimizeResume(originalData, jdDictionary);
    const newAtsScore = computeAtsScore(optimizedData);

    const optimized = await prisma.atsOptimizedResume.create({
      data: {
        userId: req.user!.id,
        sourceId: source.id,
        companyName,
        roleTitle,
        parsedData: optimizedData as object,
        atsScore: newAtsScore,
        pdfBuffer: source.pdfBuffer, // original PDF as baseline; frontend re-renders
        jdDictionary: jdDictionary as object,
      },
    });

    res.status(201).json({
      success: true,
      result: {
        id: optimized.id,
        companyName: optimized.companyName,
        roleTitle: optimized.roleTitle,
        atsScore: optimized.atsScore,
        parsedData: optimized.parsedData,
        jdDictionary: optimized.jdDictionary,
        createdAt: optimized.createdAt,
      },
      originalAtsScore: source.atsScore,
    });
  } catch (err: any) {
    if (err.message?.includes('optimization failed') || err.message?.includes('analysis failed')) {
      res.status(422).json({ error: 'Optimization failed', details: err.message });
      return;
    }
    next(err);
  }
});

export default router;

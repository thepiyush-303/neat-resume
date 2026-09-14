import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middlewares/authMiddleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// Validation schema for updating the profile
const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  photoBase64: z.string().nullable().optional(),
  jobTitle: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  linkedinUrl: z.string().url().nullable().optional().or(z.literal('')),
  portfolioUrl: z.string().url().nullable().optional().or(z.literal('')),
  twitterUrl: z.string().url().nullable().optional().or(z.literal('')),
  githubUrl: z.string().url().nullable().optional().or(z.literal('')),
});

// ── GET /api/user/profile ───────────────────────────────────────────────────
router.get('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { profile: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      name: user.name,
      email: user.email,
      githubUsername: user.githubUsername,
      profile: user.profile,
    });
  } catch (error) {
    next(error);
  }
});

// ── PUT /api/user/profile ───────────────────────────────────────────────────
router.put('/', authenticate, validate(UpdateProfileSchema), async (req: AuthRequest, res: Response, next) => {
  try {
    const { name, ...profileData } = req.body;
    const userId = req.user!.id;

    // We can use a transaction to safely update both the User (name) and the UserProfile
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update User name
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { name },
      });

      // 2. Upsert the UserProfile
      // We map empty strings to null for URLs to satisfy strict typed URL constraints.
      const urlOrNull = (val: string | null | undefined) => val === '' ? null : val;

      const profilePayload = {
        photoBase64: profileData.photoBase64,
        jobTitle: profileData.jobTitle,
        bio: profileData.bio,
        location: profileData.location,
        phone: profileData.phone,
        linkedinUrl: urlOrNull(profileData.linkedinUrl),
        portfolioUrl: urlOrNull(profileData.portfolioUrl),
        twitterUrl: urlOrNull(profileData.twitterUrl),
        githubUrl: urlOrNull(profileData.githubUrl),
      };

      const updatedProfile = await tx.userProfile.upsert({
        where: { userId },
        update: profilePayload,
        create: {
          userId,
          ...profilePayload,
        },
      });

      return { user: updatedUser, profile: updatedProfile };
    });

    res.json({
      success: true,
      name: result.user.name,
      profile: result.profile,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

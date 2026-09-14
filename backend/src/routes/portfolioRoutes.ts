import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { authenticate } from '../middlewares/authMiddleware';
import type { AuthRequest } from '../middlewares/authMiddleware';
import { GitHubDeployer } from '../services/githubDeployer';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const DeployRequestSchema = z.object({
  resumeId: z.string().min(1),
  repoName: z.string().min(1).max(100).regex(/^[a-zA-Z0-9._-]+$/, 'Repository name can only contain alphanumeric characters, hyphens, underscores, and dots'),
});

router.post('/deploy', authenticate, validate(DeployRequestSchema), async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user?.githubAccessToken) {
      res.status(403).json({ error: 'GitHub account not connected' });
      return;
    }

    const { resumeId, repoName } = req.body;
    const deployer = new GitHubDeployer(user.githubAccessToken);
    const result = await deployer.deployPortfolio(user.id, resumeId, repoName);

    res.json(result);
  } catch (err: any) {
    console.error('[Portfolio Deploy]', err.message);
    next(err);
  }
});

export default router;

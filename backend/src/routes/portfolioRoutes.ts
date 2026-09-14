import { Router } from 'express';
import { z } from 'zod';
import axios from 'axios';
import prisma from '../lib/prisma';
import { authenticate } from '../middlewares/authMiddleware';
import type { AuthRequest } from '../middlewares/authMiddleware';
import { GitHubDeployer } from '../services/githubDeployer';
import { validate } from '../middleware/validate.middleware';
import { decryptToken } from '../utils/encryption';

const router = Router();

const DeployRequestSchema = z.object({
  resumeId:   z.string().min(1),
  repoName:   z.string().min(1).max(100).regex(/^[a-zA-Z0-9._-]+$/, 'Repository name can only contain alphanumeric characters, hyphens, underscores, and dots'),
  templateId: z.string().optional(),   // forwarded so the deployer can pick the right HTML template
});

router.post('/deploy', authenticate, validate(DeployRequestSchema), async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user?.githubAccessToken) {
      res.status(403).json({ error: 'GitHub account not connected. Please connect GitHub from the Dashboard first.' });
      return;
    }

    // ── Pre-flight: verify the stored token is still valid ──────────────────
    let rawToken: string;
    try {
      rawToken = decryptToken(user.githubAccessToken);
    } catch {
      res.status(403).json({ error: 'GitHub token is corrupted. Please disconnect and reconnect your GitHub account from the Dashboard.' });
      return;
    }

    try {
      await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${rawToken}` },
      });
    } catch (tokenErr: any) {
      if (tokenErr.response?.status === 401) {
        // Token is expired or revoked — clear it so the UI shows "Connect GitHub"
        await prisma.user.update({
          where: { id: req.user!.id },
          data: { githubAccessToken: null, githubUsername: null },
        });
        res.status(403).json({
          error: 'Your GitHub authorization has expired. Please reconnect GitHub from the Dashboard and try again.',
        });
        return;
      }
      throw tokenErr; // bubble other network errors
    }

    const { resumeId, repoName, templateId } = req.body;
    const deployer = new GitHubDeployer(user.githubAccessToken);
    const result = await deployer.deployPortfolio(user.id, resumeId, repoName, templateId || 'portfolio-standard');

    res.json(result);
  } catch (err: any) {
    console.error('[Portfolio Deploy]', err.message);
    next(err);
  }
});

export default router;

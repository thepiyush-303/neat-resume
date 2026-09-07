import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import type { AuthRequest } from '../middlewares/authMiddleware';
import { PrismaClient } from '@prisma/client';
import { GitHubDeployer } from '../services/githubDeployer';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const DeployRequestSchema = z.object({
  resumeId: z.string(),
  repoName: z.string().min(1).max(100)
});

router.post('/deploy', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id }});
    if (!user?.githubAccessToken) {
      return res.status(403).json({ error: "GitHub account not connected" });
    }

    const { resumeId, repoName } = DeployRequestSchema.parse(req.body);

    const deployer = new GitHubDeployer(user.githubAccessToken);
    
    // Trigger deploy process
    const result = await deployer.deployPortfolio(user.id, resumeId, repoName);
    
    res.json(result);
  } catch (err: any) {
    console.error('[Portfolio Deploy]', err);
    res.status(500).json({ error: err.message || "Deployment failed" });
  }
});

export default router;

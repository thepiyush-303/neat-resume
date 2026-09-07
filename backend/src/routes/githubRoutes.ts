import { Router } from 'express';
import { authenticate, AuthRequest } from '../middlewares/authMiddleware';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { encryptToken } from '../utils/encryption';

const router = Router();
const prisma = new PrismaClient();

// In production this should come from env.
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.get('/auth', authenticate, (req: AuthRequest, res) => {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  if (!GITHUB_CLIENT_ID) {
    return res.status(400).json({ error: "GitHub integration is not set up. Please add GITHUB_CLIENT_ID to the backend .env" });
  }

  // Pass userId via state or direct query in redirect_uri (state is safer for CSRF normally)
  // For simplicity, passing via state payload to recover it in callback
  const state = req.user!.id;
  
  const baseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const redirectUri = encodeURIComponent(`${baseUrl}/api/github/callback`);
  
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo,user&state=${state}`;
  res.json({ url });
});

router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  const userId = state as string;

  if (!code || !userId) {
    return res.status(400).send('Missing authorization code or user state');
  }

  try {
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code as string,
    }, {
      headers: { Accept: 'application/json' }
    });

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      console.error(tokenResponse.data);
      return res.status(400).send('Failed to fetch GitHub access token');
    }

    // Get GitHub User Info
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const githubUsername = userRes.data.login;
    const encryptedToken = encryptToken(accessToken);

    await prisma.user.update({
      where: { id: userId },
      data: {
        githubAccessToken: encryptedToken,
        githubUsername,
        githubConnectedAt: new Date(),
      }
    });

    res.redirect(`${FRONTEND_URL}/dashboard?github=success`);

  } catch (error: any) {
    console.error('GitHub Auth Error', error.response?.data || error.message);
    res.redirect(`${FRONTEND_URL}/dashboard?github=error`);
  }
});

router.get('/status', authenticate, async (req: AuthRequest, res) => {
  const dbUser = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!dbUser) return res.status(404).json({ error: "User not found" });

  res.json({
    connected: !!dbUser.githubAccessToken,
    username: dbUser.githubUsername || null,
    connectedAt: dbUser.githubConnectedAt || null
  });
});

export default router;

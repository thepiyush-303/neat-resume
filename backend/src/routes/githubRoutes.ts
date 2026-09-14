import { Router } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import prisma from '../lib/prisma';
import { config } from '../utils/env';
import { authenticate, AuthRequest } from '../middlewares/authMiddleware';
import { encryptToken } from '../utils/encryption';

const router = Router();

// ── GET /api/github/auth ─────────────────────────────────────────────────────
// Initiate GitHub OAuth flow with a CSRF-safe state token
router.get('/auth', authenticate, async (req: AuthRequest, res) => {
  if (!config.githubClientId) {
    res.status(400).json({ error: 'GitHub integration is not configured. Add GITHUB_CLIENT_ID to .env' });
    return;
  }

  // Generate a cryptographic state token for CSRF protection
  const stateToken = crypto.randomBytes(32).toString('hex');

  // Store the state token in the user's session record
  await prisma.session.create({
    data: {
      id: stateToken,
      userId: req.user!.id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
    },
  });

  const baseUrl = config.isProduction
    ? (process.env.VITE_API_BASE_URL || `${config.frontendUrl.replace(/\/$/, '')}`)
    : `http://localhost:${config.port}`;
  const redirectUri = encodeURIComponent(`${baseUrl}/api/github/callback`);

  const url = `https://github.com/login/oauth/authorize?client_id=${config.githubClientId}&redirect_uri=${redirectUri}&scope=repo,user&state=${stateToken}`;
  res.json({ url });
});

// ── GET /api/github/callback ─────────────────────────────────────────────────
// Handle GitHub OAuth callback with CSRF state verification
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    res.status(400).send('Missing authorization code or state');
    return;
  }

  try {
    // Verify the state token against DB (CSRF protection)
    const session = await prisma.session.findUnique({
      where: { id: state as string },
    });

    if (!session || session.expiresAt < new Date()) {
      res.status(400).send('Invalid or expired state token');
      return;
    }

    const userId = session.userId;

    // Clean up the state token
    await prisma.session.delete({ where: { id: state as string } });

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: config.githubClientId,
        client_secret: config.githubClientSecret,
        code: code as string,
      },
      { headers: { Accept: 'application/json' } },
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      console.error('[GitHub OAuth] Token exchange failed:', tokenResponse.data);
      res.redirect(`${config.frontendUrl}/dashboard?github=error`);
      return;
    }

    // Get GitHub user info
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubUsername = userRes.data.login;
    const encryptedToken = encryptToken(accessToken);

    await prisma.user.update({
      where: { id: userId },
      data: {
        githubAccessToken: encryptedToken,
        githubUsername,
        githubConnectedAt: new Date(),
      },
    });

    res.redirect(`${config.frontendUrl}/dashboard?github=success`);
  } catch (error: any) {
    console.error('[GitHub OAuth Error]', error.response?.data || error.message);
    res.redirect(`${config.frontendUrl}/dashboard?github=error`);
  }
});

// ── GET /api/github/status ───────────────────────────────────────────────────
router.get('/status', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { githubAccessToken: true, githubUsername: true, githubConnectedAt: true },
    });
    if (!dbUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      connected: !!dbUser.githubAccessToken,
      username: dbUser.githubUsername || null,
      connectedAt: dbUser.githubConnectedAt || null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

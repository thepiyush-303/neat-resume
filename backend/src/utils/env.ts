import 'dotenv/config';

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`❌ Missing required environment variable: ${key}. See .env.example for setup.`);
  }
  return val;
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtRefreshSecret: requireEnv('JWT_REFRESH_SECRET'),
  geminiApiKey: requireEnv('GEMINI_API_KEY'),
  githubClientId: process.env.GITHUB_CLIENT_ID || '',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  githubEncryptionKey: process.env.GITHUB_ENCRYPTION_KEY || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim()),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

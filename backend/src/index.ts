import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from './utils/env';
import authRoutes from './routes/authRoutes';
import resumeRouter from './routes/resumeRoutes';
import githubRoutes from './routes/githubRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import optimizerRoutes from './routes/optimizerRoutes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: config.allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRouter);
app.use('/api/github', githubRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/ats-optimizer', optimizerRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler (must be registered last)
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`✅ Server running on port ${config.port} (${config.nodeEnv})`);
});
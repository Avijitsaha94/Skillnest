import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { clerkMiddleware } from '@clerk/express';
import { env } from './config/env';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

import courseRoutes from './routes/courses';
import userRoutes from './routes/users';
import reviewRoutes from './routes/reviews';
import aiRoutes from './routes/ai';
import dashboardRoutes from './routes/dashboard';
import blogRoutes from './routes/blogs';
import webhookRoutes from './routes/webhook';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Webhook needs raw body
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

// JSON body for rest
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Clerk middleware globally — makes auth available on all routes
app.use(clerkMiddleware());

// Rate limiter
app.use('/api', generalLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: env.NODE_ENV });
});

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/blogs', blogRoutes);

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
import rateLimit from 'express-rate-limit';

// General API — 100 requests per minute
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});

// AI endpoints — stricter: 10 per minute per user/IP
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'AI rate limit reached. Please wait a moment.' },
  keyGenerator: (req) => {
    // Use clerk userId if available, fallback to IP
    const authReq = req as { auth?: { userId?: string } };
    return authReq.auth?.userId ?? req.ip ?? 'unknown';
  },
});

// Auth endpoints — prevent brute force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many auth attempts. Try again in 15 minutes.' },
});

import { rateLimit } from 'express-rate-limit';

/**
 * Middleware to restrict client request frequency and protect Gemini API quota.
 */
export const extractRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes by default
  limit: parseInt(process.env.RATE_LIMIT_MAX || '20', 10), // Max requests per IP per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please wait before uploading another dental form.'
  },
  statusCode: 429
});

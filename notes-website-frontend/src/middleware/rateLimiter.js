import rateLimit from 'express-rate-limit';

/**
 * General rate limiter - Applies to all API routes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter - For sensitive routes like auth
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per hour
  message: {
    message: 'Too many attempts. Please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * File upload rate limiter - For upload routes
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 uploads per hour
  message: {
    message: 'Too many uploads. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Download rate limiter - For download routes
 */
export const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 downloads per hour
  message: {
    message: 'Too many downloads. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
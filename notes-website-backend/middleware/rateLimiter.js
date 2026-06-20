import rateLimit from 'express-rate-limit';

/**
 * General rate limiter - Applies to all API routes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});

/**
 * Strict rate limiter - For sensitive routes like auth
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many attempts, please try again later.'
  },
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});

/**
 * File upload rate limiter - For upload routes
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many uploads, please try again later.'
  },
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});

/**
 * Download rate limiter - For download routes
 */
export const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 downloads per hour
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }, // ✅ ADD THIS
  message: {
    success: false,
    message: 'Too many downloads. Please try again later.'
  },
  keyGenerator: (req) => { // ✅ ADD THIS
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});
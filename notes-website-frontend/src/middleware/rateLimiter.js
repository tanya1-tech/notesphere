import rateLimit from 'express-rate-limit';

// ============ GENERAL RATE LIMITER ============
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  keyGenerator: (req) => {
    return req.ip || req.connection?.remoteAddress || 'unknown';
  }
});

// ============ STRICT RATE LIMITER ============
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many attempts, please try again later.'
  },
  keyGenerator: (req) => {
    return req.ip || req.connection?.remoteAddress || 'unknown';
  }
});

// ============ UPLOAD RATE LIMITER ============
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many uploads, please try again later.'
  },
  keyGenerator: (req) => {
    return req.ip || req.connection?.remoteAddress || 'unknown';
  }
});

// ============ DOWNLOAD RATE LIMITER ============
export const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many downloads. Please try again later.'
  },
  keyGenerator: (req) => {
    return req.ip || req.connection?.remoteAddress || 'unknown';
  }
});
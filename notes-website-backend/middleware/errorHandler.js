/**
 * Global error handler middleware
 * Usage: Add this as the last middleware in server.js
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File size too large. Maximum size is 30MB.' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: 'Only one file can be uploaded at a time' 
      });
    }
    return res.status(400).json({ message: err.message });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate entry error',
      field: Object.keys(err.keyPattern)[0]
    });
  }
  
  // Default error response
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};

/**
 * Not found middleware - Handles 404 errors
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Async wrapper - Catches errors in async functions
 * Usage: Wrap your async route handlers
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
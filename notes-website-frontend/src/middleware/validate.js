import { body, validationResult, param, query } from 'express-validator';

/**
 * Validation middleware - Checks validation results
 * Usage: Use after validation rules
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * User registration validation rules
 */
export const validateRegister = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain at least one letter and one number'),
  
  body('mobile')
    .optional()
    .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit mobile number'),
  
  body('address').optional().isString(),
  body('city').optional().isString(),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender'),
  
  validate
];

/**
 * User login validation rules
 */
export const validateLogin = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  validate
];

/**
 * Note upload validation rules
 */
export const validateNoteUpload = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  
  body('subject')
    .notEmpty().withMessage('Subject is required'),
  
  body('semester')
    .isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1-8'),
  
  body('branch')
    .notEmpty().withMessage('Branch is required'),
  
  body('course')
    .notEmpty().withMessage('Course is required'),
  
  body('credits')
    .optional()
    .isInt({ min: 0, max: 10 }).withMessage('Credits must be between 0-10'),
  
  validate
];

/**
 * Note filter validation rules
 */
export const validateNoteFilters = [
  query('semester')
    .optional()
    .isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1-8'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
  
  validate
];

/**
 * ID parameter validation
 */
export const validateId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  
  validate
];
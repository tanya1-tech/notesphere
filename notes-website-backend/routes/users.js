import express from 'express';
import User from '../models/User.js';  // ✅ Add this import
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword 
} from '../controllers/userController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// ============ PUBLIC ROUTES ============
// Register - No authentication required
router.post('/register', strictLimiter, register);

// Login - No authentication required
router.post('/login', strictLimiter, login);

// ============ PROTECTED ROUTES ============
// Get user profile - Requires authentication
router.get('/profile', auth, getProfile);

// Update user profile - Requires authentication
router.put('/profile', auth, updateProfile);

// Change password - Requires authentication
router.put('/change-password', auth, changePassword);

// ============ ADMIN ROUTES ============
// Get all users - Admin only
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Get single user by ID - Admin only
router.get('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Delete user - Admin only
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

export default router;
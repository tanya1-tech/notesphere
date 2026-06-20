import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ============ REGISTER ============
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('📥 Registration attempt:', { name, email });

    // ✅ Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, email, and password are required' 
      });
    }

    // ✅ Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid email address' 
      });
    }

    // ✅ Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters' 
      });
    }

    // ✅ Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // ✅ Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    await user.save();
    console.log('✅ User created:', user._id);

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // ✅ Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors 
      });
    }
    
    // ✅ Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

// ============ LOGIN ============
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('📥 Login attempt:', { email });

    // ✅ Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }
    
    // ✅ Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // ✅ Check password
    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // ✅ Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    
    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

// ============ GET PROFILE ============
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || '',
        address: user.address || '',
        city: user.city || '',
        gender: user.gender || '',
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio || '',
        institution: user.institution || '',
        course: user.course || '',
        graduationYear: user.graduationYear || '',
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// ============ UPDATE PROFILE ============
export const updateProfile = async (req, res) => {
  try {
    const { name, mobile, address, city, gender, bio, institution, course, graduationYear } = req.body;
    
    // ✅ Build update object
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (mobile) updateData.mobile = mobile;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (gender) updateData.gender = gender;
    if (bio) updateData.bio = bio;
    if (institution) updateData.institution = institution;
    if (course) updateData.course = course;
    if (graduationYear) updateData.graduationYear = graduationYear;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || '',
        address: user.address || '',
        city: user.city || '',
        gender: user.gender || '',
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio || '',
        institution: user.institution || '',
        course: user.course || '',
        graduationYear: user.graduationYear || '',
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('❌ Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// ============ CHANGE PASSWORD ============
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password and new password are required' 
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'New password must be at least 6 characters' 
      });
    }
    
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // ✅ Verify current password
    const isMatch = await user.correctPassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }
    
    // ✅ Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};
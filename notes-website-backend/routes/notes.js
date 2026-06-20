import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Note from '../models/Note.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ============ ENSURE UPLOADS DIRECTORY EXISTS ============
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 Uploads directory created:', uploadDir);
  } catch (err) {
    console.error('❌ Failed to create uploads directory:', err);
  }
}

// ============ MULTER CONFIGURATION ============
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // ✅ Sanitize filename - remove special characters and emojis
    const cleanName = file.originalname
      .replace(/\s+/g, '_')                    // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9._-]/g, '')          // Remove all special characters
      .replace(/_{2,}/g, '_');                  // Remove multiple underscores
    
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const finalName = uniqueSuffix + '-' + cleanName;
    
    console.log('📄 Original:', file.originalname);
    console.log('📄 Sanitized:', finalName);
    
    cb(null, finalName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: fileFilter
});

// ============ UPLOAD NOTE ============
router.post('/upload', auth, uploadLimiter, (req, res) => {
  upload.single('file')(req, res, async function(err) {
    try {
      console.log('📤 Upload request received');
      
      if (err instanceof multer.MulterError) {
        if (err.code === 'FILE_TOO_LARGE') {
          return res.status(400).json({ 
            success: false,
            message: 'File size exceeds 30MB limit' 
          });
        }
        return res.status(400).json({ 
          success: false,
          message: err.message 
        });
      }
      
      if (err) {
        return res.status(400).json({ 
          success: false,
          message: err.message 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'Please upload a PDF file' 
        });
      }

      console.log('📄 File uploaded:', req.file.filename);

      let tags = [];
      if (req.body.tags) {
        tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }

      const { title, description, subject, semester, branch, course } = req.body;
      
      if (!title || !description || !subject || !semester || !branch || !course) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
        return res.status(400).json({ 
          success: false,
          message: 'Missing required fields' 
        });
      }

      const note = new Note({
        title: title.trim(),
        description: description.trim(),
        subject: subject.trim(),
        semester: parseInt(semester),
        branch: branch.trim(),
        course: course.trim(),
        courseCode: req.body.courseCode || '',
        credits: parseInt(req.body.credits) || 3,
        file: req.file.filename,
        fileSize: req.file.size,
        tags: tags,
        uploadedBy: req.user.id,
        status: 'pending'
      });

      await note.save();
      console.log('✅ Note created:', note._id);

      res.status(201).json({
        success: true,
        message: 'Note uploaded successfully! Waiting for approval.',
        note: {
          id: note._id,
          title: note.title,
          status: note.status,
          file: note.file
        }
      });

    } catch (error) {
      console.error('❌ Upload error:', error);
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      res.status(500).json({ 
        success: false,
        message: 'Internal server error',
        error: error.message 
      });
    }
  });
});

// ============ GET USER'S NOTES ============
router.get('/user/my-notes', auth, async (req, res) => {
  try {
    console.log('📥 Fetching notes for user:', req.user.id);
    
    const notes = await Note.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name email');
    
    console.log('✅ Found', notes.length, 'notes for user');
    
    res.json({
      success: true,
      count: notes.length,
      notes: notes
    });
  } catch (error) {
    console.error('❌ Get user notes error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to load user notes',
      error: error.message 
    });
  }
});

// ============ GET ALL NOTES (PUBLIC) ============
router.get('/', async (req, res) => {
  try {
    const { semester, branch, subject, course } = req.query;
    const filter = { status: 'approved' };
    
    if (semester) filter.semester = parseInt(semester);
    if (branch) filter.branch = branch;
    if (subject) filter.subject = subject;
    if (course) filter.course = course;
    
    const notes = await Note.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error('❌ Get notes error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// ============ ADMIN ROUTES ============
// ⚠️ IMPORTANT: These MUST be BEFORE the /:id route

// Get all pending notes (admin only)
router.get('/pending', auth, adminAuth, async (req, res) => {
  try {
    console.log('📥 Fetching pending notes...');
    
    const notes = await Note.find({ status: 'pending' })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${notes.length} pending notes`);
    
    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error('❌ Get pending notes error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to load pending notes',
      error: error.message 
    });
  }
});

// Approve a note (admin only)
router.put('/:id/approve', auth, adminAuth, async (req, res) => {
  try {
    console.log('📤 Approving note:', req.params.id);
    
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      { new: true }
    );
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    console.log('✅ Note approved:', note._id);
    
    res.json({
      success: true,
      message: 'Note approved successfully',
      note
    });
  } catch (error) {
    console.error('❌ Approve note error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to approve note',
      error: error.message 
    });
  }
});

// Reject a note (admin only)
router.put('/:id/reject', auth, adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    console.log('📤 Rejecting note:', req.params.id);
    
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectedBy: req.user.id,
        rejectedAt: new Date(),
        rejectionReason: reason || 'No reason provided'
      },
      { new: true }
    );
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    console.log('❌ Note rejected:', note._id);
    
    res.json({
      success: true,
      message: 'Note rejected',
      note
    });
  } catch (error) {
    console.error('❌ Reject note error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to reject note',
      error: error.message 
    });
  }
});

// ============ GET SINGLE NOTE ============
// ⚠️ This MUST be LAST - it catches any /:id requests
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'name email');
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    note.views += 1;
    await note.save({ validateBeforeSave: false });
    
    res.json({
      success: true,
      note
    });
  } catch (error) {
    console.error('❌ Get note error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

export default router;
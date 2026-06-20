import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Note from '../models/Note.js';
import { auth } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ============ ENSURE UPLOADS DIRECTORY EXISTS ============
const uploadDir = path.join(__dirname, '../uploads');

// Create uploads directory if it doesn't exist
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
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix + '-' + originalName);
  }
});

// File filter - only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Create multer instance with 30MB limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 30 * 1024 * 1024 // 30MB
  },
  fileFilter: fileFilter
});

// ============ UPLOAD NOTE ============
router.post('/upload', auth, uploadLimiter, (req, res) => {
  // Use multer with error handling
  upload.single('file')(req, res, async function(err) {
    try {
      console.log('📤 Upload request received');
      console.log('📝 Body:', req.body);
      console.log('👤 User:', req.user?.id);

      // ✅ Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'FILE_TOO_LARGE') {
          return res.status(400).json({ 
            success: false,
            message: 'File size exceeds 30MB limit' 
          });
        }
        console.error('❌ Multer error:', err);
        return res.status(400).json({ 
          success: false,
          message: err.message 
        });
      }
      
      if (err) {
        console.error('❌ Upload error:', err);
        return res.status(400).json({ 
          success: false,
          message: err.message 
        });
      }

      // ✅ Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'Please upload a PDF file' 
        });
      }

      console.log('📄 File uploaded:', req.file.filename);
      console.log('📏 File size:', req.file.size);

      // ✅ Parse tags from string to array
      let tags = [];
      if (req.body.tags) {
        tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }

      // ✅ Validate required fields
      const { title, description, subject, semester, branch, course } = req.body;
      
      if (!title || !description || !subject || !semester || !branch || !course) {
        // Delete uploaded file if validation fails
        try {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Deleted uploaded file due to validation error');
        } catch (unlinkErr) {
          console.error('❌ Error deleting file:', unlinkErr);
        }
        
        return res.status(400).json({ 
          success: false,
          message: 'Missing required fields: title, description, subject, semester, branch, course are required' 
        });
      }

      // ✅ Create note
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
      
      // ✅ Delete uploaded file if there was an error
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Deleted uploaded file due to error');
        } catch (unlinkErr) {
          console.error('❌ Error deleting file:', unlinkErr);
        }
      }

      // ✅ Handle validation errors
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
        message: 'Internal server error',
        error: error.message 
      });
    }
  });
});

// ============ GET USER'S NOTES ============
router.get('/user/my-notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error('❌ Get user notes error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
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

// ============ GET SINGLE NOTE ============
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
    
    // Increment views
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
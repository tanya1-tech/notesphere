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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix + '-' + originalName);
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
import express from 'express';
import multer from 'multer';
import path from 'path';
import Note from '../models/Note.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Upload note
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const { title, description, subject, semester, branch, course, courseCode, credits, tags } = req.body;

    // Create note with proper field handling
    const noteData = {
      title,
      description,
      subject,
      semester: parseInt(semester),
      branch,
      course,
      courseCode: courseCode || '', // Handle optional field
      credits: credits ? parseInt(credits) : 3,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      file: req.file.filename,
      fileSize: req.file.size,
      uploadedBy: decoded.id
    };

    const note = await Note.create(noteData);

    // Populate user info
    await note.populate('uploadedBy', 'name email');

    res.status(201).json({
      message: 'Note uploaded successfully',
      note
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Better error handling
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Get all notes - SHOW ALL NOTES (INCLUDING PENDING)
router.get('/', async (req, res) => {
  try {
    const { semester, branch, subject, course, page = 1, limit = 100 } = req.query;
    
    console.log('GET /api/notes called with query:', req.query);
    
    // TEMPORARY: Show all notes regardless of status
    let query = {}; // Changed from { status: 'approved' }
    
    if (semester) query.semester = parseInt(semester);
    if (branch) query.branch = new RegExp(branch, 'i');
    if (subject) query.subject = new RegExp(subject, 'i');
    if (course) query.course = new RegExp(course, 'i');

    console.log('MongoDB query:', query);

    const notes = await Note.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Note.countDocuments(query);

    console.log(`Found ${notes.length} notes out of ${total} total`);

    res.json({
      notes,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Debug route - Get all notes with full details
router.get('/debug/all', async (req, res) => {
  try {
    const notes = await Note.find({})
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('Total notes in database:', notes.length);
    notes.forEach(note => {
      console.log('Note:', {
        id: note._id,
        title: note.title,
        subject: note.subject,
        file: note.file,
        status: note.status,
        uploadedBy: note.uploadedBy?.name
      });
    });
    
    res.json({
      total: notes.length,
      notes: notes
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's uploaded notes
router.get('/user/my-notes', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const notes = await Note.find({ uploadedBy: decoded.id })
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error('Get user notes error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('uploadedBy', 'name email');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Increment views
    note.views += 1;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Download note
router.get('/:id/download', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Increment downloads
    note.downloads += 1;
    await note.save();

    const filePath = path.join(process.cwd(), 'uploads', note.file);
    
    res.download(filePath, `${note.title}.pdf`, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
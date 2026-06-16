import express from 'express';
import multer from 'multer';
import path from 'path';
import Note from '../models/Note.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// =====================
// Multer config
// =====================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});


// =====================
// Upload note
// =====================
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || '7a404e4e1985f17de59472c9206f3092'
    );

    const {
      title,
      description,
      subject,
      semester,
      branch,
      course,
      courseCode,
      credits,
      tags
    } = req.body;

    const noteData = {
      title,
      description,
      subject,
      semester: parseInt(semester),
      branch,
      course,
      courseCode: courseCode || '',
      credits: credits ? parseInt(credits) : 3,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      file: req.file?.filename,
      fileSize: req.file?.size,
      uploadedBy: decoded.id
    };

    const note = await Note.create(noteData);
    await note.populate('uploadedBy', 'name email');

    res.status(201).json({
      message: 'Note uploaded successfully',
      note
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
});


// =====================
// GET ALL NOTES (FIXED)
// =====================
router.get('/', async (req, res) => {
  try {
    const {
      semester,
      branch,
      subject,
      course,
      page = 1,
      limit = 100
    } = req.query;

    console.log('GET /api/notes called');

    let query = {};

    if (semester) query.semester = parseInt(semester);
    if (branch) query.branch = new RegExp(branch, 'i');
    if (subject) query.subject = new RegExp(subject, 'i');
    if (course) query.course = new RegExp(course, 'i');

    // ✅ FIX: convert strings to numbers safely
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 100;

    const notes = await Note.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });

  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: error.message });
  }
});


// =====================
// DEBUG ROUTE
// =====================
router.get('/debug/all', async (req, res) => {
  try {
    const notes = await Note.find({})
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      total: notes.length,
      notes
    });

  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: error.message });
  }
});


// =====================
// USER NOTES
// =====================
router.get('/user/my-notes', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || '7a404e4e1985f17de59472c9206f3092'
    );

    const notes = await Note.find({ uploadedBy: decoded.id })
      .sort({ createdAt: -1 });

    res.json(notes);

  } catch (error) {
    console.error('Get user notes error:', error);
    res.status(500).json({ message: error.message });
  }
});


// =====================
// GET NOTE BY ID
// =====================
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'name email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.views += 1;
    await note.save();

    res.json(note);

  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: error.message });
  }
});


// =====================
// DOWNLOAD NOTE
// =====================
router.get('/:id/download', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

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
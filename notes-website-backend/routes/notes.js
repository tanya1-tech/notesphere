import express from 'express';
import path from 'path';
import fs from 'fs';
import Note from '../models/Note.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { validateNoteUpload, validateNoteFilters, validateId } from '../middleware/validate.js';
import { uploadLimiter, downloadLimiter } from '../middleware/rateLimiter.js';
import { upload, handleUploadError } from '../middleware/upload.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Upload note (protected, with rate limiting and validation)
router.post(
  '/upload', 
  auth, 
  uploadLimiter, 
  upload.single('file'), 
  handleUploadError,
  validateNoteUpload, 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a PDF file' });
      }
      
      const { title, description, subject, semester, branch, course, courseCode, credits, tags } = req.body;

      // Create note
      const noteData = {
        title,
        description,
        subject,
        semester: parseInt(semester),
        branch,
        course,
        courseCode: courseCode || '',
        credits: credits ? parseInt(credits) : 3,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        file: req.file.filename,
        fileSize: req.file.size,
        uploadedBy: req.user.id
      };

      const note = await Note.create(noteData);
      await note.populate('uploadedBy', 'name email');

      // Construct full URL for the file
      const baseUrl = process.env.RAILWAY_STATIC_URL 
        ? `https://${process.env.RAILWAY_STATIC_URL}`
        : `${req.protocol}://${req.get('host')}`;

      res.status(201).json({
        message: 'Note uploaded successfully',
        note: {
          ...note.toObject(),
          fileUrl: `${baseUrl}/uploads/${note.file}`
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: errors.join(', ') });
      }
      
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all notes with filters
router.get('/', validateNoteFilters, async (req, res) => {
  try {
    const { semester, branch, subject, course, page = 1, limit = 20, search } = req.query;
    
    let query = { status: 'approved' };
    
    if (semester) query.semester = parseInt(semester);
    if (branch) query.branch = new RegExp(branch, 'i');
    if (course) query.course = new RegExp(course, 'i');
    if (subject) query.subject = new RegExp(subject, 'i');
    
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { subject: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [notes, total] = await Promise.all([
      Note.find(query)
        .populate('uploadedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Note.countDocuments(query)
    ]);

    // Add file URLs
    const baseUrl = process.env.RAILWAY_STATIC_URL 
      ? `https://${process.env.RAILWAY_STATIC_URL}`
      : `${req.protocol}://${req.get('host')}`;

    const notesWithUrls = notes.map(note => ({
      ...note.toObject(),
      fileUrl: `${baseUrl}/uploads/${note.file}`
    }));

    res.json({
      notes: notesWithUrls,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's uploaded notes (protected)
router.get('/user/my-notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 });

    const baseUrl = process.env.RAILWAY_STATIC_URL 
      ? `https://${process.env.RAILWAY_STATIC_URL}`
      : `${req.protocol}://${req.get('host')}`;

    const notesWithUrls = notes.map(note => ({
      ...note.toObject(),
      fileUrl: `${baseUrl}/uploads/${note.file}`
    }));

    res.json(notesWithUrls);
  } catch (error) {
    console.error('Get user notes error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get note by ID
router.get('/:id', validateId, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'name email');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.views += 1;
    await note.save();

    const baseUrl = process.env.RAILWAY_STATIC_URL 
      ? `https://${process.env.RAILWAY_STATIC_URL}`
      : `${req.protocol}://${req.get('host')}`;

    res.json({
      ...note.toObject(),
      fileUrl: `${baseUrl}/uploads/${note.file}`
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Download note with rate limiting
router.get('/:id/download', downloadLimiter, validateId, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.downloads += 1;
    await note.save();

    const filePath = path.join(__dirname, '../uploads', note.file);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }
    
    res.download(filePath, `${note.title}.pdf`, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error downloading file' });
        }
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete note (protected - only owner)
router.delete('/:id', auth, validateId, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    if (note.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own notes' });
    }
    
    // Delete file from storage
    const filePath = path.join(__dirname, '../uploads', note.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await note.deleteOne();
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Debug route (admin only)
router.get('/debug/all', auth, adminAuth, async (req, res) => {
  try {
    const notes = await Note.find({})
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      total: notes.length,
      notes: notes
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import {
  getStats,
  getPendingNotes,
  getAllNotes,
  approveNote,
  rejectNote,
  bulkApprove,
  deleteNote
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(adminAuth);

// Dashboard stats
router.get('/stats', getStats);

// Notes management
router.get('/notes/pending', getPendingNotes);
router.get('/notes', getAllNotes);

// Note actions
router.put('/notes/:id/approve', approveNote);
router.put('/notes/:id/reject', rejectNote);
router.delete('/notes/:id', deleteNote);

// Bulk actions
router.post('/notes/bulk-approve', bulkApprove);

export default router;
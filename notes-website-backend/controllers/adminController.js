import Note from '../models/Note.js';
import User from '../models/User.js';

// Get dashboard stats
export const getStats = async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments();
    const pendingNotes = await Note.countDocuments({ status: 'pending' });
    const approvedNotes = await Note.countDocuments({ status: 'approved' });
    const totalUsers = await User.countDocuments();
    
    res.json({
      success: true,
      stats: {
        totalNotes,
        pendingNotes,
        approvedNotes,
        totalUsers
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get stats', 
      error: error.message 
    });
  }
};

// Get all pending notes
export const getPendingNotes = async (req, res) => {
  try {
    const notes = await Note.find({ status: 'pending' })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error('Error getting pending notes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get pending notes', 
      error: error.message 
    });
  }
};

// Get all notes with filters
export const getAllNotes = async (req, res) => {
  try {
    const { status, subject, branch, semester } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    if (branch) filter.branch = branch;
    if (semester) filter.semester = semester;
    
    const notes = await Note.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error('Error getting notes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get notes', 
      error: error.message 
    });
  }
};

// Approve a note
export const approveNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    
    const note = await Note.findByIdAndUpdate(
      noteId,
      {
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('uploadedBy', 'name email');
    
    if (!note) {
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Note approved successfully',
      note
    });
  } catch (error) {
    console.error('Error approving note:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to approve note', 
      error: error.message 
    });
  }
};

// Reject a note
export const rejectNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { reason } = req.body;
    
    const note = await Note.findByIdAndUpdate(
      noteId,
      {
        status: 'rejected',
        rejectedBy: req.user.id,
        rejectedAt: new Date(),
        rejectionReason: reason || 'No reason provided'
      },
      { new: true }
    ).populate('uploadedBy', 'name email');
    
    if (!note) {
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Note rejected',
      note
    });
  } catch (error) {
    console.error('Error rejecting note:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reject note', 
      error: error.message 
    });
  }
};

// Bulk approve notes
export const bulkApprove = async (req, res) => {
  try {
    const { noteIds } = req.body;
    
    if (!noteIds || !noteIds.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'No note IDs provided' 
      });
    }
    
    const result = await Note.updateMany(
      { _id: { $in: noteIds } },
      {
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: new Date()
      }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} notes approved successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error in bulk approve:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to approve notes', 
      error: error.message 
    });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete note', 
      error: error.message 
    });
  }
};
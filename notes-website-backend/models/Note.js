import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  branch: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    default: '' // Make it optional with default value
  },
  credits: {
    type: Number,
    default: 3
  },
  tags: [{
    type: String
  }],
  file: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better search performance
noteSchema.index({ subject: 'text', title: 'text', description: 'text' });
noteSchema.index({ semester: 1, branch: 1, course: 1 });

export default mongoose.model('Note', noteSchema);
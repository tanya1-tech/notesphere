import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [8, 'Semester cannot exceed 8']
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    trim: true
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  },
  courseCode: {
    type: String,
    trim: true,
    default: null
  },
  credits: {
    type: Number,
    default: 3,
    min: [0, 'Credits cannot be negative'],
    max: [10, 'Credits cannot exceed 10']
  },
  tags: [{
    type: String,
    trim: true
  }],
  file: {
    type: String,
    required: [true, 'File is required']
  },
  fileSize: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'draft'],
    default: 'pending'
  },
  downloads: {
    type: Number,
    default: 0,
    min: 0
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better search performance
noteSchema.index({ subject: 'text', title: 'text', description: 'text', tags: 'text' });
noteSchema.index({ semester: 1, branch: 1, course: 1 });
noteSchema.index({ status: 1, createdAt: -1 });
noteSchema.index({ uploadedBy: 1, createdAt: -1 });

// Virtual for file path
noteSchema.virtual('filePath').get(function() {
  return `/uploads/${this.file}`;
});

// Method to get average rating
noteSchema.methods.getAverageRating = function() {
  if (this.reviews.length === 0) return 0;
  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / this.reviews.length) * 10) / 10;
};

export default mongoose.model('Note', noteSchema);
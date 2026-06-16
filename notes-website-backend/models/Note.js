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
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
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

// Method to add a review
noteSchema.methods.addReview = async function(userId, rating, comment) {
  // Check if user already reviewed
  const existingReview = this.reviews.find(
    review => review.user.toString() === userId.toString()
  );
  
  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.comment = comment;
    existingReview.createdAt = Date.now();
  } else {
    // Add new review
    this.reviews.push({
      user: userId,
      rating,
      comment
    });
  }
  
  // Update average rating
  this.rating = this.getAverageRating();
  await this.save();
  
  return this;
};

// Method to increment downloads
noteSchema.methods.incrementDownloads = async function() {
  this.downloads += 1;
  await this.save();
  return this.downloads;
};

// Method to increment views
noteSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
  return this.views;
};

// Static method to get popular notes
noteSchema.statics.getPopularNotes = async function(limit = 10) {
  return this.find({ status: 'approved' })
    .sort({ downloads: -1, views: -1 })
    .limit(limit)
    .populate('uploadedBy', 'name email');
};

// Static method to get recent notes
noteSchema.statics.getRecentNotes = async function(limit = 10) {
  return this.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('uploadedBy', 'name email');
};

// Static method to search notes
noteSchema.statics.searchNotes = async function(searchTerm, filters = {}) {
  const query = {
    status: 'approved',
    ...filters
  };
  
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .populate('uploadedBy', 'name email');
};

export default mongoose.model('Note', noteSchema);
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // ===== REQUIRED FIELDS =====
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },

    // ===== OPTIONAL FIELDS (ALL marked required: false) =====
    mobile: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
      required: false,
      default: undefined,
      sparse: true
    },
    address: {
      type: String,
      trim: true,
      required: false,
      default: undefined
    },
    city: {
      type: String,
      trim: true,
      required: false,
      default: undefined
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      required: false,
      default: undefined
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user'
    },
    profileImage: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      required: false,
      default: undefined
    },
    institution: {
      type: String,
      trim: true,
      required: false,
      default: undefined
    },
    course: {
      type: String,
      trim: true,
      required: false,
      default: undefined
    },
    graduationYear: {
      type: Number,
      min: [1900, 'Invalid year'],
      max: [2100, 'Invalid year'],
      required: false,
      default: undefined
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ============ HASH PASSWORD ============
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ============ COMPARE PASSWORD ============
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// ============ VIRTUAL FIELDS ============
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// ============ INSTANCE METHODS ============
userSchema.methods.getStats = async function() {
  const Note = mongoose.model('Note');
  const notesCount = await Note.countDocuments({ uploadedBy: this._id });
  const totalDownloads = await Note.aggregate([
    { $match: { uploadedBy: this._id } },
    { $group: { _id: null, total: { $sum: '$downloads' } } }
  ]);
  
  return {
    notesUploaded: notesCount,
    totalDownloads: totalDownloads.length > 0 ? totalDownloads[0].total : 0
  };
};

// ============ STATIC METHODS ============
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

export default mongoose.model('User', userSchema);
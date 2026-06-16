import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },

    mobile: {
      type: String
    },

    address: {
      type: String
    },

    city: {
      type: String
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { timestamps: true }
);

//
// 🔐 Hash password BEFORE saving
//
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//
// 🔑 Compare password method (used in login)
//
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export default mongoose.model('User', userSchema);
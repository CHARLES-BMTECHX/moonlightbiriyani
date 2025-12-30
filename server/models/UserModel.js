// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator'); // npm install validator (for email/phone validation)

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],

    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      unique: true,
      trim: true,
      validate: [
        validator.isMobilePhone,
        'Please provide a valid phone number',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    addresses: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // Add avatar field if needed (e.g., for profile pic)
    avatar: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─────────────── Indexes (Explicit for Performance) ───────────────
// Compound index for auth lookups (email + phone)
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ username: 1 }); // Unique is implicit, but explicit helps
userSchema.index({ role: 1, isActive: 1 }); // For admin queries

// ─────────────── Password Hashing Middleware ───────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─────────────── Password Comparison Method ───────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─────────────── Generate/Verify JWT Token (Add if using auth) ───────────────
userSchema.methods.getSignedJwtToken = function () {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// ─────────────── Check if Password Expired (for reset) ───────────────
userSchema.methods.isPasswordExpired = function () {
  return Date.now() > this.resetPasswordExpire;
};

// ─────────────── Virtual for Full Name (if you add first/last name later) ───────────────
userSchema.virtual('fullName').get(function () {
  return `${this.username}`; // Extend if you add first/last name
});

// ─────────────── Query Helper: Don't return inactive users ───────────────
userSchema.pre(/^find/, function (next) {
  this.find({ isActive: true });
  next();
});

module.exports = mongoose.model('User', userSchema);

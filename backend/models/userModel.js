// backend/models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['candidate', 'admin'],
      default: 'candidate',
    },
    // NEW FIELD: Status (Active, Suspended, Banned)
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Banned'],
      default: 'Active',
    },
    // Knowledge Graph Scores
    skills_profile: {
      python: { type: Number, default: 0 },
      math: { type: Number, default: 0 },
      machine_learning: { type: Number, default: 0 },
      system_design: { type: Number, default: 0 },
    },
    subscription_status: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// --- SECURITY METHODS ---

// 1. Check if entered password matches hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 2. Encrypt password before saving to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
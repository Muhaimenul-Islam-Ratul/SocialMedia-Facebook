import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    lastActiveAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  },
  { timestamps: true },
);

userSchema.index({ createdAt: -1 });

export const User = mongoose.model('User', userSchema);

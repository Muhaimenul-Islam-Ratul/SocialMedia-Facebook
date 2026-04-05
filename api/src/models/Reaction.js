import mongoose from 'mongoose';
import { reactionTypes } from '../lib/reactions.js';

const reactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetType: { type: String, enum: ['post', 'comment'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reactionType: { type: String, enum: reactionTypes, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

reactionSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });
reactionSchema.index({ targetType: 1, targetId: 1 });

export const Reaction = mongoose.model('Reaction', reactionSchema);

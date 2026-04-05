import mongoose from 'mongoose';
import { createEmptyReactionCounts } from '../lib/reactions.js';

const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['image'], default: 'image' },
    url: { type: String, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
  },
  { _id: false },
);

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    media: { type: [mediaSchema], default: [] },
    visibility: { type: String, enum: ['public'], default: 'public', index: true },
    reactionCounts: {
      type: Object,
      default: () => createEmptyReactionCounts(),
    },
    commentCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

postSchema.index({ createdAt: -1 });
postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });

export const Post = mongoose.model('Post', postSchema);

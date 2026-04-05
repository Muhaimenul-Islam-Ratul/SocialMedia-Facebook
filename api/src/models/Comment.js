import mongoose from 'mongoose';
import { createEmptyReactionCounts } from '../lib/reactions.js';

const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 3000 },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true,
    },
    reactionCounts: {
      type: Object,
      default: () => createEmptyReactionCounts(),
    },
    replyCount: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ parentCommentId: 1, createdAt: 1 });

export const Comment = mongoose.model('Comment', commentSchema);

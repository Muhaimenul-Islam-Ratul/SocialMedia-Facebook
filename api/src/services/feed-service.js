import mongoose from 'mongoose';
import { Comment } from '../models/Comment.js';
import { Post } from '../models/Post.js';
import { Reaction } from '../models/Reaction.js';
import { badRequest, forbidden, notFound } from '../lib/errors.js';
import { createEmptyReactionCounts, reactionTypes } from '../lib/reactions.js';
import { emitToFeed, emitToPost } from '../lib/socket.js';
import { attachViewerReactions, serializeComment, serializePost } from '../serializers/feed.js';

function ensureObjectId(id, label) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw badRequest(`Invalid ${label}`);
  }

  return new mongoose.Types.ObjectId(id);
}

export async function getFeed({ cursor, limit, userId }) {
  const query = { visibility: 'public', deletedAt: null };
  if (cursor) {
    query._id = { $lt: ensureObjectId(cursor, 'cursor') };
  }

  const posts = await Post.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .populate('authorId', 'firstName lastName avatarUrl')
    .lean();

  const hasMore = posts.length > limit;
  const slicedPosts = hasMore ? posts.slice(0, limit) : posts;
  const serialized = slicedPosts.map(serializePost);
  const items = await attachViewerReactions(serialized, 'post', userId);

  return {
    items,
    nextCursor: hasMore ? slicedPosts[slicedPosts.length - 1]._id.toString() : null,
  };
}

export async function createPost({ authorId, content, media = [] }) {
  if (!content?.trim()) {
    throw badRequest('Post content is required');
  }

  const post = await Post.create({ authorId, content, media });
  const hydrated = await Post.findById(post._id).populate('authorId', 'firstName lastName avatarUrl');
  const serialized = serializePost(hydrated);
  emitToFeed('post:created', serialized);
  return serialized;
}

export async function getPostById({ postId, userId }) {
  const post = await Post.findOne({
    _id: ensureObjectId(postId, 'postId'),
    deletedAt: null,
  }).populate('authorId', 'firstName lastName avatarUrl');

  if (!post) {
    throw notFound('Post not found');
  }

  const [item] = await attachViewerReactions([serializePost(post)], 'post', userId);
  return item;
}

export async function deletePost({ postId, userId }) {
  const post = await Post.findOne({
    _id: ensureObjectId(postId, 'postId'),
    deletedAt: null,
  });

  if (!post) {
    throw notFound('Post not found');
  }

  if (post.authorId.toString() !== userId.toString()) {
    throw forbidden('You can only delete your own post');
  }

  const deletedAt = new Date();
  post.deletedAt = deletedAt;
  await post.save();
  await Comment.updateMany({ postId: post._id, deletedAt: null }, { deletedAt });
  emitToFeed('post:deleted', { id: post._id.toString() });
}

export async function getComments({ postId, cursor, limit, userId }) {
  const query = {
    postId: ensureObjectId(postId, 'postId'),
    deletedAt: null,
  };
  if (cursor) {
    query._id = { $gt: ensureObjectId(cursor, 'cursor') };
  }

  const comments = await Comment.find(query)
    .sort({ _id: 1 })
    .limit(limit + 1)
    .populate('authorId', 'firstName lastName avatarUrl')
    .lean();

  const hasMore = comments.length > limit;
  const slicedComments = hasMore ? comments.slice(0, limit) : comments;
  const serialized = slicedComments.map(serializeComment);
  const items = await attachViewerReactions(serialized, 'comment', userId);

  return {
    items,
    nextCursor: hasMore ? slicedComments[slicedComments.length - 1]._id.toString() : null,
  };
}

export async function createComment({ postId, authorId, content, parentCommentId = null }) {
  if (!content?.trim()) {
    throw badRequest('Comment content is required');
  }

  const post = await Post.findOne({
    _id: ensureObjectId(postId, 'postId'),
    deletedAt: null,
  });

  if (!post) {
    throw notFound('Post not found');
  }

  const comment = await Comment.create({
    postId: post._id,
    authorId,
    content,
    parentCommentId: parentCommentId ? ensureObjectId(parentCommentId, 'parentCommentId') : null,
  });

  post.commentCount += 1;
  await post.save();

  if (parentCommentId) {
    await Comment.findByIdAndUpdate(parentCommentId, { $inc: { replyCount: 1 } });
  }

  const hydrated = await Comment.findById(comment._id).populate('authorId', 'firstName lastName avatarUrl');
  const serialized = serializeComment(hydrated);

  emitToPost(post._id.toString(), 'comment:created', serialized);
  emitToFeed('comment:created', serialized);

  return serialized;
}

export async function deleteComment({ commentId, userId }) {
  const comment = await Comment.findOne({
    _id: ensureObjectId(commentId, 'commentId'),
    deletedAt: null,
  });

  if (!comment) {
    throw notFound('Comment not found');
  }

  if (comment.authorId.toString() !== userId.toString()) {
    throw forbidden('You can only delete your own comment');
  }

  comment.deletedAt = new Date();
  await comment.save();
  await Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } });

  if (comment.parentCommentId) {
    await Comment.findByIdAndUpdate(comment.parentCommentId, { $inc: { replyCount: -1 } });
  }

  emitToPost(comment.postId.toString(), 'comment:deleted', {
    id: comment._id.toString(),
    postId: comment.postId.toString(),
  });
}

export async function upsertReaction({ userId, targetType, targetId, reactionType }) {
  if (!reactionTypes.includes(reactionType)) {
    throw badRequest('Invalid reaction type');
  }

  const resolvedTargetId = ensureObjectId(targetId, 'targetId');
  const model = targetType === 'post' ? Post : targetType === 'comment' ? Comment : null;
  if (!model) {
    throw badRequest('Invalid target type');
  }

  const document = await model.findOne({ _id: resolvedTargetId, deletedAt: null });
  if (!document) {
    throw notFound(`${targetType} not found`);
  }

  const existing = await Reaction.findOne({ userId, targetType, targetId: resolvedTargetId });
  const reactionCounts = {
    ...createEmptyReactionCounts(),
    ...document.reactionCounts,
  };

  if (existing) {
    if (existing.reactionType !== reactionType) {
      reactionCounts[existing.reactionType] = Math.max(0, (reactionCounts[existing.reactionType] || 0) - 1);
      reactionCounts[reactionType] = (reactionCounts[reactionType] || 0) + 1;
      existing.reactionType = reactionType;
      await existing.save();
      document.reactionCounts = reactionCounts;
      await document.save();
    }
  } else {
    reactionCounts[reactionType] = (reactionCounts[reactionType] || 0) + 1;
    await Reaction.create({ userId, targetType, targetId: resolvedTargetId, reactionType });
    document.reactionCounts = reactionCounts;
    await document.save();
  }

  const payload = {
    targetId,
    targetType,
    reactionCounts: document.reactionCounts,
    viewerReaction: reactionType,
  };

  if (targetType === 'post') {
    emitToFeed('post:reactionUpdated', payload);
  } else {
    emitToPost(document.postId.toString(), 'comment:reactionUpdated', payload);
  }

  return payload;
}

export async function removeReaction({ userId, targetType, targetId }) {
  const resolvedTargetId = ensureObjectId(targetId, 'targetId');
  const model = targetType === 'post' ? Post : targetType === 'comment' ? Comment : null;
  if (!model) {
    throw badRequest('Invalid target type');
  }

  const reaction = await Reaction.findOne({ userId, targetType, targetId: resolvedTargetId });
  if (!reaction) {
    return { targetId, targetType, removed: true };
  }

  const document = await model.findOne({ _id: resolvedTargetId, deletedAt: null });
  if (!document) {
    throw notFound(`${targetType} not found`);
  }

  const reactionCounts = {
    ...createEmptyReactionCounts(),
    ...document.reactionCounts,
  };
  reactionCounts[reaction.reactionType] = Math.max(0, (reactionCounts[reaction.reactionType] || 0) - 1);

  await reaction.deleteOne();
  document.reactionCounts = reactionCounts;
  await document.save();

  const payload = {
    targetId,
    targetType,
    reactionCounts: document.reactionCounts,
    viewerReaction: null,
  };

  if (targetType === 'post') {
    emitToFeed('post:reactionUpdated', payload);
  } else {
    emitToPost(document.postId.toString(), 'comment:reactionUpdated', payload);
  }

  return payload;
}

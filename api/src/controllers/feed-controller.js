import { asyncHandler } from '../lib/async-handler.js';
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  getComments,
  getFeed,
  getPostById,
  removeReaction,
  upsertReaction,
} from '../services/feed-service.js';
import { uploadImageBuffer } from '../services/upload-service.js';

export const listFeed = asyncHandler(async (req, res) => {
  const data = await getFeed({
    cursor: req.query.cursor,
    limit: Math.min(Number(req.query.limit || 10), 20),
    userId: req.user?._id,
  });
  res.json(data);
});

export const createPostHandler = asyncHandler(async (req, res) => {
  const post = await createPost({
    authorId: req.user._id,
    content: req.body.content,
    media: req.body.media || [],
  });
  res.status(201).json({ post: { ...post, viewerReaction: null, hasReacted: false } });
});

export const getPostHandler = asyncHandler(async (req, res) => {
  const post = await getPostById({ postId: req.params.postId, userId: req.user._id });
  res.json({ post });
});

export const deletePostHandler = asyncHandler(async (req, res) => {
  await deletePost({ postId: req.params.postId, userId: req.user._id });
  res.status(204).send();
});

export const listCommentsHandler = asyncHandler(async (req, res) => {
  const data = await getComments({
    postId: req.params.postId,
    cursor: req.query.cursor,
    limit: Math.min(Number(req.query.limit || 20), 50),
    userId: req.user._id,
  });
  res.json(data);
});

export const createCommentHandler = asyncHandler(async (req, res) => {
  const comment = await createComment({
    postId: req.params.postId,
    authorId: req.user._id,
    content: req.body.content,
    parentCommentId: req.body.parentCommentId || null,
  });
  res.status(201).json({ comment: { ...comment, viewerReaction: null, hasReacted: false } });
});

export const deleteCommentHandler = asyncHandler(async (req, res) => {
  await deleteComment({ commentId: req.params.commentId, userId: req.user._id });
  res.status(204).send();
});

export const upsertReactionHandler = asyncHandler(async (req, res) => {
  const reaction = await upsertReaction({
    userId: req.user._id,
    targetType: req.body.targetType,
    targetId: req.body.targetId,
    reactionType: req.body.reactionType,
  });
  res.json(reaction);
});

export const deleteReactionHandler = asyncHandler(async (req, res) => {
  const reaction = await removeReaction({
    userId: req.user._id,
    targetType: req.body.targetType,
    targetId: req.body.targetId,
  });
  res.json(reaction);
});

export const uploadImageHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: 'Image file is required' });
    return;
  }

  const uploaded = await uploadImageBuffer(req.file.buffer);
  res.status(201).json({
    media: {
      type: 'image',
      url: uploaded.secure_url,
      width: uploaded.width,
      height: uploaded.height,
    },
  });
});

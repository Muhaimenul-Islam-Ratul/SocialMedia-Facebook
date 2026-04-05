import express from 'express';
import { login, logout, refresh, register } from '../controllers/auth-controller.js';
import {
  createCommentHandler,
  createPostHandler,
  deleteCommentHandler,
  deletePostHandler,
  deleteReactionHandler,
  getPostHandler,
  listCommentsHandler,
  listFeed,
  uploadImageHandler,
  upsertReactionHandler,
} from '../controllers/feed-controller.js';
import { getCurrentUser } from '../controllers/user-controller.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

export function registerRoutes(app) {
  const router = express.Router();

  router.post('/auth/register', register);
  router.post('/auth/login', login);
  router.post('/auth/refresh', refresh);
  router.post('/auth/logout', logout);

  router.get('/users/me', requireAuth, getCurrentUser);

  router.get('/feed', requireAuth, listFeed);
  router.post('/posts', requireAuth, createPostHandler);
  router.get('/posts/:postId', requireAuth, getPostHandler);
  router.delete('/posts/:postId', requireAuth, deletePostHandler);

  router.get('/posts/:postId/comments', requireAuth, listCommentsHandler);
  router.post('/posts/:postId/comments', requireAuth, createCommentHandler);
  router.delete('/comments/:commentId', requireAuth, deleteCommentHandler);

  router.put('/reactions', requireAuth, upsertReactionHandler);
  router.delete('/reactions', requireAuth, deleteReactionHandler);

  router.post('/uploads/image', requireAuth, uploadImage.single('image'), uploadImageHandler);

  app.use('/api', router);
}

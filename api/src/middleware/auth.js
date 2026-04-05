import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { asyncHandler } from '../lib/async-handler.js';
import { unauthorized } from '../lib/errors.js';
import { User } from '../models/User.js';

function extractToken(headerValue = '') {
  if (!headerValue.startsWith('Bearer ')) {
    return null;
  }

  return headerValue.slice(7);
}

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req.headers.authorization);
  if (!token) {
    throw unauthorized();
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtAccessSecret);
  } catch {
    throw unauthorized('Invalid or expired access token');
  }

  const user = await User.findById(payload.sub).select('-passwordHash');
  if (!user || user.status !== 'active') {
    throw unauthorized();
  }

  req.user = user;
  next();
});

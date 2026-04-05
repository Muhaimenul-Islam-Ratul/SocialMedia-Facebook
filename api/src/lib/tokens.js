import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    env.jwtAccessSecret,
    { expiresIn: env.accessTokenTtl },
  );
}

export function signRefreshToken(user, tokenId) {
  return jwt.sign(
    { sub: user._id.toString(), tokenId },
    env.jwtRefreshSecret,
    { expiresIn: `${env.refreshTokenTtlDays}d` },
  );
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

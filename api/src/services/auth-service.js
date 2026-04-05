import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { badRequest, unauthorized } from '../lib/errors.js';
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/tokens.js';

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function registerUser({ firstName, lastName, email, password }) {
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
    throw badRequest('First name, last name, email, and password are required');
  }

  if (password.length < 6) {
    throw badRequest('Password must be at least 6 characters long');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw badRequest('Email is already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    passwordHash,
  });

  return issueSession(user);
}

export async function loginUser({ email, password }) {
  if (!email?.trim() || !password) {
    throw unauthorized('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw unauthorized('Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw unauthorized('Invalid email or password');
  }

  user.lastActiveAt = new Date();
  await user.save();

  return issueSession(user);
}

export async function refreshUserSession(rawRefreshToken) {
  if (!rawRefreshToken) {
    throw unauthorized('Missing refresh token');
  }

  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw unauthorized('Invalid refresh token');
  }

  const tokenHash = hashToken(rawRefreshToken);
  const storedToken = await RefreshToken.findOne({
    _id: payload.tokenId,
    userId: payload.sub,
    tokenHash,
    revokedAt: null,
  });

  if (!storedToken || storedToken.expiresAt <= new Date()) {
    throw unauthorized('Refresh token expired');
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw unauthorized('User no longer exists');
  }

  storedToken.revokedAt = new Date();
  await storedToken.save();

  return issueSession(user);
}

export async function revokeRefreshToken(rawRefreshToken) {
  if (!rawRefreshToken) {
    return;
  }

  try {
    const payload = verifyRefreshToken(rawRefreshToken);
    await RefreshToken.findByIdAndUpdate(payload.tokenId, { revokedAt: new Date() });
  } catch {
    return;
  }
}

async function issueSession(user) {
  const tokenId = crypto.randomUUID();
  const refreshToken = signRefreshToken(user, tokenId);
  const accessToken = signAccessToken(user);

  await RefreshToken.create({
    _id: tokenId,
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
  });

  return { user, accessToken, refreshToken };
}

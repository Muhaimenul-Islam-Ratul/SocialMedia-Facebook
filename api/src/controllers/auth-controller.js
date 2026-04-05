import { env } from '../config/env.js';
import { asyncHandler } from '../lib/async-handler.js';
import { serializeUser } from '../serializers/auth.js';
import { loginUser, refreshUserSession, registerUser, revokeRefreshToken } from '../services/auth-service.js';

function setRefreshCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.cookieSecure,
    maxAge: env.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.cookieSecure,
  });
}

export const register = asyncHandler(async (req, res) => {
  const session = await registerUser(req.body);
  setRefreshCookie(res, session.refreshToken);
  res.status(201).json({
    accessToken: session.accessToken,
    user: serializeUser(session.user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const session = await loginUser(req.body);
  setRefreshCookie(res, session.refreshToken);
  res.json({
    accessToken: session.accessToken,
    user: serializeUser(session.user),
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const session = await refreshUserSession(req.cookies.refreshToken);
  setRefreshCookie(res, session.refreshToken);
  res.json({
    accessToken: session.accessToken,
    user: serializeUser(session.user),
  });
});

export const logout = asyncHandler(async (req, res) => {
  await revokeRefreshToken(req.cookies.refreshToken);
  clearRefreshCookie(res);
  res.status(204).send();
});

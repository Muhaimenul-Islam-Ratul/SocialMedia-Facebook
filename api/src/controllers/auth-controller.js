import { env } from '../config/env.js';
import { asyncHandler } from '../lib/async-handler.js';
import { serializeUser } from '../serializers/auth.js';
import { loginUser, refreshUserSession, registerUser, revokeRefreshToken } from '../services/auth-service.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  secure: env.nodeEnv === 'production' ? true : env.cookieSecure,
};

function setRefreshCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: env.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res) {
  res.clearCookie('refreshToken', cookieOptions);
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

import { asyncHandler } from '../lib/async-handler.js';
import { serializeUser } from '../serializers/auth.js';

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

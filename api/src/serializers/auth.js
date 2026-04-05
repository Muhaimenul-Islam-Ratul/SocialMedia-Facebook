export function serializeUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    status: user.status,
    createdAt: user.createdAt,
  };
}

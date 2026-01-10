// src/modules/user/user.presenter.ts
export function presentUser(user: any) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    isReadOnly: user.isReadOnly,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,
  };
}

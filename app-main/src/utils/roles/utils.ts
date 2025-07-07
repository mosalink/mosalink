import { Session } from "next-auth";

export type Role = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export function isSuperAdmin(user: { role: Role }) {
  if (user.role === 'SUPER_ADMIN') {
    return true;
  }
  return false;
}

export function isAdminDomain(
  user: { role: Role; domainId: string },
  domainId: string
) {
  if (isSuperAdmin(user)) {
    return true;
  }
  if (user.role === 'ADMIN' && user.domainId === domainId) {
    return true;
  }
  return false;
}

export function canModifBookmark(
  currentUser: { role: Role; domainId: string; id: string },
  bookmarkUser: { id: string; domainId: string }
) {
  if (currentUser.id === bookmarkUser.id) {
    return true;
  }
  if (isAdminDomain(currentUser, bookmarkUser.domainId)) {
    return true;
  }
  return false;
}

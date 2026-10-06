import type { Access, FieldAccess } from 'payload';

// Two roles: admins manage everything, including CMS users; editors (volunteers) edit content.
type CmsUser = { id: string | number; role?: 'admin' | 'editor' } | null | undefined;

export const anyone: Access = () => true;
export const loggedIn: Access = ({ req }) => !!req.user;
export const isAdmin: Access = ({ req }) => (req.user as CmsUser)?.role === 'admin';
export const isAdminField: FieldAccess = ({ req }) => (req.user as CmsUser)?.role === 'admin';

// Admins see and edit every CMS user; editors only their own account.
export const adminOrSelf: Access = ({ req }) => {
  const user = req.user as CmsUser;
  if (!user) return false;
  return user.role === 'admin' ? true : { id: { equals: user.id } };
};

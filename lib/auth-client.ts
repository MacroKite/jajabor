import { createAuthClient } from 'better-auth/react';

// Talks to /api/auth on the current site.
export const authClient = createAuthClient();

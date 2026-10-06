import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import type { auth } from './auth';

// Talks to /api/auth on the current site. inferAdditionalFields adds hometown and bio to the user type.
export const authClient = createAuthClient({ plugins: [inferAdditionalFields<typeof auth>()] });

// Ask every useSession() to fetch the session again, e.g. after the profile photo changes.
export const refreshSession = () => authClient.$store.notify('$sessionSignal');

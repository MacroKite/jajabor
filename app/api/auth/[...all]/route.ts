import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/auth';

// Sign-up, sign-in, sign-out, sessions and the Google callback (/api/auth/callback/google).
export const { GET, POST } = toNextJsHandler(auth);

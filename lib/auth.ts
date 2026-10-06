import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { APIError } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { MongoClient } from 'mongodb';
import { headers } from 'next/headers';
import { CLOUD } from './images';
import { BIO_MAX } from './data';

const PHOTO_HOSTS = [`https://res.cloudinary.com/${CLOUD}/`, 'https://lh3.googleusercontent.com/'];

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not set');

// The driver connects on first use. Reuse one client across hot reloads and warm serverless requests.
const g = globalThis as typeof globalThis & { _authMongo?: MongoClient };
const client = (g._authMongo ??= new MongoClient(uri));

// Reads BETTER_AUTH_SECRET and BETTER_AUTH_URL from the environment.
// Users, sessions and linked accounts live in the `user`, `session` and `account` collections.
export const auth = betterAuth({
  // Passing the client enables transactions (Atlas supports them; a standalone local MongoDB does not).
  database: mongodbAdapter(client.db(), { client }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
  },
  // Signing in with Google using the same email as a password account joins the two.
  account: { accountLinking: { enabled: true, trustedProviders: ['google'] } },
  // Profile fields shown on the public traveller page; users edit them on /account.
  user: {
    additionalFields: {
      hometown: { type: 'string', required: false, input: true },
      bio: { type: 'string', required: false, input: true },
    },
  },
  databaseHooks: {
    user: {
      update: {
        // Clean up profile edits before they are saved.
        before: async data => {
          // Better Auth passes fields that aren't changing as undefined; leave those alone.
          const d: Record<string, unknown> = { ...data };
          if (d.name !== undefined) {
            const name = String(d.name ?? '').trim().slice(0, 80);
            if (!name) throw new APIError('BAD_REQUEST', { message: 'Please add your name.' });
            d.name = name;
          }
          if (d.hometown !== undefined) d.hometown = String(d.hometown ?? '').trim().slice(0, 80) || null;
          if (d.bio !== undefined) d.bio = String(d.bio ?? '').trim().slice(0, BIO_MAX) || null;
          // Photos come from our own upload (Cloudinary) or from Google sign-in; nothing else.
          if (d.image != null && !PHOTO_HOSTS.some(h => String(d.image).startsWith(h))) {
            throw new APIError('BAD_REQUEST', { message: 'Please upload your photo on your profile page.' });
          }
          return { data: d };
        },
      },
    },
  },
  plugins: [nextCookies()],
});

export type SessionUser = typeof auth.$Infer.Session.user;

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

// Only follow redirects to paths on this site.
export const safeNext = (v: unknown) =>
  typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') && !v.startsWith('/\\') ? v : '/';

import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { MongoClient } from 'mongodb';
import { headers } from 'next/headers';

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
  plugins: [nextCookies()],
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

// Only follow redirects to paths on this site.
export const safeNext = (v: unknown) =>
  typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') && !v.startsWith('/\\') ? v : '/';

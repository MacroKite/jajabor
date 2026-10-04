import mongoose from 'mongoose';

export const MONGODB_URI = process.env.MONGODB_URI;

// Reuse one connection across hot reloads in dev and across requests on a warm
// serverless instance, instead of opening a new one per request.
const g = globalThis as typeof globalThis & { _mongoose?: Promise<typeof mongoose> };

export function connect(): Promise<typeof mongoose> {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not set');
  g._mongoose ??= mongoose.connect(MONGODB_URI, { bufferCommands: false }).catch(e => {
    g._mongoose = undefined;
    throw e;
  });
  return g._mongoose;
}

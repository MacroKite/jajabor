import { NextResponse } from 'next/server';
import { hasDatabase, insertMessage } from '@/lib/db';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  let f: Record<string, unknown>;
  try { f = await req.json(); } catch { return bad('Invalid request.'); }
  if (str(f.website, 200)) return NextResponse.json({ ok: true }); // honeypot

  const name = str(f.name, 80), email = str(f.email, 200), message = str(f.message, 5000);
  const err = !name ? 'Please add your name.' : !/^\S+@\S+\.\S+$/.test(email) ? 'Please add a valid email.' : message.length < 10 ? 'Please write a short message.' : '';
  if (err) return bad(err);
  if (!hasDatabase) return bad('Messages are unavailable right now. Please email us instead.', 503);

  try {
    await insertMessage({ name, email, message });
  } catch (e) {
    console.error('insertMessage failed', e);
    return bad('Could not send. Please try again.', 500);
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'node:crypto';
import { byId, type Story } from '@/lib/data';
import { hasImageStorage } from '@/lib/cloudinary';
import { hasDatabase, insertStory } from '@/lib/db';
import { MIN_WORDS, wc } from '@/lib/stories';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

// Vercel caps request bodies at 4.5 MB; the browser resizes photos well below this.
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

function parseImage(v: unknown): { mime: string; base64: string } | null {
  if (typeof v !== 'string') return null;
  const m = v.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return null;
  const buf = Buffer.from(m[2], 'base64');
  if (!buf.length || buf.length > MAX_IMAGE_BYTES) return null;
  // Check the file really is the image type it claims to be.
  const jpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const png = buf.subarray(0, 4).toString('hex') === '89504e47';
  const webp = buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP';
  const ok = { 'image/jpeg': jpeg, 'image/png': png, 'image/webp': webp }[m[1]];
  return ok ? { mime: m[1], base64: buf.toString('base64') } : null;
}

export async function POST(req: Request) {
  let f: Record<string, unknown>;
  try { f = await req.json(); } catch { return bad('Invalid request. Your photo may be too large.'); }

  // Honeypot: real people never fill this hidden field.
  if (str(f.website, 200)) return bad('Could not publish your story.');

  const place = str(f.place, 60);
  const title = str(f.title, 160);
  const text = str(f.text, 30000).replace(/\r\n/g, '\n');
  const name = str(f.name, 80);
  const from = str(f.from, 80);
  const n = wc(text);

  const err = !byId(place) ? 'Pick the place your story is about.'
    : !f.image ? 'Add a photo from your trip.'
    : !title ? 'Give your story a title.'
    : n < MIN_WORDS ? `Your story needs at least ${MIN_WORDS} words. You have ${n}.`
    : !name ? 'Add your name.'
    : '';
  if (err) return bad(err);
  const image = parseImage(f.image);
  if (!image) return bad('That photo could not be used. Please try a different JPG or PNG.');

  if (!hasDatabase || !hasImageStorage) return bad('Stories are read-only right now. Please try again later.', 503);

  const story: Story = {
    id: 'u' + Date.now().toString(36) + randomBytes(3).toString('hex'),
    place, title, text, name,
    from: from || 'Bangladesh',
    date: new Date().toISOString().slice(0, 10),
  };

  try {
    await insertStory(story, image);
  } catch (e) {
    console.error('insertStory failed', e);
    return bad('Could not publish your story. Please try again.', 500);
  }

  revalidatePath('/');
  revalidatePath('/stories', 'layout');
  return NextResponse.json({ id: story.id }, { status: 201 });
}

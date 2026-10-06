import { MIN_WORDS, wc } from './stories';

export type StoryFields = { place: string; title: string; text: string; name: string; from: string };
export type StoryImageInput = { mime: string; base64: string };

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Vercel caps request bodies at 4.5 MB; the browser resizes photos well below this.
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

// Checks a data: URL photo is a real JPG, PNG or WebP under the size limit.
export function parseImage(v: unknown): StoryImageInput | null {
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

// Validates a submitted story. A photo is required when publishing; when editing it is optional
// (no photo means keep the current one). `placeIds` are the destinations a story can be about.
// The author name always comes from the logged-in account, never from the form.
export function readStoryInput(f: Record<string, unknown>, photoRequired: boolean, placeIds: string[], authorName: string): { error: string } | { fields: StoryFields; image: StoryImageInput | null } {
  // Honeypot: real people never fill this hidden field.
  if (str(f.website, 200)) return { error: 'Could not save your story.' };

  const place = str(f.place, 60);
  const title = str(f.title, 160);
  const text = str(f.text, 30000).replace(/\r\n/g, '\n');
  const name = str(authorName, 80) || 'A traveller';
  const from = str(f.from, 80);
  const n = wc(text);
  const hasPhoto = typeof f.image === 'string' && f.image !== '';

  const error = !placeIds.includes(place) ? 'Pick the place your story is about.'
    : photoRequired && !hasPhoto ? 'Add a photo from your trip.'
    : !title ? 'Give your story a title.'
    : n < MIN_WORDS ? `Your story needs at least ${MIN_WORDS} words. You have ${n}.`
    : '';
  if (error) return { error };

  const image = hasPhoto ? parseImage(f.image) : null;
  if (hasPhoto && !image) return { error: 'That photo could not be used. Please try a different JPG or PNG.' };
  return { fields: { place, title, text, name, from: from || 'Bangladesh' }, image };
}

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'node:crypto';
import type { Story } from '@/lib/data';
import { hasImageStorage } from '@/lib/cloudinary';
import { hasDatabase, insertStory } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { readStoryInput } from '@/lib/story-input';
import { getDestinations } from '@/lib/content';

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  // Only signed-in users can publish; the share page sends visitors to log in first.
  const session = await getSession();
  if (!session) return bad('Please log in to share your story.', 401);

  let f: Record<string, unknown>;
  try { f = await req.json(); } catch { return bad('Invalid request. Your photo may be too large.'); }

  const input = readStoryInput(f, true, (await getDestinations()).map(d => d.id), session.user.name);
  if ('error' in input) return bad(input.error);
  if (!hasDatabase || !hasImageStorage) return bad('Stories are read-only right now. Please try again later.', 503);

  const story: Story = {
    id: 'u' + Date.now().toString(36) + randomBytes(3).toString('hex'),
    ...input.fields,
    date: new Date().toISOString().slice(0, 10),
  };

  try {
    await insertStory(story, input.image!, session.user.id);
  } catch (e) {
    console.error('insertStory failed', e);
    return bad('Could not publish your story. Please try again.', 500);
  }

  revalidatePath('/');
  revalidatePath('/stories', 'layout');
  return NextResponse.json({ id: story.id }, { status: 201 });
}

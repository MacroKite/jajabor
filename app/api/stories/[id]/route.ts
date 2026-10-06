import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { hasImageStorage } from '@/lib/cloudinary';
import { deleteStory, hasDatabase, updateStory } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { readStoryInput } from '@/lib/story-input';
import { getDestinations } from '@/lib/content';

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });
type Ctx = { params: Promise<{ id: string }> };

// Stories can only be changed by the account that wrote them.
const NOT_YOURS = 'This story doesn’t exist, or it isn’t yours to change.';

function revalidate() {
  revalidatePath('/');
  revalidatePath('/stories', 'layout');
}

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return bad('Please log in to edit your story.', 401);

  let f: Record<string, unknown>;
  try { f = await req.json(); } catch { return bad('Invalid request. Your photo may be too large.'); }

  const input = readStoryInput(f, false, (await getDestinations()).map(d => d.id), session.user.name);
  if ('error' in input) return bad(input.error);
  if (!hasDatabase || (input.image && !hasImageStorage)) return bad('Stories are read-only right now. Please try again later.', 503);

  const { id } = await params;
  try {
    if (!(await updateStory(id, session.user.id, input.fields, input.image))) return bad(NOT_YOURS, 404);
  } catch (e) {
    console.error('updateStory failed', e);
    return bad('Could not save your changes. Please try again.', 500);
  }
  revalidate();
  return NextResponse.json({ id });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return bad('Please log in to delete your story.', 401);
  if (!hasDatabase) return bad('Stories are read-only right now. Please try again later.', 503);

  const { id } = await params;
  try {
    if (!(await deleteStory(id, session.user.id))) return bad(NOT_YOURS, 404);
  } catch (e) {
    console.error('deleteStory failed', e);
    return bad('Could not delete your story. Please try again.', 500);
  }
  revalidate();
  return NextResponse.json({ ok: true });
}

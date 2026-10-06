import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth, getSession } from '@/lib/auth';
import { deleteAvatar, hasImageStorage, uploadAvatar } from '@/lib/cloudinary';
import { parseImage } from '@/lib/story-input';

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

// Upload or replace the logged-in user's profile photo.
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return bad('Please log in.', 401);
  if (!hasImageStorage) return bad('Photo uploads are unavailable right now.', 503);
  let f: Record<string, unknown>;
  try { f = await req.json(); } catch { return bad('Invalid request. Your photo may be too large.'); }
  const image = parseImage(f.image);
  if (!image) return bad('That photo could not be used. Please try a different JPG or PNG.');
  try {
    const url = await uploadAvatar(session.user.id, image);
    await auth.api.updateUser({ headers: await headers(), body: { image: url } });
    revalidatePath('/', 'layout');
    return NextResponse.json({ image: url });
  } catch (e) {
    console.error('avatar upload failed', e);
    return bad('Could not save your photo. Please try again.', 500);
  }
}

// Remove the profile photo.
export async function DELETE() {
  const session = await getSession();
  if (!session) return bad('Please log in.', 401);
  try {
    await auth.api.updateUser({ headers: await headers(), body: { image: null } });
    await deleteAvatar(session.user.id).catch(() => {});
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('avatar delete failed', e);
    return bad('Could not remove your photo. Please try again.', 500);
  }
}

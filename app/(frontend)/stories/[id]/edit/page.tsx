import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getOwnedStory } from '@/lib/db';
import { getDestinations } from '@/lib/content';
import ShareView from '@/app/(frontend)/share/ShareView';

export const metadata: Metadata = { title: 'Edit your story', robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect('/login?next=' + encodeURIComponent(`/stories/${id}/edit`));

  // Only the author can open the editor; anyone else gets a 404.
  const s = await getOwnedStory(id, session.user.id);
  if (!s) notFound();

  const places = (await getDestinations()).map(d => ({ id: d.id, name: d.name }));
  return <ShareView storyId={s.id} places={places} authorName={session.user.name} initial={{ place: s.place, title: s.title, text: s.text, from: s.from, image: s.image ?? '' }} />;
}

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDestinations } from '@/lib/content';
import { getSession } from '@/lib/auth';
import ShareView from './ShareView';

export const metadata: Metadata = {
  title: 'Share your story',
  description: 'Tell the next traveller what it was really like. Share your trip to a place in Bangladesh.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ place?: string }> }) {
  const { place } = await searchParams;
  const dests = await getDestinations();
  const defaultPlace = dests.some(d => d.id === place) ? place! : '';

  // Writing a story needs an account; come back here after logging in.
  const session = await getSession();
  if (!session) redirect('/login?next=' + encodeURIComponent('/share' + (defaultPlace ? '?place=' + defaultPlace : '')));

  return <ShareView places={dests.map(d => ({ id: d.id, name: d.name }))} authorName={session.user.name} initial={{ place: defaultPlace, title: '', text: '', from: '', image: '' }} />;
}

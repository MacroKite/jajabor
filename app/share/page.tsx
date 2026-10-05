import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { byId } from '@/lib/data';
import { getSession } from '@/lib/auth';
import ShareView from './ShareView';

export const metadata: Metadata = {
  title: 'Share your story',
  description: 'Tell the next traveller what it was really like. Share your trip to a place in Bangladesh.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ place?: string }> }) {
  const { place } = await searchParams;
  const defaultPlace = byId(place) ? place! : '';

  // Writing a story needs an account; come back here after logging in.
  const session = await getSession();
  if (!session) redirect('/login?next=' + encodeURIComponent('/share' + (defaultPlace ? '?place=' + defaultPlace : '')));

  return <ShareView defaultPlace={defaultPlace} defaultName={session.user.name} />;
}

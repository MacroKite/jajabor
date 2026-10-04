import type { Metadata } from 'next';
import { byId } from '@/lib/data';
import ShareView from './ShareView';

export const metadata: Metadata = {
  title: 'Share your story',
  description: 'Tell the next traveller what it was really like. Share your trip to a place in Bangladesh.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ place?: string }> }) {
  const { place } = await searchParams;
  return <ShareView defaultPlace={byId(place) ? place! : ''} />;
}

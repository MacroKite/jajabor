import type { Metadata } from 'next';
import { getDestinations } from '@/lib/content';
import { listStories } from '@/lib/db';
import StoriesView from './StoriesView';

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Travel stories from Bangladesh, written by travellers, for the next person who goes.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ place?: string }> }) {
  const { place } = await searchParams;
  const [stories, dests] = await Promise.all([listStories(), getDestinations()]);
  return <StoriesView stories={stories} dests={dests} initialPlace={dests.some(d => d.id === place) ? place! : 'all'} />;
}

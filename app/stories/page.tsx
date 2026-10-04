import type { Metadata } from 'next';
import { byId } from '@/lib/data';
import { listStories } from '@/lib/db';
import StoriesView from './StoriesView';

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Travel stories from Bangladesh, written by travellers, for the next person who goes.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ place?: string }> }) {
  const { place } = await searchParams;
  const stories = await listStories();
  return <StoriesView stories={stories} initialPlace={byId(place) ? place! : 'all'} />;
}

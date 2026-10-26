import type { Metadata } from 'next';
import { getDestinations } from '@/lib/content';
import { listStories } from '@/lib/db';
import StoriesView from './StoriesView';

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Travel stories from Bangladesh, written by travellers, for the next person who goes.',
};

// Built ahead of time and cached, so the nav link opens instantly; publishing or changing a story
// refreshes it (app/api/stories). The ?place= filter is read in the browser by StoriesView.
export const revalidate = 300;

export default async function Page() {
  const [stories, dests] = await Promise.all([listStories(), getDestinations()]);
  return <StoriesView stories={stories} dests={dests} />;
}

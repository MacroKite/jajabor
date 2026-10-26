import type { Metadata } from 'next';
import { getDestinations } from '@/lib/content';
import DestinationsView from './DestinationsView';

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Honest guides to every destination in Bangladesh: what to eat, where to stay and how to get there.',
};

// Built ahead of time, so the nav link opens instantly; CMS edits refresh it (cms/revalidate.ts).
// The ?filter= tab is read in the browser by DestinationsView.
export default async function Page() {
  return <DestinationsView dests={await getDestinations()} />;
}

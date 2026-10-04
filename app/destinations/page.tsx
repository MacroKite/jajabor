import type { Metadata } from 'next';
import DestinationsView from './DestinationsView';

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Honest guides to every destination in Bangladesh: what to eat, where to stay and how to get there.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  return <DestinationsView initialFilter={filter === 'popular' || filter === 'gem' ? filter : 'all'} />;
}

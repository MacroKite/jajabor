import type { MetadataRoute } from 'next';
import { getDestinations } from '@/lib/content';
import { listStories } from '@/lib/db';
import { siteUrl } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const stories = await listStories().catch(() => []);
  return [
    ...['/', '/destinations', '/stories', '/share', '/about'].map(p => ({ url: base + p })),
    ...(await getDestinations().catch(() => [])).map(d => ({ url: `${base}/destinations/${d.id}` })),
    ...stories.map(s => ({ url: `${base}/stories/${s.id}`, lastModified: s.date })),
  ];
}

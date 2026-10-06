import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const q = (key: string) => [{ type: 'query' as const, key, value: '(?<v>.+)' }];

const nextConfig: NextConfig = {
  // The site and the Payload admin each have their own root layout, so unknown URLs
  // use app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  // Old prototype URLs keep working.
  async redirects() {
    return [
      { source: '/TRIP.dc.html', destination: '/', permanent: true },
      { source: '/Destinations.dc.html', destination: '/destinations', permanent: true },
      { source: '/Destination.dc.html', has: q('id'), destination: '/destinations/:v', permanent: true },
      { source: '/Destination.dc.html', destination: '/destinations', permanent: true },
      { source: '/Stories.dc.html', has: q('story'), destination: '/stories/:v', permanent: true },
      { source: '/Stories.dc.html', destination: '/stories', permanent: true },
      { source: '/ShareStory.dc.html', destination: '/share', permanent: true },
      { source: '/About.dc.html', destination: '/about', permanent: true },
    ];
  },
};

export default withPayload(nextConfig);

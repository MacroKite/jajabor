import type { Metadata, Viewport } from 'next';
import SiteDocument from '@/components/SiteDocument';
import { siteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: 'TRIP · Know Bangladesh before you go', template: '%s · TRIP' },
  description: 'A free, honest guide to travelling in Bangladesh. Written by travellers, run by volunteers.',
  openGraph: { siteName: 'TRIP', type: 'website' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// Root layout for the public site. The CMS at /admin has its own, in app/(payload).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <SiteDocument>{children}</SiteDocument>;
}

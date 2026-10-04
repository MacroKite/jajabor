import type { Metadata, Viewport } from 'next';
import { siteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: 'TRIP · Know Bangladesh before you go', template: '%s · TRIP' },
  description: 'A free, honest guide to travelling in Bangladesh. Written by travellers, run by volunteers.',
  openGraph: { siteName: 'TRIP', type: 'website' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// Hides images that fail to load (hot-linked photos can disappear).
const hideBroken = `document.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG')t.style.visibility='hidden'},true);`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: hideBroken }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

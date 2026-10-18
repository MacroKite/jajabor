'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Counts a page view on every page change, for the Analytics screen in the CMS.
// The referrer is only sent for the first page, and only when it's another site.
let last: string | null = null;

export default function PageViewTracker() {
  const path = usePathname();
  useEffect(() => {
    if (path === last) return; // React runs effects twice in development
    const ref = last === null && document.referrer && !document.referrer.startsWith(location.origin) ? document.referrer : '';
    last = path;
    const body = JSON.stringify({ path, referrer: ref });
    if (!navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }))) {
      fetch('/api/track', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => {});
    }
  }, [path]);
  return null;
}

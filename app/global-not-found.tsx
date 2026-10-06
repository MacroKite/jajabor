import type { Metadata } from 'next';
import SiteDocument from '@/components/SiteDocument';
import NotFound from './(frontend)/not-found';
import './(frontend)/globals.css';

export const metadata: Metadata = { title: 'Page not found · JAJABOR' };

// Unknown URLs. The site and the CMS each have their own root layout, so this page brings its own.
export default function GlobalNotFound() {
  return (
    <SiteDocument>
      <NotFound />
    </SiteDocument>
  );
}

import { revalidatePath } from 'next/cache';

// Content shows on many pages (destinations feed the home page, story pages and forms; contact
// details are in every footer), so any change refreshes the whole site. Outside a Next.js request,
// e.g. in the seed script, there is nothing to refresh.
function refreshSite() {
  try {
    revalidatePath('/', 'layout');
  } catch {
    // not running inside Next.js
  }
}

export const revalidateAfterChange = <T>({ doc }: { doc: T }) => { refreshSite(); return doc; };
export const revalidateAfterDelete = <T>({ doc }: { doc: T }) => { refreshSite(); return doc; };

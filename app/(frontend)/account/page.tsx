import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth, getSession } from '@/lib/auth';
import { listStoriesByUser } from '@/lib/db';
import { getDestinations } from '@/lib/content';
import { decorate } from '@/lib/stories';
import AccountView from './AccountView';

export const metadata: Metadata = { title: 'Your profile', robots: { index: false } };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect('/login?next=%2Faccount');
  const u = session.user;

  const [accounts, stories, dests] = await Promise.all([
    auth.api.listUserAccounts({ headers: await headers() }),
    listStoriesByUser(u.id),
    getDestinations(),
  ]);

  return (
    <AccountView
      user={{ id: u.id, name: u.name, email: u.email, image: u.image ?? '', hometown: u.hometown ?? '', bio: u.bio ?? '' }}
      // People who signed up with Google only have no password to change.
      hasPassword={accounts.some(a => a.providerId === 'credential')}
      stories={stories.map(s => decorate(s, dests)).map(s => ({ id: s.id, title: s.title, href: s.href, place: s.placeName, when: s.when, img: s.img }))}
    />
  );
}

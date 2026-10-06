import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Avatar from '@/components/Avatar';
import { getSession } from '@/lib/auth';
import { getProfile, listStoriesByUser } from '@/lib/db';
import { getDestinations } from '@/lib/content';
import { MON, decorate } from '@/lib/stories';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = await getProfile((await params).id);
  if (!p) return {};
  return { title: p.name, description: p.bio || `Travel stories by ${p.name} on JAJABOR.`, openGraph: { type: 'profile', images: p.image ? [p.image] : undefined } };
}

const PIN = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.5"></circle></svg>;

// A traveller's public page: who they are and the stories they've written. Never shows their email.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) notFound();
  const [session, stories, dests] = await Promise.all([getSession(), listStoriesByUser(id), getDestinations()]);
  const isMe = session?.user.id === id;
  const list = stories.map(s => decorate(s, dests));
  const [y, m] = profile.joined.split('-');
  const first = profile.name.split(' ')[0];

  return (
    <div className="overflow-x-clip bg-white">
      <Nav />

      <header className="flex flex-col gap-6 px-[5vw] pt-10 tablet:flex-row tablet:items-end tablet:gap-8 tablet:pt-16 desktop:pt-24">
        <Avatar name={profile.name} image={profile.image} className="size-24 text-[40px] tablet:size-32 tablet:text-[52px] desktop:size-40 desktop:text-[64px]" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h1 className="m-0 text-[clamp(40px,7vw,104px)] leading-[0.92] font-bold tracking-[-0.05em] break-words">{profile.name}</h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[15px] text-muted tablet:text-[16px]">
            {profile.hometown && <span className="flex items-center gap-1.5">{PIN}{profile.hometown}</span>}
            <span>Joined {MON[+m - 1]} {y}</span>
            <span>{list.length} {list.length === 1 ? 'story' : 'stories'}</span>
          </div>
        </div>
        {isMe && <Link href="/account" className="self-start rounded-full border border-[#d9d9d9] px-5 py-2.5 text-[14px] font-bold hover:border-ink tablet:self-end">Edit profile</Link>}
      </header>

      {profile.bio && <p className="m-0 max-w-[720px] px-[5vw] pt-8 text-[17px] leading-[1.65] whitespace-pre-line text-pretty text-[#2a2a2a] tablet:text-[19px]">{profile.bio}</p>}

      <section className="px-[5vw] pt-14 tablet:pt-20">
        <h2 className="m-0 border-b border-[#e4e4e4] pb-5 text-[clamp(28px,3vw,40px)] font-bold tracking-[-0.04em]">Stories by {first}</h2>
        {list.length ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 pt-8 tablet:grid-cols-2 desktop:grid-cols-3">
            {list.map(s => (
              <Link key={s.id} href={s.href} className="flex flex-col gap-3 text-ink">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[10px] bg-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {s.img && <img src={s.img} alt="" loading="lazy" className="absolute inset-0 block size-full object-cover transition-transform duration-900 ease-glide hover:scale-105" />}
                </div>
                <span className="text-[22px] leading-[1.1] font-bold tracking-[-0.03em] text-balance">{s.title}</span>
                <span className="text-[14px] text-muted">{s.placeName} · {s.when} · {s.readTime}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-8 text-[17px] text-muted">
            {isMe ? 'You haven’t shared a story yet.' : `${first} hasn’t shared a story yet.`}
            {isMe && <Link href="/share" className="rounded-[10px] bg-ink px-5.5 py-3.5 text-[15px] font-bold text-white hover:bg-bd-green hover:text-white">Write your first story</Link>}
          </div>
        )}
      </section>
    </div>
  );
}

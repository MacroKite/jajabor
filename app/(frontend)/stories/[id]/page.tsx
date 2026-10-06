import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import { getStory } from '@/lib/db';
import { decorate } from '@/lib/stories';
import { getDestinations } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import ShareButtons from './ShareButtons';
import StoryOwnerActions from './StoryOwnerActions';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const s = await getStory((await params).id);
  if (!s) return {};
  const r = decorate(s, await getDestinations());
  return {
    title: r.title,
    description: r.excerpt,
    authors: [{ name: r.name }],
    openGraph: { type: 'article', title: r.title, description: r.excerpt, publishedTime: r.date, images: r.img ? [r.img] : undefined },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const s = await getStory((await params).id);
  if (!s) notFound();
  const story = decorate(s, await getDestinations());
  const img = story.img ? new URL(story.img, siteUrl()).toString() : '';

  return (
    <div className="overflow-x-clip bg-white">
      <Nav active="stories" />

      <article className="px-[5vw] pt-14">
        <Link href="/stories" className="mb-10 inline-block text-[14px] font-medium text-muted hover:text-bd-green">← All stories</Link>
        <h1 className="m-0 max-w-[1100px] text-[clamp(30px,4.2vw,64px)] leading-[0.98] font-bold tracking-[-0.05em] text-balance">{story.title}</h1>
        <div className="mt-6 mb-8 flex tablet:mt-10 tablet:mb-14 flex-wrap items-center gap-x-5 gap-y-2 text-[16px] text-muted">
          <span className="font-bold text-ink">{story.name}</span>
          <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5c5c5c" strokeWidth="2"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.5"></circle></svg>{story.placeName}</span>
          <span>{story.when}</span>
        </div>
        <StoryOwnerActions id={story.id} authorId={story.authorId} />
        <div className="relative aspect-[16/11] overflow-hidden rounded-[10px] bg-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {story.img && <img src={story.img} alt={story.title} className="absolute inset-0 block size-full object-cover" />}
        </div>
        <div className="mt-10 flex flex-col gap-[1.2em] tablet:mt-16">
          {story.paras.map((p, i) => <p key={i} className="m-0 text-[17px] tablet:text-[19px] desktop:text-[clamp(20px,1.6vw,23px)] leading-[1.7] text-pretty text-[#2a2a2a]">{p}</p>)}
        </div>
        <ShareButtons path={story.href} title={story.title} img={img} />
      </article>

    </div>
  );
}

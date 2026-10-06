import Link from 'next/link';
import type { Destination } from '@/lib/data';
import type { Decorated } from '@/lib/stories';
import { bnLang } from '@/lib/format';

// Cards shared by the listing pages, profiles and the "more" sections at the end of guides and stories.

export function DestinationCard({ d }: { d: Destination }) {
  return (
    <Link href={'/destinations/' + d.id} className="flex flex-col gap-3.5 text-ink">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.img} alt={d.name} loading="lazy" className="absolute inset-0 block size-full object-cover transition-transform duration-900 ease-glide hover:scale-105" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[26px] leading-[1.1] font-bold tracking-[-0.03em]">{d.name}</span>
        <span lang="bn" className="text-[17px] font-medium text-bd-green">{d.bn}</span>
      </div>
      <p className="m-0 text-[16px] leading-normal text-pretty text-muted">{d.blurb}</p>
    </Link>
  );
}

export function StoryCard({ s }: { s: Decorated }) {
  return (
    <Link href={s.href} className="flex flex-col gap-3 text-ink">
      <div className="relative aspect-[16/11] overflow-hidden rounded-[10px] bg-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {s.img && <img src={s.img} alt="" loading="lazy" className="absolute inset-0 block size-full object-cover transition-transform duration-900 ease-glide hover:scale-105" />}
      </div>
      <h3 lang={bnLang(s.title)} className="m-0 text-[22px] leading-[1.1] font-bold tracking-[-0.03em] text-balance">{s.title}</h3>
      <span className="text-[14px] text-muted">{s.placeName} · {s.when} · {s.readTime}</span>
    </Link>
  );
}

// A titled row of cards with a "View all" link, shown at the end of a guide or story.
export function MoreSection({ title, href, linkText, children }: { title: string; href: string; linkText: string; children: React.ReactNode }) {
  return (
    <section className="px-[5vw] pt-24 tablet:pt-32 desktop:pt-40">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-[#e4e4e4] pb-6 tablet:mb-10">
        <h2 className="m-0 text-[clamp(32px,3.4vw,52px)] leading-none font-bold tracking-[-0.04em]">{title}</h2>
        <Link href={href} className="flex items-center gap-2.5 rounded-full border border-[#e2e2e2] px-5.5 py-3.5 text-[15px] font-bold hover:border-ink">
          {linkText}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 tablet:grid-cols-2 desktop:grid-cols-3">{children}</div>
    </section>
  );
}

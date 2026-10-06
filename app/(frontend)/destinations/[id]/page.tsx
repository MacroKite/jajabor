import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import { getDestination, getDestinations } from '@/lib/content';
import type { PhotoCredit } from '@/lib/data';
import { bold } from '@/lib/format';
import RichText, { P } from '@/components/RichText';
import { DestinationCard, MoreSection, StoryCard } from '@/components/Cards';
import { listStories } from '@/lib/db';
import { decorate } from '@/lib/stories';

// Built at deploy time; places added later in the CMS are built on their first visit.
export const generateStaticParams = async () => (await getDestinations()).map(d => ({ id: d.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const d = await getDestination((await params).id);
  if (!d) return {};
  return { title: d.name, description: d.blurb, openGraph: { title: `${d.name} · Jajabor`, description: d.blurb, images: [d.img] } };
}

const H2 = 'm-0 text-[clamp(32px,3.4vw,52px)] leading-none font-bold tracking-[-0.04em]';
const PAIR = 'relative h-[clamp(220px,36vw,560px)] overflow-hidden rounded-[10px] bg-frame';
const IMG = 'absolute inset-0 block size-full object-cover';

// "Photo: photographer, licence", linking to where the photo came from.
function Credit({ c }: { c?: PhotoCredit | null }) {
  if (!c) return null;
  return (
    <figcaption className="text-[12px] leading-snug text-faint">
      Photo: {c.source ? <a href={c.source} target="_blank" rel="noopener noreferrer" className="text-faint underline-offset-2 hover:text-muted hover:underline">{c.text}</a> : c.text}
    </figcaption>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <section className="px-[5vw] pt-14 tablet:pt-20 desktop:pt-30">
      <div className="flex flex-col gap-6">
        <h2 className={H2}>{title}</h2>
        <RichText text={text} />
      </div>
    </section>
  );
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const d = await getDestination((await params).id);
  if (!d) notFound();
  const [g1, g2] = d.gallery;
  const [dests, stories] = await Promise.all([getDestinations(), listStories()]);
  // The next three places in the CMS order, wrapping round, so each guide suggests different ones.
  const i = dests.findIndex(x => x.id === d.id);
  const others = [...dests.slice(i + 1), ...dests.slice(0, i)].slice(0, 3);
  const here = stories.filter(r => r.place === d.id).slice(0, 3).map(r => decorate(r, dests));
  const { headline, intro, notice, sections } = d.article;

  return (
    <div className="overflow-x-clip bg-white">
      <Nav active="destinations" shareHref={'/share?place=' + d.id} />

      <header className="flex flex-col gap-5 px-[5vw] pt-14">
        <div className="flex flex-wrap items-center gap-3 text-[14px] font-medium">
          <Link href="/destinations" className="mb-7 text-muted">← All destinations</Link>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="m-0 text-[clamp(44px,9vw,148px)] leading-[0.92] font-bold tracking-[-0.055em]">{d.name}</h1>
          <span lang="bn" className="font-bangla text-[clamp(28px,3.4vw,52px)] leading-none font-semibold text-bd-green">{d.bn}</span>
        </div>
      </header>

      <figure className="m-0 mt-8 flex flex-col gap-2 px-[5vw] tablet:mt-12 desktop:mt-16">
        <div className="relative aspect-[4/3] tablet:aspect-[16/7] tablet:min-h-80 overflow-hidden rounded-[10px] bg-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={d.img} alt={d.name} className={IMG} />
        </div>
        <Credit c={d.credits?.[0]} />
      </figure>

      {/* The guide is written in Bangla. */}
      <div lang="bn" className="font-bangla">
        <section className="px-[5vw] pt-14 tablet:pt-20 desktop:pt-30">
          <div className="flex flex-col gap-6">
            {headline && <h2 className={H2}>{headline}</h2>}
            <RichText text={intro} />
            {notice && (
              <p className={`${P} rounded-r-[10px] border-l-4 border-[#e8833a] bg-[#fff4e8] px-5 py-4 tablet:px-7 tablet:py-5`}>
                <b className="font-bold text-ink">গুরুত্বপূর্ণ:</b> {bold(notice)}
              </p>
            )}
          </div>
        </section>

        {sections.slice(0, 2).map((s, i) => <Section key={i} title={s.title} text={s.body} />)}

      {d.gallery.length >= 2 && (
        <section className="flex flex-wrap gap-5 px-[5vw] pt-14 tablet:pt-20 desktop:pt-30">
          <figure className="m-0 flex flex-[1_1_260px] flex-col gap-2">
            <div className={PAIR}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g1} alt="" loading="lazy" className={IMG} />
            </div>
            <Credit c={d.credits?.[1]} />
          </figure>
          <figure className="m-0 flex flex-[2_1_460px] flex-col gap-2">
            <div className={PAIR}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g2} alt="" loading="lazy" className={IMG} />
            </div>
            <Credit c={d.credits?.[2]} />
          </figure>
        </section>
      )}

        {sections.slice(2).map((s, i) => <Section key={i + 2} title={s.title} text={s.body} />)}
      </div>

      {here.length > 0 && (
        <MoreSection title={`Stories from ${d.name}`} href={'/stories?place=' + d.id} linkText="View all stories">
          {here.map(r => <StoryCard key={r.id} s={r} />)}
        </MoreSection>
      )}
      <MoreSection title="More destinations" href="/destinations" linkText="View all destinations">
        {others.map(x => <DestinationCard key={x.id} d={x} />)}
      </MoreSection>

    </div>
  );
}

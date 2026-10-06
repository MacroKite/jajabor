import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import { getDestination, getDestinations } from '@/lib/content';
import type { PhotoCredit } from '@/lib/data';

// Built at deploy time; places added later in the CMS are built on their first visit.
export const generateStaticParams = async () => (await getDestinations()).map(d => ({ id: d.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const d = await getDestination((await params).id);
  if (!d) return {};
  return { title: d.name, description: d.blurb, openGraph: { title: `${d.name} · JAJABOR`, description: d.blurb, images: [d.img] } };
}

const H2 = 'm-0 text-[clamp(32px,3.4vw,52px)] leading-none font-bold tracking-[-0.04em]';
const P = 'm-0 text-[17px] tablet:text-[19px] desktop:text-[clamp(20px,1.6vw,23px)] leading-[1.7] text-pretty text-[#2a2a2a]';
const PAIR = 'relative h-[clamp(220px,36vw,560px)] overflow-hidden rounded-[10px] bg-frame';
const IMG = 'absolute inset-0 block size-full object-cover';
const paras = (t: string) => t.split(/\n\s*\n/).filter(Boolean);

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
        {paras(text).map((p, i) => <p key={i} className={P}>{p}</p>)}
      </div>
    </section>
  );
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const d = await getDestination((await params).id);
  if (!d) notFound();
  const [g1, g2] = d.gallery;

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

      <Section title="About the place" text={d.article.about} />
      <Section title="What to eat" text={d.article.food} />

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

      <Section title="Where to stay" text={d.article.stay} />
      <Section title="How to get there" text={d.article.route} />

    </div>
  );
}

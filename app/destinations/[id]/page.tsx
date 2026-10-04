import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { DESTS, byId } from '@/lib/data';

export const dynamicParams = false;
export const generateStaticParams = () => DESTS.map(d => ({ id: d.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const d = byId((await params).id);
  if (!d) return {};
  return { title: d.name, description: d.blurb, openGraph: { title: `${d.name} · TRIP`, description: d.blurb, images: [d.img] } };
}

const H2 = 'm-0 text-[clamp(32px,3.4vw,52px)] leading-none font-bold tracking-[-0.04em]';
const P = 'm-0 text-[clamp(20px,1.6vw,23px)] leading-[1.7] text-pretty text-[#2a2a2a]';
const PAIR = 'relative h-[clamp(320px,36vw,560px)] overflow-hidden rounded-[10px] bg-frame';
const IMG = 'absolute inset-0 block size-full object-cover';
const paras = (t: string) => t.split(/\n\s*\n/).filter(Boolean);

function Section({ title, text }: { title: string; text: string }) {
  return (
    <section className="px-[5vw] pt-30">
      <div className="flex flex-col gap-6">
        <h2 className={H2}>{title}</h2>
        {paras(text).map((p, i) => <p key={i} className={P}>{p}</p>)}
      </div>
    </section>
  );
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const d = byId((await params).id);
  if (!d) notFound();
  const [g1, g2] = d.gallery;

  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <Nav active="destinations" shareHref={'/share?place=' + d.id} />

      <header className="flex flex-col gap-5 px-[5vw] pt-14">
        <div className="flex flex-wrap items-center gap-3 text-[14px] font-medium">
          <Link href="/destinations" className="mb-7 text-muted">← All destinations</Link>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="m-0 text-[clamp(56px,9vw,148px)] leading-[0.92] font-bold tracking-[-0.055em]">{d.name}</h1>
          <span lang="bn" className="font-bangla text-[clamp(28px,3.4vw,52px)] leading-none font-semibold text-bd-green">{d.bn}</span>
        </div>
      </header>

      <section className="mt-16 px-[5vw]">
        <div className="relative aspect-[16/7] min-h-80 overflow-hidden rounded-[10px] bg-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={d.img} alt={d.name} className={IMG} />
        </div>
      </section>

      <Section title="About the place" text={d.article.about} />
      <Section title="What to eat" text={d.article.food} />

      {d.gallery.length >= 2 && (
        <section className="flex flex-wrap gap-5 px-[5vw] pt-30">
          <div className={`flex-[1_1_260px] ${PAIR}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g1} alt="" loading="lazy" className={IMG} />
          </div>
          <div className={`flex-[2_1_460px] ${PAIR}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g2} alt="" loading="lazy" className={IMG} />
          </div>
        </section>
      )}

      <Section title="Where to stay" text={d.article.stay} />
      <Section title="How to get there" text={d.article.route} />

      <Footer />
    </div>
  );
}

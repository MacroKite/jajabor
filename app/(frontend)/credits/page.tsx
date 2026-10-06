import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import { getPhotoCredits } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Photo credits',
  description: 'The photographers whose work appears on Jajabor, and the licences their photos are shared under.',
};

// Every photo on the site with its photographer, licence and source. Most come from Wikimedia
// Commons under Creative Commons licences, which require this attribution.
export default async function Page() {
  const photos = await getPhotoCredits();
  return (
    <div className="overflow-x-clip bg-white">
      <Nav />

      <header className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6 px-[5vw] pt-10 tablet:pt-16 desktop:pt-24">
        <h1 className="m-0 text-[clamp(44px,10vw,160px)] leading-[0.9] font-bold tracking-[-0.055em]">Photo <span className="mesh-word">credits</span></h1>
        <p className="m-0 mb-3.5 max-w-[460px] text-[clamp(17px,1.5vw,20px)] leading-[1.45] text-pretty text-muted">
          Thank you to the photographers who share their work. Most of these photos come from Wikimedia Commons and are used under the licence shown.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-x-8 gap-y-10 px-[5vw] pt-12 tablet:grid-cols-2 tablet:pt-16 desktop:grid-cols-3">
        {photos.map(p => (
          <figure key={p.id} className="m-0 flex flex-col gap-3">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[10px] bg-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.thumb && <img src={p.thumb} alt={p.alt} loading="lazy" className="absolute inset-0 block size-full object-cover" />}
            </div>
            <figcaption className="flex flex-col gap-1">
              <span className="text-[16px] leading-snug font-medium">{p.alt}</span>
              {p.credit && <span className="text-[14px] text-muted">Photo: {p.credit}</span>}
              <span className="text-[13px] text-faint">
                {p.usedOn.join(', ')}
                {p.source && <> · <a href={p.source} target="_blank" rel="noopener noreferrer" className="text-faint underline underline-offset-2 hover:text-muted">Source</a></>}
              </span>
            </figcaption>
          </figure>
        ))}
      </section>
    </div>
  );
}

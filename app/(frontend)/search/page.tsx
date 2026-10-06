import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import SearchForm from '@/components/SearchForm';
import { DestinationCard, MoreSection } from '@/components/Cards';
import { getDestinations } from '@/lib/content';
import { searchDestinations } from '@/lib/search';

type Props = { searchParams: Promise<{ q?: string | string[] }> };
const query = async (p: Props) => {
  const { q } = await p.searchParams;
  return (Array.isArray(q) ? q[0] : q ?? '').trim().slice(0, 100);
};

export async function generateMetadata(p: Props): Promise<Metadata> {
  const q = await query(p);
  return { title: q ? `Search: ${q}` : 'Search', robots: { index: false } };
}

const GRID = 'grid grid-cols-[repeat(auto-fill,minmax(max(300px,calc((100%_-_80px)_/_3)),1fr))] gap-x-6 gap-y-12 tablet:gap-x-10 desktop:gap-y-20';

// Results for the destination search in the home page hero.
export default async function Page(p: Props) {
  const q = await query(p);
  const dests = await getDestinations();
  const results = q ? searchDestinations(dests, q) : [];
  const n = results.length;

  return (
    <div className="overflow-x-clip bg-white">
      <Nav active="destinations" />

      <header className="flex flex-col gap-8 px-[5vw] pt-10 tablet:gap-10 tablet:pt-16 desktop:pt-24">
        <h1 className="m-0 text-[clamp(44px,10vw,160px)] leading-[0.9] font-bold tracking-[-0.055em]">Search <span className="mesh-word">results</span></h1>
        <SearchForm defaultValue={q} autoFocus={!q} />
      </header>

      <div className="mx-[5vw] mt-12 border-b border-[#e4e4e4] pb-7 tablet:mt-16">
        <span className="text-[15px] text-muted">
          {!q ? 'Search by place or district in English or Bangla, like “Sylhet”, “সাজেক” or “সৈকত”.'
            : n ? <>{n} {n === 1 ? 'destination matches' : 'destinations match'} “<b className="font-bold text-ink">{q}</b>”</>
            : <>No destinations match “<b className="font-bold text-ink">{q}</b>”. Check the spelling or try a district name.</>}
        </span>
      </div>

      {n > 0 && (
        <section className={`${GRID} px-[5vw] pt-10`}>
          {results.map(d => <DestinationCard key={d.id} d={d} />)}
        </section>
      )}

      {n === 0 && (
        <MoreSection title={q ? 'You might like' : 'All destinations'} href="/destinations" linkText="View all destinations">
          {(q ? dests.filter(d => d.type === 'popular').slice(0, 3) : dests).map(d => <DestinationCard key={d.id} d={d} />)}
        </MoreSection>
      )}

      {n > 0 && (
        <div className="px-[5vw] pt-16 text-[16px] text-muted">
          Not what you were looking for? <Link href="/destinations" className="font-bold text-ink underline underline-offset-4">Browse all destinations</Link>
        </div>
      )}
    </div>
  );
}

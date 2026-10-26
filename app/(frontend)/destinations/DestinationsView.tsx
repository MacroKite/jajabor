'use client';

import { startTransition, useLayoutEffect, useState, ViewTransition } from 'react';
import Nav from '@/components/Nav';
import { DestinationCard } from '@/components/Cards';
import type { Destination } from '@/lib/data';
import { PageTransition } from '@/components/Transitions';

type Filter = 'all' | 'popular' | 'gem';

export default function DestinationsView({ dests }: { dests: Destination[] }) {
  const [filter, setFilterState] = useState<Filter>('all');
  const [q, setQ] = useState('');
  // A transition, so the grid crossfades to the new filter's places.
  const setFilter = (k: Filter) => {
    startTransition(() => setFilterState(k));
    window.history.replaceState(null, '', k === 'all' ? '/destinations' : '/destinations?filter=' + k);
  };
  // The page is built without the query string, so pick up ?filter= from the URL before the first paint.
  useLayoutEffect(() => {
    const f = new URLSearchParams(window.location.search).get('filter');
    if (f === 'popular' || f === 'gem') setFilterState(f);
  }, []);
  const qq = q.trim().toLowerCase();
  const list = dests.filter(d => (filter === 'all' || d.type === filter) && (!qq || (d.name + ' ' + d.district + ' ' + d.bn).toLowerCase().includes(qq)));
  const tabs: [Filter, string][] = [['all', 'All'], ['popular', 'Popular'], ['gem', 'Hidden gems']];

  return (
    <PageTransition>
      <Nav active="destinations" />

      <header className="flex flex-col gap-7 px-[5vw] pt-10 tablet:pt-16 desktop:pt-22">
        <h1 className="m-0 text-[clamp(44px,10vw,160px)] leading-[0.92] font-bold tracking-[-0.055em]">All <span className="mesh-word">destinations</span></h1>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4 px-[5vw] pt-14 tablet:pt-20 desktop:pt-30">
        <div role="tablist" className="flex flex-wrap gap-1 rounded-full border border-line p-1">
          {tabs.map(([k, label]) => {
            const on = filter === k;
            return (
              <button key={k} role="tab" aria-selected={on} onClick={() => setFilter(k)} className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-3 text-[15px] font-medium transition-colors duration-250 ${on ? 'bg-ink text-paper' : 'bg-transparent text-ink'}`}>
                {label}<span className="text-[13px] opacity-60">{k === 'all' ? dests.length : dests.filter(d => d.type === k).length}</span>
              </button>
            );
          })}
        </div>
        <label className="flex w-full tablet:w-[min(100%,320px)] items-center gap-2.5 rounded-full border border-line px-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>
          <input aria-label="Search places or districts" value={q} onChange={e => setQ(e.target.value)} placeholder="Search places or districts" className="min-w-0 flex-1 bg-transparent py-3.5 text-[15px] text-ink outline-0" />
        </label>
      </div>

      <ViewTransition key={filter} enter="page-in" exit="page-out" default="none">
        <section className="grid grid-cols-[repeat(auto-fill,minmax(max(300px,calc((100%_-_80px)_/_3)),1fr))] gap-x-6 gap-y-12 tablet:gap-x-10 desktop:gap-y-20 px-[5vw] pt-10">
          {list.map(c => <DestinationCard key={c.id} d={c} />)}
        </section>
      </ViewTransition>
      {list.length === 0 && (
        <div className="px-[5vw] pt-10 text-[18px] text-muted">Nothing matches “{q}” yet. <button onClick={() => setQ('')} className="cursor-pointer text-[18px] font-bold text-ink underline underline-offset-4">Clear search</button></div>
      )}

    </PageTransition>
  );
}

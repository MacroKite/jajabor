'use client';

import Link from 'next/link';
import { useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { DESTS } from '@/lib/data';

type Filter = 'all' | 'popular' | 'gem';

export default function DestinationsView({ initialFilter }: { initialFilter: Filter }) {
  const [filter, setFilterState] = useState<Filter>(initialFilter);
  const [q, setQ] = useState('');
  const setFilter = (k: Filter) => {
    setFilterState(k);
    window.history.replaceState(null, '', k === 'all' ? '/destinations' : '/destinations?filter=' + k);
  };
  const qq = q.trim().toLowerCase();
  const list = DESTS.filter(d => (filter === 'all' || d.type === filter) && (!qq || (d.name + ' ' + d.district + ' ' + d.bn).toLowerCase().includes(qq)));
  const tabs: [Filter, string][] = [['all', 'All'], ['popular', 'Popular'], ['gem', 'Hidden gems']];

  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <Nav active="destinations" />

      <header className="flex flex-col gap-7 px-[5vw] pt-22">
        <h1 className="m-0 text-[clamp(56px,10vw,160px)] leading-[0.92] font-bold tracking-[-0.055em]">All <span className="mesh-word">destinations</span></h1>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4 px-[5vw] pt-30">
        <div role="tablist" className="flex flex-wrap gap-1 rounded-full border border-[#e6e6e6] p-1">
          {tabs.map(([k, label]) => {
            const on = filter === k;
            return (
              <button key={k} role="tab" aria-selected={on} onClick={() => setFilter(k)} className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-3 text-[15px] font-medium transition-colors duration-250 ${on ? 'bg-ink text-white' : 'bg-transparent text-ink'}`}>
                {label}<span className="text-[13px] opacity-60">{k === 'all' ? DESTS.length : DESTS.filter(d => d.type === k).length}</span>
              </button>
            );
          })}
        </div>
        <label className="flex w-[min(100%,320px)] items-center gap-2.5 rounded-full border border-[#e6e6e6] px-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" className="shrink-0"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>
          <input aria-label="Search places or districts" value={q} onChange={e => setQ(e.target.value)} placeholder="Search places or districts" className="min-w-0 flex-1 bg-transparent py-3.5 text-[15px] text-ink outline-0" />
        </label>
      </div>

      <section className="grid grid-cols-[repeat(auto-fill,minmax(max(300px,calc((100%_-_80px)_/_3)),1fr))] gap-x-10 gap-y-20 px-[5vw] pt-10">
        {list.map(c => (
          <Link key={c.id} href={'/destinations/' + c.id} className="flex flex-col gap-3.5 text-ink">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={c.name} loading="lazy" className="absolute inset-0 block size-full object-cover transition-transform duration-900 ease-glide hover:scale-105" />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[26px] leading-[1.1] font-bold tracking-[-0.03em]">{c.name}</span>
                <span lang="bn" className="text-[17px] font-medium text-bd-green">{c.bn}</span>
              </div>
            </div>
            <p className="m-0 text-[16px] leading-normal text-pretty text-muted">{c.blurb}</p>
          </Link>
        ))}
      </section>
      {list.length === 0 && (
        <div className="px-[5vw] pt-10 text-[18px] text-muted">Nothing matches “{q}” yet. <button onClick={() => setQ('')} className="cursor-pointer text-[18px] font-bold text-ink underline underline-offset-4">Clear search</button></div>
      )}

      <Footer />
    </div>
  );
}

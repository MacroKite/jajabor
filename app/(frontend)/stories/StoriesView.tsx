'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Nav from '@/components/Nav';
import { findDest, type Destination, type Story } from '@/lib/data';
import { cut, decorate } from '@/lib/stories';
import { bnLang } from '@/lib/format';

const PIN = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5c5c5c" strokeWidth="2"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.5"></circle></svg>;

export default function StoriesView({ stories, dests, initialPlace }: { stories: Story[]; dests: Destination[]; initialPlace: string }) {
  const [place, setPlaceState] = useState(initialPlace);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterEl = useRef<HTMLDivElement>(null);

  const all = stories.map(r => decorate(r, dests));
  const list = place === 'all' ? all : all.filter(r => r.place === place);
  const n = list.length, d = findDest(dests, place);
  const shareHref = '/share' + (place !== 'all' ? '?place=' + place : '');

  const setPlace = (key: string) => {
    setPlaceState(key);
    setFilterOpen(false);
    window.history.replaceState(null, '', key === 'all' ? '/stories' : '/stories?place=' + key);
  };

  useEffect(() => {
    if (!filterOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFilterOpen(false); };
    const onDown = (e: MouseEvent) => { if (filterEl.current && !filterEl.current.contains(e.target as Node)) setFilterOpen(false); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [filterOpen]);

  const options = [{ key: 'all', label: 'All places', count: all.length }, ...dests.map(x => ({ key: x.id, label: x.name, count: all.filter(r => r.place === x.id).length }))];

  return (
    <div className="overflow-x-clip bg-white">
      <Nav active="stories" shareHref={shareHref} />

      <header className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6 px-[5vw] pt-10 tablet:pt-16 desktop:pt-24">
        <h1 className="m-0 text-[clamp(44px,10vw,160px)] leading-[0.9] font-bold tracking-[-0.055em]">All <span className="mesh-word">stories</span></h1>
        <p className="m-0 mb-3.5 max-w-[420px] text-[clamp(18px,1.6vw,22px)] leading-[1.35] font-medium text-pretty">Written by travellers, for the next person who goes.</p>
      </header>

      <div className="mx-[5vw] mt-12 tablet:mt-16 desktop:mt-24 flex flex-wrap items-center justify-between gap-4 border-b border-[#e4e4e4] pt-3.5 pb-7">
        <span className="text-[15px] text-muted">{n + (n === 1 ? ' story' : ' stories') + (d ? ' from ' + d.name : '')}</span>
        <div ref={filterEl} className="relative">
          <button aria-haspopup="listbox" aria-expanded={filterOpen} onClick={() => setFilterOpen(o => !o)} className="flex cursor-pointer items-center gap-2.5 rounded-full border border-[#e2e2e2] bg-white px-4.5 py-[11px] text-[15px] font-medium text-ink hover:border-ink">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.5"></circle></svg>
            {d ? d.name : 'All places'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2.5"><path d="M6 9l6 6 6-6"></path></svg>
          </button>
          {filterOpen && (
            <div role="listbox" className="absolute top-[calc(100%+8px)] right-0 z-20 flex w-[260px] flex-col rounded-[10px] border border-[#e6e6e6] bg-white p-1.5">
              {options.map(o => (
                <button key={o.key} role="option" aria-selected={place === o.key} onClick={() => setPlace(o.key)} className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-[11px] text-left text-[15px] font-medium text-ink hover:bg-[#f4f4f4] ${place === o.key ? 'bg-[#f4f4f4]' : 'bg-white'}`}>
                  {o.label}<span className="text-[13px] text-faint">{o.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="px-[5vw]">
        <div className="flex flex-col">
          {list.map(r => (
            <Link key={r.id} href={r.href} className="flex cursor-pointer flex-wrap items-stretch gap-x-8 gap-y-6 border-b border-[#e4e4e4] py-8 text-ink tablet:py-14 last:border-b-0">
              <div className="relative aspect-[16/11] min-w-[220px] flex-[1_1_100%] tablet:flex-[0_1_320px] self-start overflow-hidden rounded-[10px] bg-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {r.img && <img src={r.img} alt="" loading="lazy" className="absolute inset-0 block size-full object-cover transition-transform duration-900 ease-glide hover:scale-105" />}
              </div>
              <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <h2 lang={bnLang(r.title)} className="m-0 text-[clamp(26px,2.4vw,36px)] leading-[1.02] font-bold tracking-[-0.045em] text-balance">{r.title}</h2>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F42A41" strokeWidth="1.6" className="mt-0.5 shrink-0"><path d="M7 17L17 7M9 7h8v8"></path></svg>
                </div>
                <p className="m-0 line-clamp-2 max-w-[640px] text-[16px] leading-[1.55] text-[#3a3a3a]">{cut(r.excerpt, 150)}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 text-[16px] text-muted">
                  <span className="font-bold text-ink">{r.name}</span>
                  <span className="flex items-center gap-1.5">{PIN}{r.placeName}</span>
                  <span>{r.when}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {n === 0 && (
        <div className="mx-[5vw] flex flex-wrap items-center justify-between gap-4 rounded-[10px] border-2 border-dashed border-[#e4e4e4] p-12 text-[18px] text-muted">No stories from {d ? d.name : 'this place'} yet.<Link href={shareHref} className="cursor-pointer rounded-[10px] bg-ink px-5.5 py-3.5 text-[15px] font-bold text-white">Write the first one</Link></div>
      )}

    </div>
  );
}

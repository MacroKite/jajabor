'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Nav from '@/components/Nav';
import type { Destination, Story } from '@/lib/data';
import type { HomeContent } from '@/lib/content';
import { cut, decorate } from '@/lib/stories';

// Where the floating photos sit around the “Most loved destinations” heading; the photos come from the CMS.
type Thumb = { img: string; left: string; top: string; w: string; ar: string; sp: number; d: number };
const THUMB_SLOTS: Omit<Thumb, 'img'>[] = [
  { left: '13%', top: '32%', w: 'clamp(120px,12vw,210px)', ar: '3/4', sp: 0.9, d: 0 },
  { left: '24%', top: '74%', w: 'clamp(90px,8.5vw,150px)', ar: '1/1', sp: 1.3, d: 0.12 },
  { left: '87%', top: '32%', w: 'clamp(120px,12vw,210px)', ar: '3/4', sp: 0.9, d: 0.06 },
  { left: '76%', top: '74%', w: 'clamp(90px,8.5vw,150px)', ar: '1/1', sp: 1.3, d: 0.18 },
  { left: '50%', top: '15%', w: 'clamp(80px,7vw,120px)', ar: '4/3', sp: 0.6, d: 0.24 },
];

// Where the photo sits in each layout (top, right, bottom, left); the intro's clip shrinks onto it.
// Phone and tablet stack title, photo and text; desktop puts the photo on the right.
const PHOTO_RECT = { stacked: [22, 5, 38, 5], side: [12, 5, 18, 33] } as const;

// Scroll-driven sequence: intro headline blurs in and out, then places advance with progress t (in viewport heights).
function sequence(t: number, items: Destination[], thumbs: Thumb[], slow = false, stacked = false) {
  const X = 1, D = slow ? 1.1 : 0, te = t - D;
  const cl = (x: number) => Math.max(0, Math.min(1, x)), ez = (x: number) => 1 - Math.pow(1 - x, 3);
  const n = items.length, idx = Math.max(0, Math.min(n - 1, Math.floor((te - 1 - 0.5 * X) / 0.9)));
  const aOut = ez(cl((te - 1) / (0.3 * X)));
  const line = (m: number) => {
    const aIn = ez(cl((t + 0.9 - (m - 1) * 0.15) / 0.8));
    return { op: aIn * (1 - aOut), blur: ((1 - aIn) * 24 + aOut * 20).toFixed(1) + 'px', scale: ((1.1 - 0.1 * aIn) * (1 - 0.2 * aOut)).toFixed(4), y: ((1 - aIn) * 40).toFixed(1) + 'px' };
  };
  const k = ez(cl((te - 1) / (0.4 * X)));
  const p = ez(cl((t - 0.05) / (slow ? 1.43 : 0.65)));
  return {
    l1: line(1), l2: line(2),
    grClip: (([a, b, c, d]) => `inset(${k * a}vh ${k * b}vw ${k * c}vh ${k * d}vw round ${k * 10}px)`)(PHOTO_RECT[stacked ? 'stacked' : 'side']),
    grOp: 1 - cl((te - 1 - 0.35 * X) / (0.15 * X)),
    thumbs: thumbs.map(th => {
      const aIn = ez(cl((t + 0.9 - th.d) / 0.8));
      return { ...th, op: aIn * (1 - aOut), blur: ((1 - aIn) * 14 + aOut * 12).toFixed(1) + 'px', ty: ((1 - aIn) * 80 - t * 60 * th.sp).toFixed(1) + 'px', sc: (0.9 + 0.1 * aIn - 0.15 * aOut).toFixed(3) };
    }),
    selW: `calc((100% + 0.6em) * ${p.toFixed(4)})`, selH: `calc((100% + 0.5em) * ${p.toFixed(4)})`,
    selOp: cl(t / 0.08) * (1 - aOut), hOp: p > 0.985 ? 1 - aOut : 0,
    list: items.map((it, i) => {
      const w = it.name.split(' ');
      return { ...it, line1: w[0], line2: w.slice(1).join(' '), on: i === idx, ty: i === idx ? 'translate-y-0' : i < idx ? '-translate-y-[30px]' : 'translate-y-[30px]' };
    }),
  };
}
type Seq = ReturnType<typeof sequence>;


const LINE = 'transition-[opacity,filter,transform] duration-300 ease-out';
const PILL = 'flex items-center gap-2.5 rounded-full bg-ink px-5.5 py-3.5 text-[15px] font-bold text-white transition-colors duration-250 hover:bg-bd-green hover:text-white';
const BIG = 'absolute inset-0 flex items-center justify-center text-center text-[clamp(40px,10vw,180px)] leading-[0.92] font-bold tracking-[-0.055em] text-ink';
const BIG_WORD = 'text-mesh inline-block px-[0.04em] pb-[0.16em] -mb-[0.1em]';
const COVER = 'pointer-events-none absolute inset-0 overflow-hidden bg-white [transition:clip-path_0.25s_ease-out,opacity_0.3s_linear]';
const Arrow = ({ c = '#fff' }: { c?: string }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>;
const PIN = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.5"></circle></svg>;
// Story card width per layout, shared by the cards and the track's slide distance.
const CARD_W = '[--card-w:88vw] tablet:[--card-w:78vw] desktop:[--card-w:min(78vw,1080px)]';
const DOTS = ['left-[6.67%] top-[26.1%]', 'left-[93.33%] top-[26.1%]', 'left-[20.83%] top-[73.9%]', 'left-[79.17%] top-[73.9%]'];
const HANDLES = ['-left-[5px] -top-[5px]', '-right-[5px] -top-[5px]', '-left-[5px] -bottom-[5px]', '-right-[5px] -bottom-[5px]'];

// Renders **double-starred** words in bold.
const bold = (t: string) => t.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <b key={i} className="font-bold text-ink">{part}</b> : part));

export default function HomeView({ stories, dests, home, faqs }: { stories: Story[]; dests: Destination[]; home: HomeContent; faqs: { q: string; a: string }[] }) {
  const popular = dests.filter(d => d.type === 'popular');
  const gems = dests.filter(d => d.type === 'gem');
  const thumbs: Thumb[] = home.introPhotos.slice(0, THUMB_SLOTS.length).map((img, i) => ({ ...THUMB_SLOTS[i], img }));
  const [t, setT] = useState(-1);
  const [tg, setTg] = useState(-1);
  const [query, setQuery] = useState('');
  const [hs, setHs] = useState(0);
  const [faq, setFaq] = useState(0);
  const [stacked, setStacked] = useState(false);
  const lovedEl = useRef<HTMLElement>(null);
  const gemsEl = useRef<HTMLElement>(null);
  const swipeX = useRef<number | null>(null);

  // Phone and tablet use the stacked place layout; keep the intro clip in step with it.
  useEffect(() => {
    const mq = window.matchMedia('(width < 64rem)');
    const on = () => setStacked(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const vh = window.innerHeight;
      if (lovedEl.current) { const v = -lovedEl.current.getBoundingClientRect().top / vh; setT(o => (Math.abs(v - o) > 0.004 ? v : o)); }
      if (gemsEl.current) { const v = -gemsEl.current.getBoundingClientRect().top / vh; setTg(o => (Math.abs(v - o) > 0.004 ? v : o)); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const to = setTimeout(onScroll, 50);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); clearTimeout(to); cancelAnimationFrame(raf); };
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById('popular');
    if (!el) return;
    const q = query.trim().toLowerCase();
    const match = q ? popular.findIndex(p => (p.name + ' ' + p.district + ' ' + p.bn).toLowerCase().includes(q)) : -1;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (1.7 + Math.max(0, match) * 0.9) * window.innerHeight, behavior: 'smooth' });
  };

  const loved = sequence(t, popular, thumbs, false, stacked);
  const gs = sequence(tg, gems, [], true, stacked);
  const latest = stories.map(r => decorate(r, dests));
  const newest = latest[0]; // stories arrive newest first
  const hi = Math.min(hs, Math.max(0, latest.length - 1));

  const places = (s: Seq) => (
    <>
      <div className="absolute inset-x-[5vw] top-[22vh] bottom-[38vh] overflow-hidden rounded-[10px] bg-ink desktop:top-[12vh] desktop:bottom-[18vh] desktop:left-[33vw]">
        {s.list.map(d => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={d.id} src={d.img} alt={d.on ? d.name : ''} className={`absolute inset-0 size-full object-cover [transition:opacity_0.8s_ease,scale_1.6s_var(--ease-glide)] ${d.on ? 'scale-100 opacity-100' : 'scale-[1.08] opacity-0'}`} />
        ))}
      </div>
      {s.list.map(d => (
        <div key={d.id}>
          <div className={`pointer-events-none absolute top-[11vh] left-[5vw] [transition:opacity_0.6s_ease,translate_0.8s_var(--ease-glide)] desktop:top-[17vh] ${d.ty} ${d.on ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="m-0 text-[34px] leading-[0.95] font-bold tracking-[-0.045em] wrap-break-word text-ink tablet:text-[56px] desktop:w-[25vw] desktop:text-[clamp(34px,4.2vw,80px)]">{d.line1}<br />{d.line2}</h3>
          </div>
          <div aria-hidden={!d.on} className={`absolute top-[65vh] right-[5vw] left-[5vw] flex max-w-[560px] flex-col gap-1.5 text-[14px] leading-[1.45] text-ink [transition:opacity_0.6s_ease] desktop:top-auto desktop:right-auto desktop:bottom-[18vh] desktop:w-[24vw] desktop:min-w-[200px] ${d.on ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
            <span lang="bn" className="mb-1 font-bangla text-[20px] font-semibold text-bd-green tablet:mb-2 tablet:text-[24px]">{d.bn}</span>
            <span className="text-[16px] leading-normal text-pretty text-[#3a3a3a]">{d.blurb}</span>
            <Link href={'/destinations/' + d.id} tabIndex={d.on ? 0 : -1} className={`${PILL} mt-3 self-start tablet:mt-5`}>Read the guide <Arrow /></Link>
          </div>
        </div>
      ))}
      <div className="absolute right-[5vw] bottom-[3vh] left-[5vw] flex items-center justify-between text-[13px] font-medium text-ink desktop:bottom-[5vh]">
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5">
          {s.list.map(d => <span key={d.id} className={`h-1 rounded-[4px] [transition:all_0.4s_ease] ${d.on ? 'w-7 bg-ink' : 'w-2 bg-[#d9d9d9]'}`}></span>)}
        </div>
      </div>
    </>
  );
  // Scroll-driven values change every frame, so they stay inline.
  const lineStyle = (l: Seq['l1']) => ({ opacity: l.op, filter: `blur(${l.blur})`, transform: `scale(${l.scale}) translateY(${l.y})` });
  const cover = (s: Seq) => ({ clipPath: s.grClip, opacity: s.grOp });

  return (
    <div className="overflow-x-clip bg-white">
      <Nav home />

      <header id="top" className="mx-auto flex max-w-[1360px] flex-col items-center px-[5vw] pt-10 text-center tablet:px-8 tablet:pt-16 desktop:pt-18">
        <h1 className="m-0 text-[clamp(40px,8.5vw,128px)] leading-[0.95] font-bold tracking-[-0.045em] text-balance">Know <span className="text-mesh pb-[0.06em]">Bangladesh</span><br />before you go.</h1>
        <p className="mt-5 mb-0 max-w-[520px] text-[16px] leading-normal text-pretty text-muted tablet:mt-7 tablet:text-[19px]">{home.heroSubtitle}</p>
        <form role="search" onSubmit={onSearch} className="mt-8 flex w-full max-w-[760px] items-center gap-2 rounded-full border border-[#e6e6e6] bg-white py-1.5 pr-1.5 pl-5 tablet:mt-11 tablet:gap-3 tablet:py-2.5 tablet:pr-2.5 tablet:pl-8">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" className="size-5 shrink-0 tablet:size-[22px]"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>
          <input aria-label="Search your destination" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a destination" className="min-w-0 flex-1 bg-transparent py-3 text-[16px] text-ink outline-0 tablet:py-3.5 tablet:text-[20px]" />
          <button type="submit" className="shrink-0 cursor-pointer rounded-full bg-bd-green px-5 py-3.5 text-[15px] font-bold text-white hover:bg-[#00573f] tablet:px-9 tablet:py-5 tablet:text-[17px]">Search</button>
        </form>
      </header>

      {/* Phone: 2 columns, first 9 photos. Tablet: 4 columns. Desktop: 6 columns, one screen tall. */}
      <section className="mt-10 grid w-full auto-rows-[130px] grid-flow-dense grid-cols-2 gap-1 p-1 tablet:mt-14 tablet:h-screen tablet:min-h-[560px] tablet:grid-cols-4 tablet:grid-rows-6 desktop:mt-18 desktop:grid-cols-6 desktop:grid-rows-4">
        {home.mosaic.map(({ img, label, wide, tall }, i) => (
          <div key={i} className={`relative cursor-pointer overflow-hidden rounded-md bg-ink ${wide ? 'col-span-2' : 'col-span-1'} ${tall ? 'row-span-2' : 'row-span-1'} ${i >= 9 ? 'hidden tablet:block' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={label} loading="lazy" className="absolute inset-0 block size-full object-cover" />
            <div className="absolute inset-0 bg-[rgba(12,12,12,0.55)] [transition:background_0.35s_ease] hover:bg-[rgba(12,12,12,0)]"></div>
            <span className="pointer-events-none absolute bottom-2.5 left-3 text-[14px] font-bold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">{label}</span>
          </div>
        ))}
      </section>

      <section id="about" className="relative mt-16 w-full scroll-mt-24 overflow-hidden tablet:mt-24 tablet:h-[920px] desktop:mt-[140px]">
        <svg viewBox="0 0 1200 920" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden size-full tablet:block" fill="none" stroke="#141414" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="6 8">
          <path vectorEffect="non-scaling-stroke" d="M0 150 H60 Q80 150 80 170 V210 Q80 230 100 230 H250"></path>
          <path vectorEffect="non-scaling-stroke" d="M0 330 H60 Q80 330 80 310 V270 Q80 250 100 250 H250"></path>
          <path vectorEffect="non-scaling-stroke" d="M300 250 Q280 250 280 270 V380 Q280 400 260 400 H190 Q170 400 170 420 V560 Q170 580 190 580 H230 Q250 580 250 600 V680"></path>
          <path vectorEffect="non-scaling-stroke" d="M0 900 H170 Q190 900 190 880 V700 Q190 680 210 680 H300 Q320 680 320 660 V540 Q320 520 340 520 H580 Q600 520 600 500 V488"></path>
          <path vectorEffect="non-scaling-stroke" d="M1200 150 H1140 Q1120 150 1120 170 V210 Q1120 230 1100 230 H950"></path>
          <path vectorEffect="non-scaling-stroke" d="M1200 330 H1140 Q1120 330 1120 310 V270 Q1120 250 1100 250 H950"></path>
          <path vectorEffect="non-scaling-stroke" d="M900 250 Q920 250 920 270 V380 Q920 400 940 400 H1010 Q1030 400 1030 420 V560 Q1030 580 1010 580 H970 Q950 580 950 600 V680"></path>
          <path vectorEffect="non-scaling-stroke" d="M1200 900 H1030 Q1010 900 1010 880 V700 Q1010 680 990 680 H900 Q880 680 880 660 V540 Q880 520 860 520 H620 Q600 520 600 500"></path>
        </svg>
        {DOTS.map(pos => <span key={pos} className={`absolute -mt-[5px] -ml-[5px] hidden size-2.5 rounded-full bg-ink tablet:block ${pos}`}></span>)}
        <div className="relative flex flex-col items-center px-[5vw] text-center tablet:px-6 tablet:pt-20">
          <h2 className="m-0 max-w-[900px] text-[clamp(32px,6vw,84px)] leading-[1.02] font-medium tracking-[-0.045em]">Stop digging <span aria-label="Facebook" className="mx-[0.04em] -mt-[0.12em] inline-flex h-[0.78em] w-[1.6em] items-center justify-center rounded-full bg-frame align-middle"><span className="translate-y-[0.04em] font-[family-name:Arial,Helvetica,sans-serif] text-[0.62em] leading-none font-black tracking-[0] text-[#1877F2]">f</span></span> through<br />old Facebook posts</h2>
          <p className="mt-5 mb-0 max-w-[440px] text-[16px] tablet:mt-6 tablet:text-[18px] leading-normal text-pretty text-[#6b6b6b]">{bold(home.introText)}</p>
          <Link href="/stories" className={`${PILL} mt-7`}>Browse all stories <Arrow /></Link>
          {newest && (
            <div className="relative mt-8 aspect-[16/10.5] w-[min(100%,460px)] tablet:mt-11 overflow-hidden rounded-[10px] bg-ink text-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {newest.img && <img src={newest.img} alt={newest.title} className="absolute inset-0 size-full object-cover" />}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_40%,rgba(0,0,0,0.7)_100%)]"></div>
              <Link href={newest.href} className="absolute top-3.5 right-3.5 rounded-full bg-white/85 px-3.5 py-2 text-[13px] font-medium text-ink backdrop-blur-[8px]">Read story →</Link>
              <div className="absolute right-5 bottom-4.5 left-5 text-white">
                <div className="line-clamp-2 text-[21px] font-medium tracking-[-0.02em]">{newest.title}</div>
                <div className="mt-1.5 truncate text-[13px] opacity-85">A story by {newest.name} · {newest.readTime}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="popular" ref={lovedEl} className="relative mt-[140px] h-[700vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-white">
          {places(loved)}
          <div aria-hidden="true" className={COVER} style={cover(loved)}>
            {loved.thumbs.map(th => (
              <div key={th.img} className="absolute overflow-hidden rounded-lg bg-frame transition-[opacity,filter,transform] duration-300 ease-out" style={{ left: th.left, top: th.top, width: th.w, aspectRatio: th.ar, opacity: th.op, filter: `blur(${th.blur})`, transform: `translate(-50%,-50%) translateY(${th.ty}) rotate(0deg) scale(${th.sc})` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={th.img} alt="" className="block size-full object-cover" />
              </div>
            ))}
            <div className={BIG}>
              <div>
                <div className={LINE} style={lineStyle(loved.l1)}>Most loved</div>
                <div className={LINE} style={lineStyle(loved.l2)}><span className={BIG_WORD}>destinations</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gems" ref={gemsEl} className="relative h-[730vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-white">
          {places(gs)}
          <div aria-hidden="true" className={COVER} style={cover(gs)}>
            <div className={BIG}>
              <div className="relative px-[0.1em] pb-[0.22em]">
                <div className="pointer-events-none absolute -top-[0.28em] -left-[0.3em] border-[1.5px] border-bd-green bg-[rgba(0,106,78,0.05)] transition-opacity duration-300 ease-out" style={{ width: gs.selW, height: gs.selH, opacity: gs.selOp }}>
                  <div className="pointer-events-none absolute top-full left-full z-2 -mt-1 -ml-1 size-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                    <svg width="28" height="28" viewBox="0 0 24 24"><path d="M4 2 L4 20 L9 15.5 L12.5 22 L15.5 20.5 L12 14 L19 14 Z" fill="#141414" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"></path></svg>
                  </div>
                  {HANDLES.map(pos => (
                    <span key={pos} className={`absolute size-[9px] border-[1.5px] border-bd-green bg-white transition-opacity duration-200 ${pos}`} style={{ opacity: gs.hOp }}></span>
                  ))}
                </div>
                <div className={LINE} style={lineStyle(gs.l1)}>Hidden</div>
                <div className={LINE} style={lineStyle(gs.l2)}><span className={BIG_WORD}>gems</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="w-full overflow-hidden pt-24 tablet:pt-32 desktop:pt-[200px]">
        <div className="mb-8 flex tablet:mb-12 flex-wrap items-end justify-between gap-6 px-[5vw]">
          <h2 className="m-0 text-[clamp(36px,6vw,88px)] leading-[0.95] font-bold tracking-[-0.045em]">Stories</h2>
          <Link href="/stories" className="flex items-center gap-2.5 rounded-full border border-[#e2e2e2] px-5.5 py-3.5 text-[15px] font-bold hover:border-ink">All stories <Arrow c="#141414" /></Link>
        </div>
        <div className="px-[5vw]">
          <div
            className={`flex touch-pan-y gap-6 transition-transform duration-1000 ease-swing will-change-transform ${CARD_W}`}
            style={{ transform: `translateX(calc(${-hi} * (var(--card-w) + 24px)))` }}
            onTouchStart={e => { swipeX.current = e.touches[0].clientX; }}
            onTouchEnd={e => {
              if (swipeX.current === null) return;
              const dx = e.changedTouches[0].clientX - swipeX.current;
              swipeX.current = null;
              if (Math.abs(dx) > 50) setHs(Math.max(0, Math.min(latest.length - 1, hi + (dx < 0 ? 1 : -1))));
            }}
          >
            {latest.map((r, k) => {
              const on = k === hi, d = k - hi;
              return (
                <article key={r.id} onClick={() => { if (!on) setHs(k); }} className={`flex flex-[0_0_var(--card-w)] origin-left flex-wrap gap-x-10 gap-y-5 tablet:gap-y-7 overflow-hidden rounded-[10px] bg-[#f8f8f7] p-[clamp(20px,2.4vw,36px)] [transition:opacity_1s_var(--ease-swing),scale_1s_var(--ease-swing)] ${on ? 'scale-100 cursor-default opacity-100' : 'scale-[0.94] cursor-pointer opacity-55'}`}>
                  <div className="relative aspect-[4/3] flex-[1.5_1_360px] overflow-hidden rounded-md bg-[#eeeeec]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {r.img && <img src={r.img} alt="" loading="lazy" className={`absolute inset-0 block size-full object-cover [transition:scale_1.4s_var(--ease-swing),translate_1.4s_var(--ease-swing)] ${on ? 'translate-x-0 scale-100' : d > 0 ? '-translate-x-[6%] scale-[1.15]' : 'translate-x-[6%] scale-[1.15]'}`} />}
                  </div>
                  <div aria-hidden={!on} className={`flex min-w-0 flex-[1_1_260px] flex-col gap-3 tablet:gap-4.5 ${on ? 'translate-y-0 opacity-100 [transition:opacity_0.7s_ease_0.35s,translate_0.9s_var(--ease-swing)_0.35s]' : 'translate-y-6 opacity-0 [transition:opacity_0.7s_ease,translate_0.9s_var(--ease-swing)]'}`}>
                    <div className="mb-1 flex tablet:mb-3.5 flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] text-muted">
                      <span className="font-bold text-ink">{r.name}</span>
                      <span className="flex items-center gap-1.5">{PIN}{r.placeName}</span>
                      <span>{r.when}</span>
                    </div>
                    <h3 className="m-0 text-[clamp(26px,2.4vw,38px)] leading-[1.08] font-medium tracking-[-0.035em] text-balance">{r.title}</h3>
                    <p className="m-0 line-clamp-3 tablet:line-clamp-5 text-[16px] leading-[1.6] text-muted">{cut(r.excerpt, 300)}</p>
                    <div className="mt-auto flex flex-col">
                      <Link href={r.href} tabIndex={on ? 0 : -1} className={`${PILL} self-start`}>Read story <Arrow /></Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-6 flex tablet:mt-9 flex-wrap items-center gap-x-8 gap-y-6">
            <div className="flex gap-3">
              <button onClick={() => setHs(Math.max(0, hi - 1))} aria-label="Previous story" className={`flex size-12 cursor-pointer tablet:size-15 items-center justify-center rounded-full border-[1.5px] border-ink bg-white [transition:opacity_0.3s,background-color_0.25s,translate_0.25s] hover:-translate-x-0.5 hover:bg-frame ${hi === 0 ? 'opacity-30' : 'opacity-100'}`}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg></button>
              <button onClick={() => setHs(Math.min(latest.length - 1, hi + 1))} aria-label="Next story" className={`flex size-12 cursor-pointer tablet:size-15 items-center justify-center rounded-full bg-ink [transition:opacity_0.3s,background-color_0.25s,translate_0.25s] hover:translate-x-0.5 hover:bg-bd-green ${hi >= latest.length - 1 ? 'opacity-30' : 'opacity-100'}`}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="flex w-full flex-col items-center bg-white px-[5vw] pt-24 tablet:pt-32 desktop:pt-[220px]">
        <span className="text-[13px] font-bold tracking-[0.14em] text-ink uppercase">Good to know</span>
        <h2 className="mt-4.5 mb-0 text-center text-[clamp(34px,5.4vw,80px)] leading-none font-medium tracking-[-0.045em]">Frequently<br />asked questions</h2>
        <div className="mt-10 flex tablet:mt-14 w-full max-w-[820px] flex-col gap-2.5">
          {faqs.map((f, i) => {
            const open = faq === i;
            return (
              <div key={f.q} className={`overflow-hidden rounded-[22px] border [transition:background-color_0.35s_ease,border-color_0.35s_ease] ${open ? 'border-[#e6e6e4] bg-white' : 'border-[#f5f5f4] bg-[#f5f5f4]'}`}>
                <button aria-expanded={open} onClick={() => setFaq(open ? -1 : i)} className="flex w-full cursor-pointer items-center justify-between gap-4 bg-transparent py-3 pr-3 pl-5 tablet:pl-7 text-left text-ink">
                  <span className="py-2.5 text-[clamp(17px,1.4vw,19px)] font-medium tracking-[-0.01em]">{f.q}</span>
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-full [transition:background-color_0.35s_ease] ${open ? 'bg-[#f2f2f0]' : 'bg-white'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" strokeLinecap="round" className={`transition-transform duration-400 ease-glide ${open ? 'rotate-45' : 'rotate-0'}`}><path d="M12 5v14M5 12h14"></path></svg>
                  </span>
                </button>
                <div className={`grid [transition:grid-template-rows_0.45s_var(--ease-glide)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="m-0 pt-0 pr-6 pb-6.5 pl-5 tablet:pr-21 tablet:pl-7 text-[16px] leading-[1.65] text-pretty text-muted">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

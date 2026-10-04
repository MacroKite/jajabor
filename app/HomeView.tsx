'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { W, type Story } from '@/lib/data';
import { cut, decorate } from '@/lib/stories';

type Item = { id: string; name: string; bn: string; blurb: string; region?: string; img: string };

const POPULAR: Item[] = [
  { id: 'coxs-bazar', blurb: 'The longest natural sea beach in the world, with 120 km of sand along the Bay of Bengal.', name: "Cox's Bazar", bn: 'কক্সবাজার', region: 'Chattogram · 120 km beach', img: W("Cox's_Bazar_sea_beach.jpg") },
  { id: 'sajek', blurb: 'A hilltop village in Rangamati where the clouds drift below you at dawn.', name: 'Sajek Valley', bn: 'সাজেক ভ্যালি', region: 'Rangamati · above the clouds', img: W('Sajek_Valley_Bangladesh.jpg') },
  { id: 'sundarbans', blurb: 'The largest mangrove forest on earth, and home of the Royal Bengal tiger.', name: 'Sundarbans', bn: 'সুন্দরবন', region: 'Khulna · mangrove forest', img: W('Sundarbans_river.jpg') },
  { id: 'srimangal', blurb: 'The tea capital of Bangladesh, with rolling gardens and the Lawachara rainforest.', name: 'Srimangal', bn: 'শ্রীমঙ্গল', region: 'Moulvibazar · tea country', img: W('Srimangal_Tea_garden.jpg') },
  { id: 'saint-martins', blurb: "Bangladesh's only coral island, with clear blue water and quiet nights.", name: "Saint Martin's", bn: 'সেন্টমার্টিন', region: 'Teknaf · coral island', img: W("Saint_Martin's_Island.JPG") },
];
const GEMS: Item[] = [
  { id: 'ratargul', blurb: 'A freshwater swamp forest you explore by small boat during the monsoon.', name: 'Ratargul', bn: 'রাতারগুল', img: W('Ratargul_0315.jpg') },
  { id: 'chera-dwip', blurb: "The country's southernmost tip. Coral rocks and open sea, reachable at low tide.", name: 'Chera Dwip', bn: 'ছেঁড়া দ্বীপ', img: W('St_Martin_Island_Chera_Dwip.JPG') },
  { id: 'nilgiri', blurb: 'One of the highest points in Bandarban, where clouds touch the hilltop.', name: 'Nilgiri', bn: 'নীলগিরি', img: W('Nilgiri,_Bandarban,_Bangladesh_20.jpg') },
  { id: 'madhabpur', blurb: 'A quiet lake hidden among tea hills, covered in blue water lilies in summer.', name: 'Madhabpur Lake', bn: 'মাধবপুর লেক', img: W('Nymphaea_nouchali,_Madhabpur_Tea_Garden,_Srimangal.jpg') },
];
const FAQS = [
  { q: 'Who runs TRIP?', a: 'TRIP is a nonprofit run by volunteers. We don’t sell trips, take bookings or earn commissions.' },
  { q: 'Where do the costs come from?', a: 'Recent traveller reports and local operators, checked weekly and shown in Taka.' },
  { q: 'Can I write for TRIP?', a: 'Yes. Anyone can share a travel story. Tell it honestly and include what you spent; it helps the next person most.' },
  { q: 'When is the best time to travel?', a: 'October to March for most places. Monsoon (June–September) is best for haors, waterfalls and tea gardens.' },
  { q: 'Do I need permits?', a: 'Some places do — like the Sundarbans and parts of Bandarban. Each guide lists what you need.' },
];
const MOSAIC: [string, string, number, number][] = [
  ["A_dusk_at_Cox's_Bazar_sea_beach.jpg", "Cox's Bazar", 2, 1],
  ['Sajek_Valley_01.jpg', 'Sajek', 1, 1],
  ['Ratargul_Swamp_Forest,_Sylhet..jpg', 'Ratargul', 1, 1],
  ['Blue_waters_of_Saint_Martin_Island_,_Bangladesh.jpg', "Saint Martin's", 1, 2],
  ['Boat,_trees_and_water_in_Sundarbans.jpg', 'Sundarbans', 1, 1],
  ['Tea_Garden_Srimongol_Sylhet_Bangladesh_2.JPG', 'Srimangal', 1, 1],
  ['Nilgiri,_Bandarban,_Bangladesh_20.jpg', 'Nilgiri', 1, 1],
  ["Cox's_Bazar_sea_beach.jpg", 'Inani', 2, 1],
  ['Sajek_Valley_Bangladesh.jpg', 'Ruilui Para', 1, 1],
  ['Sundarbans_river.jpg', 'Katka', 1, 2],
  ['Srimangal_Tea_garden.jpg', 'Lawachara', 1, 1],
  ["Saint_Martin's_Island.JPG", 'Chera Dwip', 1, 1],
  ['Ratargul_0315.jpg', 'Gowainghat', 2, 1],
  ['Nymphaea_nouchali,_Madhabpur_Tea_Garden,_Srimangal.jpg', 'Madhabpur Lake', 1, 1],
  ['Runmoy,_Sajek_Valley_04.jpg', 'Konglak Hill', 1, 1],
  ['River_in_Sundarban.jpg', 'Mongla', 1, 1],
  ['Amazing_evening_view_of_Saint_Martin_Island,_Bangladesh.jpg', 'Teknaf', 2, 1],
  ["Cox's_Bazar_sea_beach--In_between_day_and_night.jpg", 'Himchari', 1, 1],
];

type Thumb = { img: string; left: string; top: string; w: string; ar: string; sp: number; d: number };
const THUMBS_P: Thumb[] = [
  { img: W("Blue_waters_of_Saint_Martin_Island_,_Bangladesh.jpg", 600), left: '13%', top: '32%', w: 'clamp(120px,12vw,210px)', ar: '3/4', sp: 0.9, d: 0 },
  { img: W('Ratargul_0315.jpg', 600), left: '24%', top: '74%', w: 'clamp(90px,8.5vw,150px)', ar: '1/1', sp: 1.3, d: 0.12 },
  { img: W('Sajek_Valley_01.jpg', 600), left: '87%', top: '32%', w: 'clamp(120px,12vw,210px)', ar: '3/4', sp: 0.9, d: 0.06 },
  { img: W('Tea_Garden_Srimongol_Sylhet_Bangladesh_2.JPG', 600), left: '76%', top: '74%', w: 'clamp(90px,8.5vw,150px)', ar: '1/1', sp: 1.3, d: 0.18 },
  { img: W("A_dusk_at_Cox's_Bazar_sea_beach.jpg", 600), left: '50%', top: '15%', w: 'clamp(80px,7vw,120px)', ar: '4/3', sp: 0.6, d: 0.24 },
];

// Scroll-driven sequence: intro headline blurs in and out, then places advance with progress t (in viewport heights).
function sequence(t: number, items: Item[], thumbs: Thumb[], slow = false) {
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
    grClip: `inset(${k * 12}vh ${k * 5}vw ${k * 18}vh ${k * 33}vw round ${k * 10}px)`,
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
const BIG = 'absolute inset-0 flex items-center justify-center text-center text-[clamp(56px,10vw,180px)] leading-[0.92] font-bold tracking-[-0.055em] text-ink';
const BIG_WORD = 'text-mesh inline-block px-[0.04em] pb-[0.16em] -mb-[0.1em]';
const COVER = 'pointer-events-none absolute inset-0 overflow-hidden bg-white [transition:clip-path_0.25s_ease-out,opacity_0.3s_linear]';
const Arrow = ({ c = '#fff' }: { c?: string }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>;
const PIN = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.5"></circle></svg>;
const CARD_W = 'min(78vw, 1080px)';
const DOTS = ['left-[6.67%] top-[26.1%]', 'left-[93.33%] top-[26.1%]', 'left-[20.83%] top-[73.9%]', 'left-[79.17%] top-[73.9%]'];
const HANDLES = ['-left-[5px] -top-[5px]', '-right-[5px] -top-[5px]', '-left-[5px] -bottom-[5px]', '-right-[5px] -bottom-[5px]'];

export default function HomeView({ stories }: { stories: Story[] }) {
  const [t, setT] = useState(-1);
  const [tg, setTg] = useState(-1);
  const [query, setQuery] = useState('');
  const [hs, setHs] = useState(0);
  const [faq, setFaq] = useState(0);
  const lovedEl = useRef<HTMLElement>(null);
  const gemsEl = useRef<HTMLElement>(null);

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
    const match = q ? POPULAR.findIndex(p => p.name.toLowerCase().includes(q) || p.region!.toLowerCase().includes(q)) : -1;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (1.7 + Math.max(0, match) * 0.9) * window.innerHeight, behavior: 'smooth' });
  };

  const loved = sequence(t, POPULAR, THUMBS_P);
  const gs = sequence(tg, GEMS, [], true);
  const latest = stories.map(decorate);
  const hi = Math.min(hs, Math.max(0, latest.length - 1));

  const places = (s: Seq) => (
    <>
      <div className="absolute top-[12vh] right-[5vw] bottom-[18vh] left-[33vw] overflow-hidden rounded-[10px] bg-ink">
        {s.list.map(d => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={d.id} src={d.img} alt={d.on ? d.name : ''} className={`absolute inset-0 size-full object-cover [transition:opacity_0.8s_ease,scale_1.6s_var(--ease-glide)] ${d.on ? 'scale-100 opacity-100' : 'scale-[1.08] opacity-0'}`} />
        ))}
      </div>
      {s.list.map(d => (
        <div key={d.id}>
          <div className={`pointer-events-none absolute top-[17vh] left-[5vw] [transition:opacity_0.6s_ease,translate_0.8s_var(--ease-glide)] ${d.ty} ${d.on ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="m-0 w-[25vw] text-[clamp(34px,4.2vw,80px)] leading-[0.95] font-bold tracking-[-0.045em] wrap-break-word text-ink">{d.line1}<br />{d.line2}</h3>
          </div>
          <div aria-hidden={!d.on} className={`absolute bottom-[18vh] left-[5vw] flex w-[24vw] min-w-[200px] flex-col gap-1.5 text-[14px] leading-[1.45] text-ink [transition:opacity_0.6s_ease] ${d.on ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
            <span lang="bn" className="mb-2 font-bangla text-[24px] font-semibold text-bd-green">{d.bn}</span>
            <span className="text-[16px] leading-normal text-pretty text-[#3a3a3a]">{d.blurb}</span>
            <Link href={'/destinations/' + d.id} tabIndex={d.on ? 0 : -1} className={`${PILL} mt-5 self-start`}>Read the guide <Arrow /></Link>
          </div>
        </div>
      ))}
      <div className="absolute right-[5vw] bottom-[5vh] left-[5vw] flex items-center justify-between text-[13px] font-medium text-ink">
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
    <div className="min-h-screen overflow-x-clip bg-white">
      <Nav home />

      <header id="top" className="mx-auto flex max-w-[1360px] flex-col items-center px-8 pt-18 text-center">
        <h1 className="m-0 text-[clamp(52px,8.5vw,128px)] leading-[0.95] font-bold tracking-[-0.045em] text-balance">Know <span className="text-mesh pb-[0.06em]">Bangladesh</span><br />before you go.</h1>
        <p className="mt-7 mb-0 max-w-[520px] text-[19px] leading-normal text-pretty text-muted">Honest guides to every destination - real costs in Taka, how to get there, and when to visit.</p>
        <form role="search" onSubmit={onSearch} className="mt-11 flex w-full max-w-[760px] items-center gap-3 rounded-full border border-[#e6e6e6] bg-white py-2.5 pr-2.5 pl-8">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" className="shrink-0"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>
          <input aria-label="Search your destination" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your destination" className="min-w-0 flex-1 bg-transparent py-3.5 text-[20px] text-ink outline-0" />
          <button type="submit" className="shrink-0 cursor-pointer rounded-full bg-bd-green px-9 py-5 text-[17px] font-bold text-white hover:bg-[#00573f]">Search</button>
        </form>
      </header>

      <section className="mt-18 grid h-screen min-h-[560px] w-full grid-flow-dense grid-cols-6 grid-rows-4 gap-1 p-1">
        {MOSAIC.map(([file, label, c, r]) => (
          <div key={label} className={`relative cursor-pointer overflow-hidden rounded-md bg-ink ${c === 2 ? 'col-span-2' : 'col-span-1'} ${r === 2 ? 'row-span-2' : 'row-span-1'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={W(file, 900)} alt={label} loading="lazy" className="absolute inset-0 block size-full object-cover" />
            <div className="absolute inset-0 bg-[rgba(12,12,12,0.55)] [transition:background_0.35s_ease] hover:bg-[rgba(12,12,12,0)]"></div>
            <span className="pointer-events-none absolute bottom-2.5 left-3 text-[14px] font-bold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">{label}</span>
          </div>
        ))}
      </section>

      <section id="about" className="relative mt-[140px] h-[920px] w-full scroll-mt-24 overflow-hidden">
        <svg viewBox="0 0 1200 920" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full" fill="none" stroke="#141414" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="6 8">
          <path vectorEffect="non-scaling-stroke" d="M0 150 H60 Q80 150 80 170 V210 Q80 230 100 230 H250"></path>
          <path vectorEffect="non-scaling-stroke" d="M0 330 H60 Q80 330 80 310 V270 Q80 250 100 250 H250"></path>
          <path vectorEffect="non-scaling-stroke" d="M300 250 Q280 250 280 270 V380 Q280 400 260 400 H190 Q170 400 170 420 V560 Q170 580 190 580 H230 Q250 580 250 600 V680"></path>
          <path vectorEffect="non-scaling-stroke" d="M0 900 H170 Q190 900 190 880 V700 Q190 680 210 680 H300 Q320 680 320 660 V540 Q320 520 340 520 H580 Q600 520 600 500 V488"></path>
          <path vectorEffect="non-scaling-stroke" d="M1200 150 H1140 Q1120 150 1120 170 V210 Q1120 230 1100 230 H950"></path>
          <path vectorEffect="non-scaling-stroke" d="M1200 330 H1140 Q1120 330 1120 310 V270 Q1120 250 1100 250 H950"></path>
          <path vectorEffect="non-scaling-stroke" d="M900 250 Q920 250 920 270 V380 Q920 400 940 400 H1010 Q1030 400 1030 420 V560 Q1030 580 1010 580 H970 Q950 580 950 600 V680"></path>
          <path vectorEffect="non-scaling-stroke" d="M1200 900 H1030 Q1010 900 1010 880 V700 Q1010 680 990 680 H900 Q880 680 880 660 V540 Q880 520 860 520 H620 Q600 520 600 500"></path>
        </svg>
        {DOTS.map(pos => <span key={pos} className={`absolute -mt-[5px] -ml-[5px] size-2.5 rounded-full bg-ink ${pos}`}></span>)}
        <div className="relative flex flex-col items-center px-6 pt-20 text-center">
          <h2 className="m-0 max-w-[900px] text-[clamp(40px,6vw,84px)] leading-[1.02] font-medium tracking-[-0.045em]">Stop digging <span aria-label="Facebook" className="mx-[0.04em] -mt-[0.12em] inline-flex h-[0.78em] w-[1.6em] items-center justify-center rounded-full bg-frame align-middle"><span className="translate-y-[0.04em] font-[family-name:Arial,Helvetica,sans-serif] text-[0.62em] leading-none font-black tracking-[0] text-[#1877F2]">f</span></span> through<br />old Facebook posts</h2>
          <p className="mt-6 mb-0 max-w-[440px] text-[18px] leading-normal text-pretty text-[#6b6b6b]">One clear page per place with <b className="font-bold text-ink">real costs, routes &amp; seasons</b>&nbsp;-&nbsp;checked every week.</p>
          <Link href="/stories" className={`${PILL} mt-7`}>Browse all stories <Arrow /></Link>
          <div className="relative mt-11 aspect-[16/10.5] w-[min(100%,460px)] overflow-hidden rounded-[10px] bg-ink text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={W('Runmoy,_Sajek_Valley_04.jpg', 1000)} alt="Runmoy, Sajek Valley" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_40%,rgba(0,0,0,0.7)_100%)]"></div>
            <Link href="/stories/s1" className="absolute top-3.5 right-3.5 rounded-full bg-white/85 px-3.5 py-2 text-[13px] font-medium text-ink backdrop-blur-[8px]">Read story →</Link>
            <div className="absolute right-5 bottom-4.5 left-5 text-white">
              <div className="text-[21px] font-medium tracking-[-0.02em]">How we did Sajek for ৳4,800</div>
              <div className="mt-1.5 text-[13px] opacity-85">A story by Nusrat Jahan · 4 min read</div>
            </div>
          </div>
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

      <section id="reviews" className="w-full overflow-hidden pt-[200px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 px-[5vw]">
          <h2 className="m-0 text-[clamp(44px,6vw,88px)] leading-[0.95] font-bold tracking-[-0.045em]">Stories</h2>
          <Link href="/stories" className="flex items-center gap-2.5 rounded-full border border-[#e2e2e2] px-5.5 py-3.5 text-[15px] font-bold hover:border-ink">All stories <Arrow c="#141414" /></Link>
        </div>
        <div className="px-[5vw]">
          <div className="flex gap-6 transition-transform duration-1000 ease-swing will-change-transform" style={{ transform: `translateX(calc(${-hi} * (${CARD_W} + 24px)))` }}>
            {latest.map((r, k) => {
              const on = k === hi, d = k - hi;
              return (
                <article key={r.id} onClick={() => { if (!on) setHs(k); }} className={`flex flex-[0_0_min(78vw,1080px)] origin-left flex-wrap gap-x-10 gap-y-7 overflow-hidden rounded-[10px] bg-[#f8f8f7] p-[clamp(20px,2.4vw,36px)] [transition:opacity_1s_var(--ease-swing),scale_1s_var(--ease-swing)] ${on ? 'scale-100 cursor-default opacity-100' : 'scale-[0.94] cursor-pointer opacity-55'}`}>
                  <div className="relative aspect-[4/3] flex-[1.5_1_360px] overflow-hidden rounded-md bg-[#eeeeec]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {r.img && <img src={r.img} alt="" loading="lazy" className={`absolute inset-0 block size-full object-cover [transition:scale_1.4s_var(--ease-swing),translate_1.4s_var(--ease-swing)] ${on ? 'translate-x-0 scale-100' : d > 0 ? '-translate-x-[6%] scale-[1.15]' : 'translate-x-[6%] scale-[1.15]'}`} />}
                  </div>
                  <div aria-hidden={!on} className={`flex min-w-0 flex-[1_1_260px] flex-col gap-4.5 ${on ? 'translate-y-0 opacity-100 [transition:opacity_0.7s_ease_0.35s,translate_0.9s_var(--ease-swing)_0.35s]' : 'translate-y-6 opacity-0 [transition:opacity_0.7s_ease,translate_0.9s_var(--ease-swing)]'}`}>
                    <div className="mb-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] text-muted">
                      <span className="font-bold text-ink">{r.name}</span>
                      <span className="flex items-center gap-1.5">{PIN}{r.placeName}</span>
                      <span>{r.when}</span>
                    </div>
                    <h3 className="m-0 text-[clamp(26px,2.4vw,38px)] leading-[1.08] font-medium tracking-[-0.035em] text-balance">{r.title}</h3>
                    <p className="m-0 line-clamp-5 text-[16px] leading-[1.6] text-muted">{cut(r.excerpt, 300)}</p>
                    <div className="mt-auto flex flex-col">
                      <Link href={r.href} tabIndex={on ? 0 : -1} className={`${PILL} self-start`}>Read story <Arrow /></Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-6">
            <div className="flex gap-3">
              <button onClick={() => setHs(Math.max(0, hi - 1))} aria-label="Previous story" className={`flex size-15 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-ink bg-white [transition:opacity_0.3s,background-color_0.25s,translate_0.25s] hover:-translate-x-0.5 hover:bg-frame ${hi === 0 ? 'opacity-30' : 'opacity-100'}`}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg></button>
              <button onClick={() => setHs(Math.min(latest.length - 1, hi + 1))} aria-label="Next story" className={`flex size-15 cursor-pointer items-center justify-center rounded-full bg-ink [transition:opacity_0.3s,background-color_0.25s,translate_0.25s] hover:translate-x-0.5 hover:bg-bd-green ${hi >= latest.length - 1 ? 'opacity-30' : 'opacity-100'}`}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="flex w-full flex-col items-center bg-white px-[5vw] pt-[220px]">
        <span className="text-[13px] font-bold tracking-[0.14em] text-ink uppercase">Good to know</span>
        <h2 className="mt-4.5 mb-0 text-center text-[clamp(44px,5.4vw,80px)] leading-none font-medium tracking-[-0.045em]">Frequently<br />asked questions</h2>
        <div className="mt-14 flex w-full max-w-[820px] flex-col gap-2.5">
          {FAQS.map((f, i) => {
            const open = faq === i;
            return (
              <div key={f.q} className={`overflow-hidden rounded-[22px] border [transition:background-color_0.35s_ease,border-color_0.35s_ease] ${open ? 'border-[#e6e6e4] bg-white' : 'border-[#f5f5f4] bg-[#f5f5f4]'}`}>
                <button aria-expanded={open} onClick={() => setFaq(open ? -1 : i)} className="flex w-full cursor-pointer items-center justify-between gap-4 bg-transparent py-3 pr-3 pl-7 text-left text-ink">
                  <span className="py-2.5 text-[clamp(17px,1.4vw,19px)] font-medium tracking-[-0.01em]">{f.q}</span>
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-full [transition:background-color_0.35s_ease] ${open ? 'bg-[#f2f2f0]' : 'bg-white'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" strokeLinecap="round" className={`transition-transform duration-400 ease-glide ${open ? 'rotate-45' : 'rotate-0'}`}><path d="M12 5v14M5 12h14"></path></svg>
                  </span>
                </button>
                <div className={`grid [transition:grid-template-rows_0.45s_var(--ease-glide)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="m-0 pt-0 pr-21 pb-6.5 pl-7 text-[16px] leading-[1.65] text-pretty text-muted">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}

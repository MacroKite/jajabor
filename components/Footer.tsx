'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

// Mountain layers are generated from a fixed seed, so server and browser draw the same shapes.
const H = 400;
const LAYERS = (() => {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const defs = [
    { fill: '#dcebe3', base: 120, amp: 70, freq: 2.2, step: 24, spike: 0, par: 0.55 },
    { fill: '#b2d0c1', base: 175, amp: 55, freq: 3.1, step: 20, spike: 0, par: 0.42 },
    { fill: '#76a78f', base: 235, amp: 30, freq: 4, step: 12, spike: 26, par: 0.3 },
    { fill: '#3f7b61', base: 275, amp: 26, freq: 5, step: 11, spike: 34, par: 0.2 },
    { fill: '#1d5540', base: 310, amp: 20, freq: 6, step: 12, spike: 40, par: 0.1 },
    { fill: '#0b2a20', base: 350, amp: 14, freq: 7, step: 13, spike: 34, par: 0 },
  ];
  return defs.map(L => {
    const ph = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
    let d = `M0,${H} `;
    for (let x = 0; x <= 1440 + L.step; x += L.step) {
      const t = x / 1440;
      const y = L.base - L.amp * (0.6 * Math.sin(t * L.freq * 3.14 + ph[0]) + 0.3 * Math.sin(t * L.freq * 7.3 + ph[1]) + 0.1 * Math.sin(t * L.freq * 17 + ph[2]));
      if (L.spike) {
        const h = L.spike * (0.45 + rnd() * 0.75);
        d += `L${x - L.step / 2},${(y + 4).toFixed(1)} L${x},${(y - h).toFixed(1)} `;
      } else d += `L${x},${y.toFixed(1)} `;
    }
    return { d: d + `L1440,${H} Z`, fill: L.fill, par: L.par };
  });
})();
const BIRDS = [[0, 10], [18, 4], [34, 14], [52, 2], [70, 12], [90, 6]].map(([x, y], i) => {
  const w = 7 + (i % 3) * 2;
  return `M${x},${y} q${w / 2},-${w / 2.5} ${w},0 q${w / 2},-${w / 2.5} ${w},0`;
});

const HEAD = 'max-w-40 border-b border-white/70 pb-3 text-[16px] font-bold';
const LINK = 'text-[15px] text-[#cfe3da] hover:text-white';
const SOCIAL = 'flex size-10 items-center justify-center rounded-full border-[1.5px] border-white/75 transition-[background-color,translate] duration-250 hover:-translate-y-0.5 hover:bg-white/12';

export default function Footer() {
  const scene = useRef<HTMLDivElement>(null);
  const birds = useRef<SVGSVGElement>(null);
  const mist = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const layers = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      const sc = scene.current;
      if (!sc) return;
      const r = sc.getBoundingClientRect(), vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      const off = (1 - p) * 120;
      layers.current.forEach((el, i) => { if (el) el.style.transform = `translateY(${(off * LAYERS[i].par).toFixed(1)}px)`; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    const anims: Animation[] = [];
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      if (birds.current) anims.push(birds.current.animate([{ transform: 'translate(-15vw, 20px)' }, { transform: 'translate(55vw, -10px)' }, { transform: 'translate(115vw, 10px)' }], { duration: 42000, iterations: Infinity }));
      if (mist.current) anims.push(mist.current.animate([{ transform: 'translateX(-8%)', opacity: 0.6 }, { transform: 'translateX(8%)', opacity: 1 }, { transform: 'translateX(-8%)', opacity: 0.6 }], { duration: 26000, iterations: Infinity, easing: 'ease-in-out' }));
    }

    let io: IntersectionObserver | undefined;
    if (content.current && 'IntersectionObserver' in window && !reduce) {
      const items = [...content.current.querySelectorAll<HTMLElement>('[data-rv]')];
      items.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; });
      io = new IntersectionObserver(ents => {
        if (!ents.some(e => e.isIntersecting)) return;
        items.forEach((el, i) => anims.push(el.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: i * 110, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' })));
        io?.disconnect();
      }, { threshold: 0.2 });
      io.observe(content.current);
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      anims.forEach(a => a.cancel());
      io?.disconnect();
    };
  }, []);

  return (
    <footer className="relative mt-[200px] w-full overflow-hidden bg-white font-sans">
      <div ref={scene} aria-hidden="true" className="relative h-[clamp(280px,34vw,520px)]">
        <svg ref={birds} viewBox="0 0 120 40" className="absolute top-[14%] left-0 w-[clamp(70px,7vw,120px)] overflow-visible opacity-55">
          {BIRDS.map(d => <path key={d} d={d} suppressHydrationWarning fill="none" stroke="#1f4f3d" strokeWidth="1.4" strokeLinecap="round"></path>)}
        </svg>
        {LAYERS.map((l, i) => (
          <svg key={l.fill} ref={el => { layers.current[i] = el; }} viewBox="0 0 1440 400" preserveAspectRatio="none" className="absolute -bottom-px left-[-2%] h-full w-[104%] will-change-transform">
            <path d={l.d} fill={l.fill} suppressHydrationWarning></path>
          </svg>
        ))}
        <div ref={mist} className="pointer-events-none absolute bottom-[26%] left-[-30%] h-[22%] w-[160%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_70%)] blur-[10px]"></div>
      </div>

      <div className="relative -mt-px bg-[#0b2a20] px-[5vw] pt-6 pb-8 text-white">
        <div ref={content} className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-x-10 gap-y-12 pb-14">
          <div data-rv="1" className="flex flex-col gap-4.5">
            <Link href="/" className="flex items-center gap-2.5 text-[40px] leading-none font-black tracking-[-0.05em] text-white">
              <span className="block size-3.5 rounded-full bg-bd-red"></span>TRIP
            </Link>
            <p className="m-0 max-w-[260px] text-[15px] leading-[1.6] text-[#b9d3c7]">A free, honest guide to travelling in Bangladesh. Written by travellers, run by volunteers.</p>
          </div>
          <div data-rv="1" className="flex flex-col gap-3.5">
            <span className={HEAD}>Explore</span>
            <Link href="/destinations" className={LINK}>Destinations</Link>
            <Link href="/stories" className={LINK}>Stories</Link>
            <Link href="/about" className={LINK}>About us</Link>
          </div>
          <div data-rv="1" className="flex flex-col gap-3.5">
            <span className={HEAD}>Get involved</span>
            <Link href="/share" className={LINK}>Share your story</Link>
            <Link href="/about#contact" className={LINK}>Suggest a place</Link>
            <Link href="/about#contact" className={LINK}>Contact us</Link>
          </div>
          <div data-rv="1" className="flex flex-col gap-3.5">
            <span className={HEAD}>Contact</span>
            <a href="mailto:hello@trip.org.bd" className={LINK}>hello@trip.org.bd</a>
            <a href="tel:+8801700000000" className={LINK}>+880 1700 000000</a>
            <span className="text-[15px] leading-normal text-[#cfe3da]">Dhanmondi, Dhaka 1205</span>
            <div className="mt-1.5 flex gap-2.5">
              <a href="#" aria-label="Facebook" className={SOCIAL}><svg width="16" height="16" viewBox="0 0 24 24"><path fill="#fff" d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.6 1.6-1.6h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8z"></path></svg></a>
              <a href="#" aria-label="Instagram" className={SOCIAL}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.2" cy="6.8" r="0.8" fill="#fff" stroke="none"></circle></svg></a>
              <a href="#" aria-label="YouTube" className={SOCIAL}><svg width="16" height="16" viewBox="0 0 24 24"><path fill="#fff" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"></path></svg></a>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/14 pt-6 text-[13px] text-[#8fb3a3]">
          <span>© 2026 TRIP · A nonprofit, made in Dhaka</span>
          <span>Photos: Wikimedia Commons contributors, CC BY-SA.</span>
        </div>
      </div>
    </footer>
  );
}

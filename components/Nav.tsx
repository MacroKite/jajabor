'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const LINKS = [
  { key: 'destinations', href: '/destinations', label: 'Destinations' },
  { key: 'stories', href: '/stories', label: 'Stories' },
  { key: 'about', href: '/about', label: 'About' },
] as const;

export default function Nav({ active, home, shareHref = '/share' }: { active?: 'destinations' | 'stories' | 'about'; home?: boolean; shareHref?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the phone menu on navigation, on Escape, and when the screen grows past phone size.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const mq = window.matchMedia('(min-width: 48rem)');
    const onMq = () => { if (mq.matches) setOpen(false); };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="sticky top-0 z-30">
      <nav className="flex h-16 items-center justify-between gap-6 bg-white/82 px-[5vw] backdrop-blur-[14px] backdrop-saturate-[1.4] tablet:h-[72px]">
        <Link href={home ? '#top' : '/'} onClick={close} className="flex items-center gap-2 text-[22px] font-black tracking-[-0.02em]">
          <span className="block size-3.5 rounded-full bg-bd-red"></span>TRIP
        </Link>
        <div className="hidden gap-8 text-[15px] font-medium tablet:flex desktop:gap-14">
          {LINKS.map(l => <Link key={l.key} href={l.href} className={active === l.key ? 'text-bd-green' : undefined}>{l.label}</Link>)}
        </div>
        <Link href={shareHref} className="hidden rounded-full bg-ink px-5.5 py-3 text-[15px] font-medium text-white tablet:block">Share your story</Link>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="-mr-2 flex size-11 cursor-pointer items-center justify-center rounded-full tablet:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18"></path> : <path d="M4 7h16M4 12h16M4 17h16"></path>}
          </svg>
        </button>
      </nav>

      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-x-0 top-16 bottom-0 flex flex-col bg-white px-[5vw] pt-6 pb-[max(24px,env(safe-area-inset-bottom))] transition-[opacity,translate] duration-250 tablet:hidden ${open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
      >
        <div className="flex flex-col">
          {LINKS.map(l => (
            <Link key={l.key} href={l.href} onClick={close} className={`flex items-center justify-between border-b border-[#ececec] py-5 text-[30px] font-bold tracking-[-0.03em] ${active === l.key ? 'text-bd-green' : ''}`}>
              {l.label}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
            </Link>
          ))}
        </div>
        <Link href={shareHref} onClick={close} className="mt-8 rounded-full bg-ink py-4 text-center text-[16px] font-bold text-white hover:bg-bd-green hover:text-white">Share your story</Link>
        <a href="mailto:hello@trip.org.bd" className="mt-auto text-center text-[14px] text-muted">hello@trip.org.bd</a>
      </div>
    </div>
  );
}

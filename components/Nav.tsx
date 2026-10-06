'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import Avatar from '@/components/Avatar';
import Logo from '@/components/Logo';

const LINKS = [
  { key: 'destinations', href: '/destinations', label: 'Destinations' },
  { key: 'stories', href: '/stories', label: 'Stories' },
  { key: 'about', href: '/about', label: 'About' },
] as const;

type User = { name: string; email: string; image?: string | null };

// `hideShare` drops the "Share your story" button, e.g. on the login and sign-up pages, where it would only lead back to login.
export default function Nav({ active, home, shareHref = '/share', hideShare = false }: { active?: 'destinations' | 'stories' | 'about'; home?: boolean; shareHref?: string; hideShare?: boolean }) {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const userEl = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as User | undefined;
  const loginHref = pathname && pathname !== '/' && !pathname.startsWith('/login') && !pathname.startsWith('/signup') ? `/login?next=${encodeURIComponent(pathname)}` : '/login';

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

  // Close the account menu on outside click or Escape.
  useEffect(() => {
    if (!userMenu) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setUserMenu(false); };
    const onDown = (e: MouseEvent) => { if (userEl.current && !userEl.current.contains(e.target as Node)) setUserMenu(false); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [userMenu]);

  const close = () => setOpen(false);
  const signOut = async () => {
    setUserMenu(false);
    setOpen(false);
    await authClient.signOut();
    router.refresh();
  };

  return (
    <div className="sticky top-0 z-30">
      {/* From tablet up, a 1fr / auto / 1fr grid keeps the links centred whatever the widths of the logo and buttons. */}
      <nav className="flex h-[72px] items-center justify-between gap-6 bg-white/82 px-[5vw] backdrop-blur-[14px] backdrop-saturate-[1.4] tablet:grid tablet:h-[88px] tablet:grid-cols-[1fr_auto_1fr]">
        <Link href={home ? '#top' : '/'} onClick={close} aria-label="Jajabor home" className="flex shrink-0 justify-self-start text-ink hover:text-ink">
          <Logo className="h-11 w-auto tablet:h-13" />
        </Link>
        <div className="hidden gap-8 text-[15px] font-medium tablet:flex desktop:gap-14">
          {LINKS.map(l => <Link key={l.key} href={l.href} className={active === l.key ? 'text-bd-green' : undefined}>{l.label}</Link>)}
        </div>
        <div className="hidden items-center gap-4 justify-self-end tablet:flex desktop:gap-5">
          {/* Reserve the space while the session loads, so the nav doesn't jump. */}
          {isPending ? <span className="size-9" aria-hidden="true"></span> : user ? (
            <div ref={userEl} className="relative">
              <button type="button" onClick={() => setUserMenu(o => !o)} aria-haspopup="menu" aria-expanded={userMenu} aria-label="Account menu" className="flex cursor-pointer rounded-full outline-offset-2">
                <Avatar name={user.name || user.email} image={user.image} />
              </button>
              {userMenu && (
                <div role="menu" className="absolute top-[calc(100%+10px)] right-0 z-20 flex w-64 flex-col rounded-[10px] border border-[#e6e6e6] bg-white p-1.5">
                  <div className="flex flex-col gap-0.5 border-b border-[#ececec] px-3 pt-2 pb-3">
                    <span className="truncate text-[15px] font-bold">{user.name}</span>
                    <span className="truncate text-[13px] text-muted">{user.email}</span>
                  </div>
                  <Link href="/account" role="menuitem" onClick={() => setUserMenu(false)} className="mt-1 rounded-md px-3 py-2.5 text-[15px] font-medium hover:bg-[#f4f4f4]">Your profile</Link>
                  <button type="button" role="menuitem" onClick={signOut} className="mt-1 cursor-pointer rounded-md px-3 py-2.5 text-left text-[15px] font-medium hover:bg-[#f4f4f4]">Log out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href={loginHref} className="text-[15px] font-medium">Log in</Link>
          )}
          {!hideShare && <Link href={shareHref} className="rounded-full bg-ink px-5.5 py-3 text-[15px] font-medium text-white">Share your story</Link>}
        </div>
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
        className={`fixed inset-x-0 top-[72px] bottom-0 flex flex-col overflow-y-auto bg-white px-[5vw] pt-6 pb-[max(24px,env(safe-area-inset-bottom))] transition-[opacity,translate] duration-250 tablet:hidden ${open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
      >
        <div className="flex flex-col">
          {LINKS.map(l => (
            <Link key={l.key} href={l.href} onClick={close} className={`flex items-center justify-between border-b border-[#ececec] py-5 text-[30px] font-bold tracking-[-0.03em] ${active === l.key ? 'text-bd-green' : ''}`}>
              {l.label}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
            </Link>
          ))}
        </div>
        {!hideShare && <Link href={shareHref} onClick={close} className="mt-8 rounded-full bg-ink py-4 text-center text-[16px] font-bold text-white hover:bg-bd-green hover:text-white">Share your story</Link>}
        {!isPending && (user ? (
          <div className="mt-6 flex items-center gap-3 rounded-[10px] bg-[#f4f4f4] p-3">
            <Link href="/account" onClick={close} className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar name={user.name || user.email} image={user.image} className="size-10 text-[15px]" />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[15px] font-bold">{user.name}</span>
                <span className="truncate text-[13px] text-muted">Your profile</span>
              </span>
            </Link>
            <button type="button" onClick={signOut} className="shrink-0 cursor-pointer rounded-full border border-[#d9d9d9] bg-white px-4 py-2 text-[14px] font-medium">Log out</button>
          </div>
        ) : (
          <Link href={loginHref} onClick={close} className={`${hideShare ? 'mt-8' : 'mt-3'} rounded-full border border-[#e2e2e2] py-4 text-center text-[16px] font-bold`}>Log in</Link>
        ))}
      </div>
    </div>
  );
}

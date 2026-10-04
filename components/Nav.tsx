import Link from 'next/link';

export default function Nav({ active, home, shareHref = '/share' }: { active?: 'destinations' | 'stories' | 'about'; home?: boolean; shareHref?: string }) {
  const on = (k: typeof active) => (active === k ? 'text-bd-green' : undefined);
  return (
    <div className="sticky top-0 z-30">
      <nav className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 bg-white/82 px-[5vw] py-3.5 backdrop-blur-[14px] backdrop-saturate-[1.4]">
        <Link href={home ? '#top' : '/'} className="flex items-center gap-2 text-[22px] font-black tracking-[-0.02em]">
          <span className="block size-3.5 rounded-full bg-bd-red"></span>TRIP
        </Link>
        <div className="flex flex-wrap gap-14 text-[15px] font-medium">
          <Link href="/destinations" className={on('destinations')}>Destinations</Link>
          <Link href="/stories" className={on('stories')}>Stories</Link>
          <Link href="/about" className={on('about')}>About</Link>
        </div>
        <Link href={shareHref} className="rounded-full bg-ink px-5.5 py-3 text-[15px] font-medium text-white">Share your story</Link>
      </nav>
    </div>
  );
}

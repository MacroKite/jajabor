import Link from 'next/link';
import Nav from '@/components/Nav';

export default function NotFound() {
  return (
    <div className="overflow-x-clip bg-white">
      <Nav />
      <header className="flex flex-col gap-7 px-[5vw] pt-10 tablet:pt-16 desktop:pt-24">
        <h1 className="m-0 text-[clamp(44px,10vw,160px)] leading-[0.9] font-bold tracking-[-0.055em]">Lost the road.</h1>
        <p className="m-0 max-w-[420px] text-[clamp(18px,1.6vw,22px)] leading-[1.35] font-medium">We couldn&apos;t find that page. <Link href="/destinations" className="underline underline-offset-4">See all destinations</Link></p>
      </header>
    </div>
  );
}

import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'About',
  description: 'TRIP is a nonprofit run by volunteers: a free, honest guide to travelling in Bangladesh.',
};

const P = 'm-0 text-[clamp(20px,1.6vw,23px)] leading-[1.7] text-pretty text-[#2a2a2a]';
const ICON = 'flex size-9 shrink-0 items-center justify-center rounded-lg bg-frame';
const ROW = 'flex items-center gap-3.5';
const TXT = 'text-[15px] font-medium';

export default function Page() {
  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <Nav active="about" />

      <header className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6 px-[5vw] pt-24">
        <h1 className="m-0 text-[clamp(56px,10vw,160px)] leading-[0.9] font-bold tracking-[-0.055em]">About <span className="mesh-word">us</span></h1>
        <p className="m-0 mb-3.5 max-w-[420px] text-[clamp(18px,1.6vw,22px)] leading-[1.35] font-medium text-pretty">A free, honest guide to travelling in Bangladesh.</p>
      </header>

      <section className="mt-16 px-[5vw]">
        <div className="relative aspect-[16/7] min-h-80 overflow-hidden rounded-[10px] bg-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/about-hero.jpg" alt="" className="absolute inset-0 block size-full object-cover" />
        </div>
      </section>

      <section className="flex flex-col gap-6 px-[5vw] pt-30">
        <h2 className="m-0 text-[clamp(36px,4.4vw,64px)] leading-[0.95] font-bold tracking-[-0.045em]">Who we are</h2>
        <p className={P}>TRIP is a nonprofit organisation run by volunteers who love travelling in Bangladesh. We started because planning a trip here usually means digging through old Facebook posts, outdated blogs and advice that is trying to sell you something. We wanted one clear, honest place where anyone could find out how to get somewhere, what to eat, where to stay and when to go.</p>
        <p className={P}>We don&apos;t sell tours, take bookings or earn commissions. Every guide is free to read, and every story is written by a real traveller. Our only goal is to help more people see their own country, and to do it in a way that respects the places and the communities who live there.</p>
      </section>

      <section id="contact" className="grid scroll-mt-24 grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-stretch gap-x-16 gap-y-12 px-[5vw] pt-40">
        <div className="flex flex-col gap-5 pt-4">
          <h2 className="m-0 text-[clamp(40px,4.6vw,68px)] leading-none font-bold tracking-[-0.045em]">Get in touch</h2>
          <p className="m-0 max-w-[460px] text-[clamp(19px,1.6vw,22px)] leading-normal text-pretty text-muted">Have a question, an idea or a place we should cover? We&apos;d love to hear from you, and every message helps us make TRIP better.</p>
          <div className="mt-auto flex flex-col gap-4 pt-12">
            <div className={ROW}>
              <span className={ICON}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg></span>
              <a href="mailto:hello@trip.org.bd" className={TXT}>hello@trip.org.bd</a>
            </div>
            <div className={ROW}>
              <span className={ICON}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.5"></circle></svg></span>
              <span className={TXT}>House 12, Road 4, Dhanmondi, Dhaka 1205</span>
            </div>
            <div className={ROW}>
              <span className={ICON}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path></svg></span>
              <a href="tel:+8801700000000" className={TXT}>+880 1700 000000</a>
            </div>
          </div>
        </div>
        <div className="rounded-[14px] bg-[#f4f4f4] p-[clamp(24px,3vw,36px)]">
          <ContactForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}

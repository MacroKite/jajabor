'use client';

import Link from 'next/link';
import { Tiro_Bangla } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
import Nav from '@/components/Nav';
import { DestinationCard } from '@/components/Cards';
import type { Destination } from '@/lib/data';
import { QUESTIONS, bnDigits, letter, scoreTest, type Result } from '@/lib/personality';
import { drawCard } from '@/lib/personality-card';
import { resizePhoto } from '@/lib/resize-photo';

type Step = 'intro' | 'questions' | 'details' | 'result';

// The postcard's serif, also used for its letter on the page. Loaded on this page only.
const tiro = Tiro_Bangla({ weight: '400', style: ['normal', 'italic'], subsets: ['bengali', 'latin'] });

const LETTERS = ['ক', 'খ', 'গ', 'ঘ'];
const BTN = 'cursor-pointer rounded-full bg-ink px-7 py-4 text-[16px] font-bold text-white hover:bg-bd-green disabled:cursor-wait disabled:opacity-60';
const BTN_LINE = 'cursor-pointer rounded-full border border-[#d9d9d9] bg-white px-6 py-3.5 text-[15px] font-bold text-ink hover:border-ink';
const H1 = 'm-0 text-[clamp(40px,7vw,96px)] leading-[1.15] font-bold tracking-[-0.03em]';

// The travel personality test: an intro, ten questions one at a time, then the traveller's name
// (and an optional photo) and a result card they can download or share. No login, and nothing
// leaves the browser.
export default function PersonalityTest({ dests }: { dests: Destination[] }) {
  const [step, setStep] = useState<Step>('intro');
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [err, setErr] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [card, setCard] = useState('');
  const [busy, setBusy] = useState(false);
  const blob = useRef<Blob | null>(null);
  const top = useRef<HTMLDivElement>(null);

  // Each step starts at the top of the page.
  useEffect(() => { top.current?.scrollIntoView({ block: 'start' }); }, [step, qi]);

  const byId = (id: string) => dests.find(d => d.id === id);
  const q = QUESTIONS[qi];
  const total = QUESTIONS.length;

  const choose = (i: number) => {
    const next = [...answers];
    next[qi] = i;
    setAnswers(next);
    // A short pause so the chosen option shows before moving on.
    setTimeout(() => (qi + 1 < total ? setQi(qi + 1) : setStep('details')), 220);
  };

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { setPhoto(await resizePhoto(file, 800)); setErr(''); }
    catch { setErr('ছবিটি খোলা যায়নি। অন্য একটি JPG বা PNG ছবি দিন।'); }
  };

  const showResult = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return setErr('ফলাফল দেখতে আপনার নাম লিখুন।');
    setBusy(true);
    const r = scoreTest(answers);
    const places = r.places.map(byId).filter((d): d is Destination => !!d);
    try {
      const cv = await drawCard({ result: r, name: n, photo: photo || undefined, placeNames: places.map(p => p.bn), heroImage: places[0]?.img, siteHost: window.location.host, serifFamily: tiro.style.fontFamily });
      setCard(cv.toDataURL('image/png'));
      blob.current = await new Promise(res => cv.toBlob(res, 'image/png'));
    } catch {
      setCard('');
      blob.current = null;
    }
    setResult(r);
    setBusy(false);
    setStep('result');
  };

  const file = () => new File([blob.current!], 'jajabor-travel-personality.png', { type: 'image/png' });
  const download = () => {
    const a = document.createElement('a');
    a.href = card;
    a.download = 'jajabor-travel-personality.png';
    a.click();
  };
  const canShareFile = () => !!blob.current && typeof navigator !== 'undefined' && !!navigator.canShare?.({ files: [file()] });
  const share = async () => {
    try {
      if (canShareFile()) await navigator.share({ files: [file()], title: 'আমার ভ্রমণ ব্যক্তিত্ব', text: `আমি একজন ${result?.type.title}! আপনার ভ্রমণ ব্যক্তিত্ব জানুন:` });
      else download();
    } catch { /* the person closed the share sheet */ }
  };
  const restart = () => { setAnswers([]); setQi(0); setResult(null); setCard(''); setStep('intro'); };

  const suggested = result ? result.places.map(byId).filter((d): d is Destination => !!d) : [];

  return (
    <div className="overflow-x-clip bg-white">
      <Nav active="personality" />
      <div ref={top} className="scroll-mt-24" />

      <main lang="bn" className="px-[5vw] pt-10 tablet:pt-16 desktop:pt-20">
        {step === 'intro' && (
          <section className="flex max-w-[900px] flex-col items-start gap-7">
            <span className="rounded-full bg-[#eef5f1] px-4 py-2 text-[14px] font-bold text-bd-green">ভ্রমণ ব্যক্তিত্ব পরীক্ষা</span>
            <h1 className={H1}>আপনি কোন ধরনের পর্যটক?</h1>
            <p className="m-0 max-w-[620px] text-[18px] leading-[1.7] text-pretty text-muted tablet:text-[20px]">
              {bnDigits(total)}টি সহজ প্রশ্নের উত্তর দিন। জেনে নিন আপনার ভ্রমণ ধরন, পছন্দ আর বাংলাদেশের কোন জায়গাগুলো আপনার জন্য সেরা। শেষে পাবেন নিজের নাম আর ছবিসহ একটি ফটো কার্ড।
            </p>
            <div className="flex flex-wrap gap-2.5 text-[14px] font-medium text-ink">
              {[`${bnDigits(total)}টি প্রশ্ন`, 'মাত্র ২ মিনিট', 'লগইন লাগবে না'].map(t => <span key={t} className="rounded-full border border-[#e2e2e2] px-4 py-2">{t}</span>)}
            </div>
            <button type="button" onClick={() => setStep('questions')} className={`${BTN} mt-2`}>পরীক্ষা শুরু করুন →</button>
          </section>
        )}

        {step === 'questions' && (
          <section className="flex max-w-[900px] flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-[15px] font-medium text-muted">
                <span>প্রশ্ন {bnDigits(qi + 1)}/{bnDigits(total)}</span>
                {qi > 0 && <button type="button" onClick={() => setQi(qi - 1)} className="cursor-pointer text-[15px] font-medium text-muted hover:text-ink">← আগের প্রশ্ন</button>}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#ececec]" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={qi + 1}>
                <div className="h-full rounded-full bg-bd-green transition-[width] duration-300" style={{ width: `${((qi + 1) / total) * 100}%` }} />
              </div>
            </div>
            <h1 className="m-0 text-[clamp(28px,4vw,52px)] leading-[1.3] font-bold tracking-[-0.02em] text-balance">{q.text}</h1>
            <div className="flex flex-col gap-3">
              {(q.kind === 'type' ? q.options : q.options.map(o => o.text)).map((text, i) => {
                const on = answers[qi] === i;
                return (
                  <button key={i} type="button" onClick={() => choose(i)} aria-pressed={on}
                    className={`flex cursor-pointer items-center gap-4 rounded-[14px] border-[1.5px] px-5 py-4 text-left text-[17px] font-medium transition-colors tablet:px-6 tablet:py-5 tablet:text-[19px] ${on ? 'border-bd-green bg-[#eef5f1]' : 'border-[#e2e2e2] bg-white hover:border-ink'}`}>
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[16px] font-bold ${on ? 'bg-bd-green text-white' : 'bg-[#f2f2f2] text-ink'}`}>{LETTERS[i]}</span>
                    {text}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 'details' && (
          <section className="flex max-w-[640px] flex-col gap-7">
            <span className="rounded-full self-start bg-[#eef5f1] px-4 py-2 text-[14px] font-bold text-bd-green">শেষ ধাপ</span>
            <h1 className="m-0 text-[clamp(32px,5vw,64px)] leading-[1.2] font-bold tracking-[-0.03em]">আপনার ফটো কার্ড তৈরি করি</h1>
            <form onSubmit={showResult} noValidate className="flex flex-col gap-6">
              <label className="flex flex-col gap-2 text-[15px] font-medium">আপনার নাম
                <input value={name} onChange={e => { setName(e.target.value); setErr(''); }} maxLength={40} autoFocus placeholder="আপনার নাম লিখুন" className="rounded-[10px] border border-[#e2e2e2] bg-white px-4.5 py-4 text-[17px] font-normal outline-bd-green" />
              </label>
              <div className="flex flex-col gap-2 text-[15px] font-medium">ছবি (ইচ্ছে হলে)
                <label className="relative flex cursor-pointer items-center gap-4 rounded-[10px] border-[1.5px] border-dashed border-[#d0d0d0] bg-[#fafafa] p-3.5">
                  <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eee]">
                    {photo ? <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photo})` }} /> : <span className="text-[24px] leading-none text-ink">+</span>}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[15px] font-medium text-ink">{photo ? 'ছবি যোগ হয়েছে · বদলাতে চাপুন' : 'একটি ছবি যোগ করুন'}</span>
                    <span className="text-[13px] font-normal text-faint">ছবি না দিলে কার্ডে আপনার নামের প্রথম অক্ষর থাকবে। ছবিটি কোথাও আপলোড হয় না।</span>
                  </span>
                  <input type="file" accept="image/*" aria-label="ছবি যোগ করুন" onChange={onPhoto} className="absolute inset-0 size-full cursor-pointer opacity-0" />
                </label>
              </div>
              {err && <span role="alert" className="text-[14px] font-medium text-bd-red">{err}</span>}
              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" disabled={busy} className={BTN}>{busy ? 'কার্ড তৈরি হচ্ছে…' : 'ফলাফল দেখুন'}</button>
                <button type="button" onClick={() => { setQi(total - 1); setStep('questions'); }} className="cursor-pointer text-[15px] font-medium text-muted hover:text-ink">← প্রশ্নে ফিরে যান</button>
              </div>
            </form>
          </section>
        )}

        {step === 'result' && result && (
          <>
            <section className="grid grid-cols-1 items-start gap-10 desktop:grid-cols-[minmax(0,480px)_1fr] desktop:gap-16">
              <div className="flex flex-col gap-4">
                {card
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={card} alt={`${name.trim()}-এর ভ্রমণ ব্যক্তিত্ব কার্ড: ${result.type.title}`} className="block w-full rounded-[14px] shadow-[0_10px_40px_rgba(0,0,0,0.12)]" />
                  : <div className="rounded-[14px] bg-frame p-8 text-[15px] text-muted">কার্ডটি তৈরি করা যায়নি, তবে নিচে আপনার ফলাফল দেখুন।</div>}
                {card && (
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={download} className={BTN}>কার্ড ডাউনলোড করুন</button>
                    <button type="button" onClick={share} className={BTN_LINE}>শেয়ার করুন</button>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-6">
                <span className="text-[16px] font-medium text-muted">{name.trim()}, আপনার ভ্রমণ ধরন</span>
                <h1 className={`${H1} text-bd-green`}>{result.type.title}</h1>
                <p className="m-0 text-[20px] leading-[1.6] font-medium text-ink tablet:text-[22px]">{result.type.tagline}</p>
                <p className="m-0 text-[17px] leading-[1.75] text-pretty text-[#2a2a2a] tablet:text-[19px]">{result.type.description}</p>
                {result.second && <p className="m-0 text-[16px] leading-[1.7] text-muted">আপনার মধ্যে কিছুটা <b className="font-bold text-ink">{result.second.title}</b>-ও আছে।</p>}
                <div className="flex flex-col gap-3 rounded-[14px] bg-[#f1ede6] px-6 py-6 tablet:px-8 tablet:py-7">
                  <h2 className="m-0 text-[22px] font-bold">আপনার ভ্রমণ পছন্দ</h2>
                  <p className={`${tiro.className} m-0 text-[19px] leading-[1.9] text-pretty text-[#262420] italic tablet:text-[21px]`}>
                    {letter(result, suggested.map(d => d.bn))}
                  </p>
                </div>
                <button type="button" onClick={restart} className={`${BTN_LINE} self-start`}>আবার পরীক্ষা দিন</button>
              </div>
            </section>

            {suggested.length > 0 && (
              <section className="pt-20 tablet:pt-28">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-[#e4e4e4] pb-6 tablet:mb-10">
                  <h2 className="m-0 text-[clamp(30px,3.4vw,48px)] leading-[1.25] font-bold tracking-[-0.02em]">আপনার জন্য সেরা জায়গা</h2>
                  <Link href="/destinations" className={BTN_LINE}>সব গন্তব্য দেখুন →</Link>
                </div>
                <div className="grid grid-cols-1 gap-x-8 gap-y-12 tablet:grid-cols-2 desktop:grid-cols-3">
                  {suggested.map(d => <DestinationCard key={d.id} d={d} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

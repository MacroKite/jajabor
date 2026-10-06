'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Nav from '@/components/Nav';
import { MIN_WORDS, wc } from '@/lib/stories';

const LABEL = 'flex flex-col gap-2 text-[14px] font-medium';
const FIELD = 'rounded-[10px] border border-[#e2e2e2] bg-white px-4.5 py-4 text-[16px] outline-bd-green';
const GRID = 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-5 gap-y-4';

// Shrinks the photo in the browser (max 1600px wide, JPEG) before upload, like the prototype.
function resize(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const rd = new FileReader();
    rd.onerror = () => reject(new Error('read'));
    rd.onload = () => {
      const im = new Image();
      im.onerror = () => reject(new Error('decode'));
      im.onload = () => {
        const sc = Math.min(1, 1600 / im.width), cv = document.createElement('canvas');
        cv.width = Math.round(im.width * sc);
        cv.height = Math.round(im.height * sc);
        cv.getContext('2d')!.drawImage(im, 0, 0, cv.width, cv.height);
        resolve(cv.toDataURL('image/jpeg', 0.8));
      };
      im.src = rd.result as string;
    };
    rd.readAsDataURL(file);
  });
}

export type StoryDraft = { place: string; title: string; text: string; name: string; from: string; image: string };

// Writes a new story, or edits one when `storyId` is given. When editing, `initial.image` is the
// current photo's URL; only a newly chosen photo (a data: URL) is sent to the server.
export default function ShareView({ initial, places, storyId }: { initial: StoryDraft; places: { id: string; name: string }[]; storyId?: string }) {
  const router = useRouter();
  const editing = !!storyId;
  const [f, setF] = useState({ ...initial, website: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const n = wc(f.text);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setF(st => ({ ...st, [k]: v }));
    setErr('');
  };

  const onImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const image = await resize(file);
      setF(st => ({ ...st, image }));
      setErr('');
    } catch {
      setErr('That photo could not be read. Please try a JPG or PNG.');
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const msg = !f.place ? 'Pick the place your story is about.' : !editing && !f.image ? 'Add a photo from your trip.' : !f.title.trim() ? 'Give your story a title.' : n < MIN_WORDS ? `Your story needs at least ${MIN_WORDS} words. You have ${n}.` : !f.name.trim() ? 'Add your name.' : '';
    if (msg) return setErr(msg);
    setBusy(true);
    try {
      const body = { ...f, image: f.image.startsWith('data:') ? f.image : undefined };
      const res = await fetch(editing ? '/api/stories/' + encodeURIComponent(storyId) : '/api/stories', { method: editing ? 'PATCH' : 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(data.error || (res.status === 413 ? 'Your photo is too large. Please try a smaller one.' : editing ? 'Could not save your changes. Please try again.' : 'Could not publish your story. Please try again.')); setBusy(false); return; }
      router.push('/stories/' + data.id);
      router.refresh();
    } catch {
      setErr('Could not reach the server. Check your connection and try again.');
      setBusy(false);
    }
  };

  return (
    <div className="overflow-x-clip bg-white">
      <Nav />

      <header className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6 px-[5vw] pt-10 tablet:pt-16 desktop:pt-24">
        <h1 className="m-0 text-[clamp(44px,10vw,160px)] leading-[0.9] font-bold tracking-[-0.055em]">{editing ? 'Edit your' : 'Share your'} <span className="mesh-word">story</span></h1>
      </header>

      <section className="px-[5vw] pt-10 tablet:pt-16 desktop:pt-24">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <div className={GRID}>
            <label className={LABEL}>Where did you go?
              <select value={f.place} onChange={set('place')} className="select-chevron appearance-none rounded-[10px] font-normal border border-[#e2e2e2] py-4 pr-13 pl-4.5 text-[16px] text-ink outline-bd-green">
                <option value="">Choose a place</option>
                {places.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </label>
            <label className={LABEL}>Title
              <input value={f.title} onChange={set('title')} maxLength={160} placeholder="Two days in Sajek on ৳5,000" className={`${FIELD} font-medium`} />
            </label>
          </div>
          <label className={LABEL}>Your story
            <textarea rows={14} value={f.text} onChange={set('text')} maxLength={30000} placeholder="Start from the beginning. Leave an empty line between paragraphs." className="min-h-[280px] resize-y rounded-[10px] border border-[#e2e2e2] bg-white px-5 py-4.5 text-[17px] leading-[1.65] font-normal outline-bd-green"></textarea>
            <span className={`text-[12px] font-medium ${n < MIN_WORDS ? 'text-faint' : 'text-bd-green'}`}>{n < MIN_WORDS ? `${n} words · write at least ${MIN_WORDS}` : n + ' words'}</span>
          </label>
          <div className={GRID}>
            <label className={LABEL}>Your name
              <input value={f.name} onChange={set('name')} maxLength={80} placeholder="Nusrat Jahan" className={`${FIELD} font-normal`} />
            </label>
            <label className={LABEL}>Where you&apos;re from
              <input value={f.from} onChange={set('from')} maxLength={80} placeholder="Dhaka" className={`${FIELD} font-normal`} />
            </label>
          </div>
          <div className={LABEL}>Photo
            <label className="relative flex max-w-[520px] cursor-pointer items-center gap-4 rounded-[10px] border-[1.5px] border-dashed border-[#d0d0d0] bg-[#fafafa] p-3.5">
              <span className="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#eee]">
                {f.image
                  ? <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${f.image})` }}></span>
                  : <span className="text-[24px] leading-none text-ink">+</span>}
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[15px] font-medium text-ink">{f.image.startsWith('data:') ? 'New photo added · click to change' : f.image ? 'Current photo · click to change' : 'Add a photo'}</span>
                <span className="text-[13px] font-normal text-faint">JPG or PNG, one photo from your trip</span>
              </span>
              <input type="file" accept="image/*" aria-label="Add a photo" onChange={onImage} className="absolute inset-0 size-full cursor-pointer opacity-0" />
            </label>
          </div>
          <label className="sr-only" aria-hidden="true">Website
            <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
          </label>
          {err && <span role="alert" className="text-[14px] font-medium text-bd-red">{err}</span>}
          <div className="flex flex-col gap-3 tablet:flex-row">
            <button type="submit" disabled={busy} className={`flex-1 rounded-[10px] bg-ink p-5 text-[16px] font-bold text-white hover:bg-bd-green ${busy ? 'cursor-wait' : 'cursor-pointer'}`}>{busy ? (editing ? 'Saving…' : 'Publishing…') : editing ? 'Save changes' : 'Publish story'}</button>
            {editing && <Link href={'/stories/' + storyId} className="rounded-[10px] border border-[#e2e2e2] p-5 text-center text-[16px] font-bold tablet:px-10">Cancel</Link>}
          </div>
        </form>
      </section>

    </div>
  );
}

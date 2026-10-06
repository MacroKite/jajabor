'use client';

import { useState } from 'react';

const LABEL = 'flex flex-col gap-2 text-[14px] font-medium';
const INPUT = 'w-full rounded-lg bg-white px-4 py-3.5 text-[15px] font-normal text-ink outline-bd-green';

export default function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', message: '', website: '' });
  const [err, setErr] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'sent'>('idle');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const v = e.target.value; setF(s => ({ ...s, [k]: v })); setErr(''); };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'busy') return;
    const msg = !f.name.trim() ? 'Please add your name.' : !/^\S+@\S+\.\S+$/.test(f.email.trim()) ? 'Please add a valid email.' : f.message.trim().length < 10 ? 'Please write a short message.' : '';
    if (msg) return setErr(msg);
    setState('busy');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setErr(d.error || 'Could not send. Please try again.'); setState('idle'); return; }
      setState('sent');
    } catch {
      setErr('Could not reach the server. Please try again.');
      setState('idle');
    }
  };

  if (state === 'sent') {
    return (
      <div role="status" className="flex min-h-80 flex-col justify-center gap-2.5">
        <span className="flex items-center gap-2.5 text-[22px] font-bold tracking-[-0.02em]"><span className="size-2.5 rounded-full bg-bd-green"></span>Message sent</span>
        <span className="text-[16px] text-muted">Thanks, {f.name.trim().split(' ')[0]}. We&apos;ll reply to {f.email.trim()} soon.</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4.5">
      <label className={LABEL}>Full name
        <input value={f.name} onChange={set('name')} maxLength={80} placeholder="Enter your full name" className={INPUT} />
      </label>
      <label className={LABEL}>Email address
        <input type="email" value={f.email} onChange={set('email')} maxLength={200} placeholder="Enter your email address" className={INPUT} />
      </label>
      <label className={LABEL}>Message
        <textarea rows={6} value={f.message} onChange={set('message')} maxLength={5000} placeholder="Write your message here" className={`${INPUT} resize-y leading-[1.6]`}></textarea>
      </label>
      <label className="sr-only" aria-hidden="true">Website
        <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
      </label>
      {err && <span role="alert" className="text-[14px] font-medium text-bd-red">{err}</span>}
      <button type="submit" disabled={state === 'busy'} className={`mt-2 flex items-center gap-2.5 self-start rounded-lg bg-ink px-4.5 py-3 text-[15px] font-medium text-white hover:bg-bd-green ${state === 'busy' ? 'cursor-wait' : 'cursor-pointer'}`}>{state === 'busy' ? 'Sending…' : 'Send message'} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>
    </form>
  );
}

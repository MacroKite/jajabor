'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

const LABEL = 'flex flex-col gap-2 text-[14px] font-medium';
const FIELD = 'rounded-[10px] border border-[#e2e2e2] bg-white px-4.5 py-3.5 text-[16px] font-normal outline-bd-green';

const ERRORS: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'That email and password don’t match. Try again, or continue with Google if you signed up that way.',
  USER_ALREADY_EXISTS: 'An account with this email already exists. Log in instead.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'An account with this email already exists. Log in instead.',
  PASSWORD_TOO_SHORT: 'Use at least 8 characters for your password.',
  INVALID_EMAIL: 'Please enter a valid email.',
};
const message = (e: { code?: string; message?: string; status?: number }) =>
  (e.code && ERRORS[e.code]) || (e.status === 429 ? 'Too many attempts. Please wait a minute and try again.' : e.message) || 'Something went wrong. Please try again.';

export default function AuthForm({ mode, next, initialError }: { mode: 'login' | 'signup'; next: string; initialError?: string }) {
  const router = useRouter();
  const signup = mode === 'signup';
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState(initialError ?? '');
  const [busy, setBusy] = useState<'' | 'form' | 'google'>('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value; setF(s => ({ ...s, [k]: v })); setErr(''); };

  const google = async () => {
    setBusy('google');
    setErr('');
    const { error } = await authClient.signIn.social({ provider: 'google', callbackURL: next, errorCallbackURL: `/login?error=google&next=${encodeURIComponent(next)}` });
    if (error) { setErr(message(error)); setBusy(''); }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const email = f.email.trim(), name = f.name.trim();
    const msg = signup && !name ? 'Please add your name.' : !/^\S+@\S+\.\S+$/.test(email) ? 'Please enter a valid email.' : f.password.length < (signup ? 8 : 1) ? (signup ? 'Use at least 8 characters for your password.' : 'Please enter your password.') : '';
    if (msg) return setErr(msg);
    setBusy('form');
    const { error } = signup
      ? await authClient.signUp.email({ name, email, password: f.password })
      : await authClient.signIn.email({ email, password: f.password });
    if (error) { setErr(message(error)); setBusy(''); return; }
    router.replace(next);
    router.refresh();
  };

  const other = signup ? '/login' : '/signup';
  const otherHref = next === '/' ? other : `${other}?next=${encodeURIComponent(next)}`;

  return (
    <div className="flex w-full max-w-[440px] flex-col gap-6">
      <button type="button" onClick={google} disabled={!!busy} className={`flex items-center justify-center gap-3 rounded-full border border-[#e2e2e2] bg-white py-3.5 text-[16px] font-medium text-ink hover:border-ink ${busy ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}>
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
        {busy === 'google' ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-4 text-[13px] text-faint"><span className="h-px flex-1 bg-[#e6e6e6]"></span>or with email<span className="h-px flex-1 bg-[#e6e6e6]"></span></div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4.5">
        {signup && (
          <label className={LABEL}>Your name
            <input value={f.name} onChange={set('name')} maxLength={80} autoComplete="name" placeholder="Nusrat Jahan" className={FIELD} />
          </label>
        )}
        <label className={LABEL}>Email
          <input type="email" value={f.email} onChange={set('email')} maxLength={200} autoComplete="email" placeholder="you@example.com" className={FIELD} />
        </label>
        <label className={LABEL}>Password
          <input type="password" value={f.password} onChange={set('password')} maxLength={128} autoComplete={signup ? 'new-password' : 'current-password'} placeholder={signup ? 'At least 8 characters' : 'Your password'} className={FIELD} />
        </label>
        {err && <span role="alert" className="text-[14px] font-medium text-bd-red">{err}</span>}
        <button type="submit" disabled={!!busy} className={`mt-1 rounded-full bg-ink py-4 text-[16px] font-bold text-white hover:bg-bd-green ${busy ? 'cursor-wait' : 'cursor-pointer'}`}>
          {busy === 'form' ? (signup ? 'Creating account…' : 'Logging in…') : signup ? 'Create account' : 'Log in'}
        </button>
      </form>

      <p className="m-0 text-center text-[15px] text-muted">
        {signup ? 'Already have an account?' : 'New to JAJABOR?'}{' '}
        <Link href={otherHref} className="font-bold text-ink underline underline-offset-4">{signup ? 'Log in' : 'Create an account'}</Link>
      </p>
    </div>
  );
}

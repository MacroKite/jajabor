'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Nav from '@/components/Nav';
import Avatar from '@/components/Avatar';
import { authClient, refreshSession } from '@/lib/auth-client';
import { BIO_MAX } from '@/lib/data';
import { resizePhoto } from '@/lib/resize-photo';

type Me = { id: string; name: string; email: string; image: string; hometown: string; bio: string };
type MyStory = { id: string; title: string; href: string; place: string; when: string; img: string };

const LABEL = 'flex flex-col gap-2 text-[14px] font-medium';
const FIELD = 'rounded-[10px] border border-[#e2e2e2] bg-white px-4.5 py-3.5 text-[16px] font-normal outline-bd-green';
const CARD = 'flex flex-col gap-6 rounded-[14px] border border-[#ececec] p-5 tablet:p-8';
const H2 = 'm-0 text-[24px] font-bold tracking-[-0.03em] tablet:text-[28px]';
const PRIMARY = 'cursor-pointer rounded-full bg-ink px-6 py-3.5 text-[15px] font-bold text-white hover:bg-bd-green disabled:cursor-wait disabled:opacity-70';
const SECONDARY = 'cursor-pointer rounded-full border border-[#d9d9d9] bg-white px-5 py-2.5 text-[14px] font-medium hover:border-ink disabled:cursor-wait disabled:opacity-70';

const Note = ({ ok, children }: { ok: boolean; children: React.ReactNode }) =>
  <span role={ok ? 'status' : 'alert'} className={`text-[14px] font-medium ${ok ? 'text-bd-green' : 'text-bd-red'}`}>{children}</span>;

export default function AccountView({ user, hasPassword, stories }: { user: Me; hasPassword: boolean; stories: MyStory[] }) {
  const router = useRouter();

  // Profile
  const [p, setP] = useState({ name: user.name, hometown: user.hometown, bio: user.bio });
  const [image, setImage] = useState(user.image);
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [photoMsg, setPhotoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState<'' | 'profile' | 'photo' | 'password'>('');
  const setField = (k: keyof typeof p) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const v = e.target.value; setP(s => ({ ...s, [k]: v })); setProfileMsg(null); };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p.name.trim()) return setProfileMsg({ ok: false, text: 'Please add your name.' });
    setBusy('profile');
    const { error } = await authClient.updateUser({ name: p.name.trim(), hometown: p.hometown.trim(), bio: p.bio.trim() });
    setBusy('');
    if (error) return setProfileMsg({ ok: false, text: error.message || 'Could not save. Please try again.' });
    setProfileMsg({ ok: true, text: 'Saved. Your stories now show these details.' });
    router.refresh();
  };

  const photo = async (file: File | null) => {
    setPhotoMsg(null);
    setBusy('photo');
    try {
      const res = file
        ? await fetch('/api/account/avatar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ image: await resizePhoto(file, 800) }) })
        : await fetch('/api/account/avatar', { method: 'DELETE' });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || 'Could not save your photo. Please try again.');
      setImage(file ? d.image : '');
      setPhotoMsg({ ok: true, text: file ? 'Photo updated.' : 'Photo removed.' });
      refreshSession();
      router.refresh();
    } catch (err) {
      setPhotoMsg({ ok: false, text: err instanceof Error && err.message !== 'read' && err.message !== 'decode' ? err.message : 'That photo could not be read. Please try a JPG or PNG.' });
    }
    setBusy('');
  };

  // Password
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const setPwField = (k: keyof typeof pw) => (e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value; setPw(s => ({ ...s, [k]: v })); setPwMsg(null); };
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = !pw.current ? 'Enter your current password.' : pw.next.length < 8 ? 'Use at least 8 characters for your new password.' : pw.next !== pw.confirm ? 'The new passwords don’t match.' : '';
    if (msg) return setPwMsg({ ok: false, text: msg });
    setBusy('password');
    const { error } = await authClient.changePassword({ currentPassword: pw.current, newPassword: pw.next, revokeOtherSessions: true });
    setBusy('');
    if (error) return setPwMsg({ ok: false, text: error.code === 'INVALID_PASSWORD' ? 'Your current password isn’t right.' : error.message || 'Could not change your password.' });
    setPw({ current: '', next: '', confirm: '' });
    setPwMsg({ ok: true, text: 'Password changed. You’ve been logged out on your other devices.' });
  };

  const logOut = async () => { await authClient.signOut(); router.replace('/'); router.refresh(); };

  return (
    <div className="overflow-x-clip bg-white">
      <Nav />

      <header className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6 px-[5vw] pt-10 tablet:pt-16 desktop:pt-24">
        <h1 className="m-0 text-[clamp(44px,10vw,160px)] leading-[0.9] font-bold tracking-[-0.055em]">Your <span className="mesh-word">profile</span></h1>
        <Link href={`/travellers/${user.id}`} className="mb-2 text-[15px] font-bold underline underline-offset-4">View your public profile →</Link>
      </header>

      <div className="grid gap-6 px-[5vw] pt-10 tablet:pt-14 desktop:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] desktop:items-start desktop:gap-8">
        <div className="flex flex-col gap-6">
          {/* Profile */}
          <section className={CARD}>
            <h2 className={H2}>About you</h2>
            <div className="flex flex-wrap items-center gap-5">
              <Avatar name={p.name || user.email} image={image} className="size-24 text-[36px]" />
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <label className={`${SECONDARY} relative ${busy === 'photo' ? 'cursor-wait opacity-70' : ''}`}>
                    {busy === 'photo' ? 'Saving…' : image ? 'Change photo' : 'Add a photo'}
                    <input type="file" accept="image/*" disabled={!!busy} onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; if (f) photo(f); }} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Choose a profile photo" />
                  </label>
                  {image && <button type="button" disabled={!!busy} onClick={() => photo(null)} className={SECONDARY}>Remove</button>}
                </div>
                <span className="text-[13px] text-faint">JPG or PNG. We crop it to a circle around your face.</span>
                {photoMsg && <Note ok={photoMsg.ok}>{photoMsg.text}</Note>}
              </div>
            </div>

            <form onSubmit={saveProfile} noValidate className="flex flex-col gap-4.5">
              <div className="grid gap-4.5 tablet:grid-cols-2">
                <label className={LABEL}>Name
                  <input value={p.name} onChange={setField('name')} maxLength={80} autoComplete="name" className={FIELD} />
                </label>
                <label className={LABEL}>Where you’re from
                  <input value={p.hometown} onChange={setField('hometown')} maxLength={80} placeholder="Dhaka" className={FIELD} />
                </label>
              </div>
              <label className={LABEL}>About you
                <textarea rows={4} value={p.bio} onChange={setField('bio')} maxLength={BIO_MAX} placeholder="A line or two about how you like to travel." className={`${FIELD} resize-y leading-[1.6]`}></textarea>
                <span className="text-[12px] font-normal text-faint">{p.bio.length}/{BIO_MAX} · shown on your public profile</span>
              </label>
              <label className={LABEL}>Email
                <input value={user.email} readOnly className={`${FIELD} bg-[#f4f4f4] text-muted`} />
                <span className="text-[12px] font-normal text-faint">Only you can see this.</span>
              </label>
              {profileMsg && <Note ok={profileMsg.ok}>{profileMsg.text}</Note>}
              <button type="submit" disabled={!!busy} className={`${PRIMARY} self-start`}>{busy === 'profile' ? 'Saving…' : 'Save profile'}</button>
            </form>
          </section>

          {/* Password */}
          <section className={CARD}>
            <h2 className={H2}>Password</h2>
            {hasPassword ? (
              <form onSubmit={changePassword} noValidate className="flex flex-col gap-4.5">
                <label className={LABEL}>Current password
                  <input type="password" value={pw.current} onChange={setPwField('current')} autoComplete="current-password" className={FIELD} />
                </label>
                <div className="grid gap-4.5 tablet:grid-cols-2">
                  <label className={LABEL}>New password
                    <input type="password" value={pw.next} onChange={setPwField('next')} autoComplete="new-password" placeholder="At least 8 characters" className={FIELD} />
                  </label>
                  <label className={LABEL}>Repeat new password
                    <input type="password" value={pw.confirm} onChange={setPwField('confirm')} autoComplete="new-password" className={FIELD} />
                  </label>
                </div>
                {pwMsg && <Note ok={pwMsg.ok}>{pwMsg.text}</Note>}
                <button type="submit" disabled={!!busy} className={`${PRIMARY} self-start`}>{busy === 'password' ? 'Changing…' : 'Change password'}</button>
              </form>
            ) : (
              <p className="m-0 text-[15px] text-muted">You log in with Google, so there’s no JAJABOR password to change.</p>
            )}
          </section>
        </div>

        {/* Stories */}
        <section className={CARD}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className={H2}>Your stories <span className="text-faint">{stories.length}</span></h2>
            <Link href="/share" className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-bold text-white hover:bg-bd-green hover:text-white">Write a story</Link>
          </div>
          {stories.length ? (
            <ul className="m-0 flex list-none flex-col p-0">
              {stories.map(s => (
                <li key={s.id} className="flex items-center gap-4 border-t border-[#ececec] py-4 first:border-t-0 first:pt-0">
                  <div className="relative aspect-[16/11] w-24 shrink-0 overflow-hidden rounded-lg bg-frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {s.img && <img src={s.img} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Link href={s.href} className="line-clamp-2 text-[16px] leading-tight font-bold">{s.title}</Link>
                    <span className="text-[13px] text-muted">{s.place} · {s.when}</span>
                  </div>
                  <Link href={`${s.href}/edit`} className={SECONDARY}>Edit</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 text-[15px] text-muted">You haven’t shared a story yet. Your first one will appear here.</p>
          )}
        </section>
      </div>

      <div className="px-[5vw] pt-10">
        <button type="button" onClick={logOut} className={SECONDARY}>Log out</button>
      </div>
    </div>
  );
}

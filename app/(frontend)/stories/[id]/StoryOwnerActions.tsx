'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

// Edit and delete buttons, shown only to the story's author. Rendered in the browser so the
// story page itself stays cached; the API checks ownership again on every change.
export default function StoryOwnerActions({ id, authorId }: { id: string; authorId?: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  if (!authorId || session?.user.id !== authorId) return null;

  const remove = async () => {
    setBusy(true);
    setErr('');
    try {
      const res = await fetch('/api/stories/' + encodeURIComponent(id), { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErr(d.error || 'Could not delete your story. Please try again.');
        setBusy(false);
        return;
      }
      router.replace('/stories');
      router.refresh();
    } catch {
      setErr('Could not reach the server. Check your connection and try again.');
      setBusy(false);
    }
  };

  const BTN = 'cursor-pointer rounded-full border px-4.5 py-2.5 text-[14px] font-bold';

  return (
    <div className="mb-8 flex flex-col gap-3 rounded-[10px] bg-[#f4f4f4] p-4 tablet:mb-10 tablet:flex-row tablet:flex-wrap tablet:items-center tablet:justify-between">
      {confirming ? (
        <>
          <span className="text-[15px] font-medium">Delete this story and its photo? This can’t be undone.</span>
          <div className="flex gap-2">
            <button type="button" onClick={remove} disabled={busy} className={`${BTN} border-bd-red bg-bd-red text-white ${busy ? 'cursor-wait opacity-70' : ''}`}>{busy ? 'Deleting…' : 'Yes, delete'}</button>
            <button type="button" onClick={() => { setConfirming(false); setErr(''); }} disabled={busy} className={`${BTN} border-[#d9d9d9] bg-white`}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <span className="text-[15px] text-muted">This is your story.</span>
          <div className="flex gap-2">
            <Link href={`/stories/${id}/edit`} className={`${BTN} border-ink bg-ink text-white hover:border-bd-green hover:bg-bd-green hover:text-white`}>Edit</Link>
            <button type="button" onClick={() => setConfirming(true)} className={`${BTN} border-[#d9d9d9] bg-white hover:border-bd-red hover:text-bd-red`}>Delete</button>
          </div>
        </>
      )}
      {err && <span role="alert" className="text-[14px] font-medium text-bd-red tablet:basis-full">{err}</span>}
    </div>
  );
}

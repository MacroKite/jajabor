'use client';

import { useEffect, useRef, useState } from 'react';

const BTN = 'flex cursor-pointer transition-opacity duration-200 hover:opacity-70';

export default function ShareButtons({ path, title, img }: { path: string; title: string; img: string }) {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);

  const E = encodeURIComponent;
  const url = () => window.location.origin + path;
  const txt = title + ' | Jajabor';
  const open = (u: string) => window.open(u, '_blank', 'noopener');
  const copy = async () => {
    try { await navigator.clipboard.writeText(url()); } catch {}
    setCopied(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mt-14 flex flex-col gap-4 tablet:mt-20">
      <span className="text-[18px] font-medium text-muted">Share this story</span>
      <div className="flex items-center gap-6">
        <button onClick={() => open('https://www.facebook.com/sharer/sharer.php?u=' + E(url()))} aria-label="Share on Facebook" className={BTN}><svg width="34" height="34" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#141414"></circle><path fill="#fff" d="M13.2 19v-6h2l.3-2.4h-2.3V9.1c0-.7.2-1.2 1.2-1.2h1.2V5.8c-.2 0-1-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.8h-2V13h2v6z"></path></svg></button>
        <button onClick={() => open('https://twitter.com/intent/tweet?text=' + E(txt) + '&url=' + E(url()))} aria-label="Share on X" className={BTN}><svg width="34" height="34" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#141414"></circle><path fill="#fff" d="M15.6 6.5h1.8l-4 4.5 4.7 6.5h-3.7l-2.9-3.8-3.3 3.8H6.4l4.2-4.9-4.5-6.1h3.8l2.6 3.5zm-.6 9.9h1l-6.5-8.9H8.4z"></path></svg></button>
        <button onClick={() => open('https://pinterest.com/pin/create/button/?url=' + E(url()) + '&description=' + E(txt) + (img ? '&media=' + E(img) : ''))} aria-label="Share on Pinterest" className={BTN}><svg width="34" height="34" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#141414"></circle><path fill="#fff" d="M12.2 5.2c-3.8 0-5.7 2.7-5.7 5 0 1.4.5 2.6 1.6 3 .2.1.3 0 .4-.2l.2-.6c0-.2 0-.3-.1-.4-.3-.4-.5-.9-.5-1.6 0-2.1 1.6-4 4.1-4 2.2 0 3.5 1.4 3.5 3.2 0 2.4-1.1 4.4-2.6 4.4-.9 0-1.5-.7-1.3-1.6.2-1 .7-2.2.7-3 0-.7-.4-1.3-1.2-1.3-.9 0-1.7 1-1.7 2.2 0 .8.3 1.3.3 1.3l-1.1 4.6c-.3 1.3-.1 3-.1 3.2 0 .1.1.1.2 0 .1-.1 1.2-1.5 1.5-2.8l.6-2.3c.3.6 1.2 1.1 2.1 1.1 2.8 0 4.7-2.6 4.7-6 0-2.6-2.2-5.1-5.6-5.1z"></path></svg></button>
        <button onClick={() => open('https://wa.me/?text=' + E(txt + ' ' + url()))} aria-label="Share on WhatsApp" className={BTN}><svg width="34" height="34" viewBox="0 0 24 24"><path fill="#141414" d="M12 .5A11.5 11.5 0 0 0 2.1 17.8L.5 23.5l5.9-1.5A11.5 11.5 0 1 0 12 .5z"></path><path fill="#fff" d="M8.6 6.4c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.8 5.9 5.2 2.9 1.1 3.5.9 4.1.9.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.1-.3-.2-.7-.4l-2.3-1.1c-.3-.1-.5-.2-.8.2l-1 1.3c-.2.2-.4.2-.7.1-.4-.2-1.5-.5-2.8-1.7-1-.9-1.7-2-1.9-2.4-.2-.4 0-.5.2-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6z"></path></svg></button>
        <button onClick={copy} aria-label="Copy link" className={`${BTN} items-center gap-2.5`}><svg width="34" height="34" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#141414"></circle><path fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" d="M10.6 13.4a3 3 0 0 0 4.2 0l2-2a3 3 0 0 0-4.2-4.2l-.7.7M13.4 10.6a3 3 0 0 0-4.2 0l-2 2a3 3 0 0 0 4.2 4.2l.7-.7"></path></svg>{copied && <span role="status" className="text-[14px] font-medium text-bd-green">Link copied</span>}</button>
      </div>
    </div>
  );
}

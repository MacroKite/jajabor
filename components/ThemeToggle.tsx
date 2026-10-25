'use client';

import { useSyncExternalStore } from 'react';

// Switches between light and dark mode and remembers the choice. Until someone uses it, the site
// follows the system setting (see the theme script in components/SiteDocument.tsx).

const root = () => document.documentElement;
const isDark = () => root().dataset.theme === 'dark';
const subscribe = (onChange: () => void) => {
  const mo = new MutationObserver(onChange);
  mo.observe(root(), { attributes: true, attributeFilter: ['data-theme'] });
  return () => mo.disconnect();
};

const MOON = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"></path></svg>;
const SUN = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>;

export default function ThemeToggle({ className = '' }: { className?: string }) {
  // null while rendering on the server, which doesn't know the theme.
  const dark = useSyncExternalStore(subscribe, isDark, () => null);

  const toggle = () => {
    const next = isDark() ? 'light' : 'dark';
    root().dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
  };

  return (
    <button type="button" onClick={toggle} aria-label="Dark mode" aria-pressed={dark ?? undefined} className={`flex size-10 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-sunken ${className}`}>
      {/* CSS picks the icon, so it is right from the first paint. */}
      <span className="dark:hidden">{MOON}</span>
      <span className="hidden dark:inline">{SUN}</span>
    </button>
  );
}

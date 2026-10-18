'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// "Analytics" at the top of the CMS sidebar, styled like Payload's own links.
export function AnalyticsNavLink() {
  const href = '/admin/analytics';
  const active = usePathname() === href;
  const label = <>{active && <div className="nav__link-indicator" />}<span className="nav__link-label">Analytics</span></>;
  return active
    ? <div className="nav__link" id="nav-analytics">{label}</div>
    : <Link className="nav__link" id="nav-analytics" href={href} prefetch={false}>{label}</Link>;
}

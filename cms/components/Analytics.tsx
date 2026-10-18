import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { AdminViewServerProps } from 'payload';
import { DefaultTemplate } from '@payloadcms/next/templates';
import { Gutter } from '@payloadcms/ui';
import { getStats, type Count } from '@/lib/analytics';

// The Analytics screen at /admin/analytics: page views counted by components/PageViewTracker.

const RANGES = [7, 30, 90];
const n = (x: number) => x.toLocaleString('en-US');
const countries = new Intl.DisplayNames(['en'], { type: 'region' });
const countryName = (code: string) => { try { return countries.of(code) ?? code; } catch { return code; } };
const dayLabel = (key: string, opts: Intl.DateTimeFormatOptions) => new Date(`${key}T00:00:00Z`).toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts });

const css = `
.jj-an { --bar: #2a78d6; --muted: var(--theme-elevation-500); --line: var(--theme-elevation-100); padding-bottom: 80px; }
html[data-theme="dark"] .jj-an { --bar: #3987e5; }
.jj-an h1 { margin: 0; }
.jj-an__head { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; margin: 24px 0 28px; }
.jj-an__ranges { display: flex; gap: 4px; padding: 3px; border: 1px solid var(--line); border-radius: 8px; }
.jj-an__ranges a { padding: 5px 12px; border-radius: 5px; text-decoration: none; color: var(--muted); font-size: 13px; }
.jj-an__ranges a[aria-current] { background: var(--theme-elevation-100); color: var(--theme-text); font-weight: 600; }
.jj-an__tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-bottom: 28px; }
.jj-an__tile { border: 1px solid var(--line); border-radius: 8px; padding: 16px 18px; }
.jj-an__tile span { display: block; color: var(--muted); font-size: 13px; }
.jj-an__tile strong { display: block; font-size: 30px; line-height: 1.2; margin-top: 4px; font-variant-numeric: tabular-nums; }
.jj-an__card { border: 1px solid var(--line); border-radius: 8px; padding: 18px; }
.jj-an__card h2 { font-size: 15px; margin: 0 0 14px; }
.jj-an__chart { display: flex; align-items: flex-end; gap: 2px; height: 180px; border-bottom: 1px solid var(--line); }
.jj-an__col { position: relative; flex: 1; height: 100%; display: flex; align-items: flex-end; }
.jj-an__col i { display: block; width: 100%; background: var(--bar); border-radius: 4px 4px 0 0; min-height: 1px; }
.jj-an__col:hover i { opacity: .8; }
.jj-an__tip { display: none; position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); white-space: nowrap; z-index: 2;
  background: var(--theme-elevation-900); color: var(--theme-elevation-0); font-size: 12px; padding: 6px 9px; border-radius: 5px; pointer-events: none; }
.jj-an__col:hover .jj-an__tip { display: block; }
.jj-an__col:first-child .jj-an__tip { left: 0; transform: none; }
.jj-an__col:last-child .jj-an__tip { left: auto; right: 0; transform: none; }
.jj-an__axis { display: flex; justify-content: space-between; color: var(--muted); font-size: 12px; margin-top: 6px; }
.jj-an details { margin-top: 12px; font-size: 13px; }
.jj-an summary { cursor: pointer; color: var(--muted); }
.jj-an__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 12px; margin-top: 12px; }
.jj-an table { width: 100%; border-collapse: collapse; font-size: 13px; }
.jj-an th { text-align: left; font-weight: 500; color: var(--muted); padding: 0 0 6px; }
.jj-an td { padding: 5px 0; border-top: 1px solid var(--line); vertical-align: middle; }
.jj-an th.num, .jj-an td.num { text-align: right; width: 70px; font-variant-numeric: tabular-nums; }
.jj-an__label { position: relative; padding: 3px 8px; overflow-wrap: anywhere; }
.jj-an__label b { position: absolute; inset: 0 auto 0 0; background: var(--bar); opacity: .16; border-radius: 4px; }
.jj-an__label span { position: relative; }
.jj-an__empty { color: var(--muted); font-size: 13px; margin: 0; }
`;

function Table({ title, label, rows, format = (k: string) => k }: { title: string; label: string; rows: Count[]; format?: (k: string) => React.ReactNode }) {
  const max = Math.max(1, ...rows.map(r => r.views));
  return (
    <section className="jj-an__card">
      <h2>{title}</h2>
      {rows.length === 0 ? <p className="jj-an__empty">No data yet.</p> : (
        <table>
          <thead><tr><th>{label}</th><th className="num">Visitors</th><th className="num">Views</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.key}>
                <td><div className="jj-an__label"><b style={{ width: `${(r.views / max) * 100}%` }} /><span>{format(r.key)}</span></div></td>
                <td className="num">{n(r.visitors)}</td>
                <td className="num">{n(r.views)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export async function AnalyticsView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult;
  if (!req.user) redirect('/admin/login?redirect=%2Fadmin%2Fanalytics');

  const days = RANGES.includes(Number(searchParams?.days)) ? Number(searchParams?.days) : 30;
  const s = await getStats(days);
  const max = Math.max(1, ...(s?.daily.map(d => d.views) ?? []));

  return (
    <DefaultTemplate
      i18n={req.i18n} locale={locale} params={params} payload={req.payload} permissions={permissions}
      searchParams={searchParams} user={req.user ?? undefined} visibleEntities={visibleEntities}
    >
      <Gutter className="jj-an">
        <style>{css}</style>
        <div className="jj-an__head">
          <h1>Analytics</h1>
          <nav className="jj-an__ranges" aria-label="Date range">
            {RANGES.map(r => <Link key={r} href={`?days=${r}`} aria-current={r === days ? 'page' : undefined}>Last {r} days</Link>)}
          </nav>
        </div>

        {!s ? <p className="jj-an__empty">The database isn&apos;t connected (MONGODB_URI is not set).</p> : (
          <>
            <div className="jj-an__tiles">
              <div className="jj-an__tile"><span>Visitors · {days} days</span><strong>{n(s.visitors)}</strong></div>
              <div className="jj-an__tile"><span>Page views · {days} days</span><strong>{n(s.views)}</strong></div>
              <div className="jj-an__tile"><span>Visitors today</span><strong>{n(s.today.visitors)}</strong></div>
              <div className="jj-an__tile"><span>Page views today</span><strong>{n(s.today.views)}</strong></div>
            </div>

            <section className="jj-an__card">
              <h2>Page views per day</h2>
              <div className="jj-an__chart">
                {s.daily.map(d => (
                  <div key={d.key} className="jj-an__col">
                    <i style={{ height: `${(d.views / max) * 100}%` }} />
                    <span className="jj-an__tip">{dayLabel(d.key, { weekday: 'short', day: 'numeric', month: 'short' })}: {n(d.views)} views, {n(d.visitors)} visitors</span>
                  </div>
                ))}
              </div>
              <div className="jj-an__axis">
                <span>{dayLabel(s.daily[0].key, { day: 'numeric', month: 'short' })}</span>
                <span>Today</span>
              </div>
              <details>
                <summary>Show as table</summary>
                <table style={{ marginTop: 8 }}>
                  <thead><tr><th>Day</th><th className="num">Visitors</th><th className="num">Views</th></tr></thead>
                  <tbody>
                    {[...s.daily].reverse().map(d => (
                      <tr key={d.key}><td>{dayLabel(d.key, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</td><td className="num">{n(d.visitors)}</td><td className="num">{n(d.views)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </section>

            <div className="jj-an__grid">
              <Table title="Top pages" label="Page" rows={s.pages} format={k => <a href={k} target="_blank" rel="noreferrer">{k}</a>} />
              <Table title="Where visitors came from" label="Site" rows={s.referrers} />
              <Table title="Countries" label="Country" rows={s.countries} format={countryName} />
              <Table title="Devices" label="Device" rows={s.devices} />
            </div>
            <p className="jj-an__empty" style={{ marginTop: 16 }}>
              Visitors are counted once per day, without cookies. Search engine bots and link previews aren&apos;t counted. Days are in UTC.
            </p>
          </>
        )}
      </Gutter>
    </DefaultTemplate>
  );
}

import { createHash } from 'crypto';
import mongoose from 'mongoose';
import { MONGODB_URI, connect } from './mongodb';

// First-party page view counts for the Analytics screen in the CMS. No cookies and no raw IPs:
// a visitor is a hash of IP + browser + a salt that changes every day, so one person counts
// once per day and can't be followed from one day to the next.

type View = { path: string; visitor: string; referrer: string | null; country: string | null; device: string; at: Date };

const views = () => mongoose.connection.db!.collection<View>('pageviews');

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless|lighthouse|pingdom|curl|wget|python|axios|node-fetch/i;

const day = (d = new Date()) => d.toISOString().slice(0, 10);

let indexed: Promise<unknown> | undefined;

export async function recordView(v: { path: string; referrer: string | null; ip: string; ua: string; country: string | null }): Promise<void> {
  if (!MONGODB_URI || !v.ua || BOT.test(v.ua)) return;
  await connect();
  indexed ??= views().createIndex({ at: -1 }).catch(() => (indexed = undefined));
  const visitor = createHash('sha256').update(`${process.env.PAYLOAD_SECRET}|${day()}|${v.ip}|${v.ua}`).digest('hex').slice(0, 16);
  const device = /iPad|Tablet/i.test(v.ua) ? 'Tablet' : /Mobi|Android|iPhone/i.test(v.ua) ? 'Mobile' : 'Desktop';
  await views().insertOne({ path: v.path, visitor, referrer: v.referrer, country: v.country, device, at: new Date() });
}

export type Count = { key: string; views: number; visitors: number };
export type Stats = {
  views: number;
  visitors: number;
  today: { views: number; visitors: number };
  daily: Count[];
  pages: Count[];
  referrers: Count[];
  countries: Count[];
  devices: Count[];
};

const top = (field: unknown, limit: number) => [
  { $group: { _id: { k: field, v: '$visitor' }, n: { $sum: 1 } } },
  { $group: { _id: '$_id.k', views: { $sum: '$n' }, visitors: { $sum: 1 } } },
  { $sort: { views: -1 as const } },
  { $limit: limit },
  { $project: { _id: 0, key: { $ifNull: ['$_id', ''] }, views: 1, visitors: 1 } },
];

// Totals for the last `days` days, today included. Days are UTC, like the visitor salt.
export async function getStats(days: number): Promise<Stats | null> {
  if (!MONGODB_URI) return null;
  await connect();
  const start = new Date(`${day()}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const [r] = await views().aggregate<Omit<Stats, 'daily' | 'today'> & { totals: { views: number; visitors: number }[]; daily: Count[] }>([
    { $match: { at: { $gte: start } } },
    {
      $facet: {
        totals: [
          { $group: { _id: { d: { $dateToString: { date: '$at', format: '%Y-%m-%d' } }, v: '$visitor' }, n: { $sum: 1 } } },
          { $group: { _id: null, views: { $sum: '$n' }, visitors: { $sum: 1 } } },
        ],
        daily: top({ $dateToString: { date: '$at', format: '%Y-%m-%d' } }, days),
        pages: top('$path', 15),
        referrers: [{ $match: { referrer: { $ne: null } } }, ...top('$referrer', 10)],
        countries: [{ $match: { country: { $ne: null } } }, ...top('$country', 10)],
        devices: top('$device', 3),
      },
    },
  ]).toArray();

  // Fill in days with no views, so the chart has one bar per day.
  const byDay = new Map(r.daily.map(d => [d.key, d]));
  const daily: Count[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    const key = day(d);
    daily.push(byDay.get(key) ?? { key, views: 0, visitors: 0 });
  }
  const t = daily[daily.length - 1];
  return {
    views: r.totals[0]?.views ?? 0,
    visitors: r.totals[0]?.visitors ?? 0,
    today: { views: t.views, visitors: t.visitors },
    daily, pages: r.pages, referrers: r.referrers, countries: r.countries, devices: r.devices,
  };
}

import { cache } from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';
import type { Destination as CmsDestination, Media } from '@/payload-types';
import type { Destination, PhotoCredit } from './data';
import { cld } from './images';

// Site content edited in the CMS at /admin, read on the server through Payload's local API.
// Each function is cached for the length of one request.

const cms = () => getPayload({ config });

// A media field holds either the photo document or (if not loaded) just its id.
const img = (m: string | Media | null | undefined, w: number) => {
  if (!m || typeof m === 'string') return '';
  const id = (m as Media & { cloudinaryId?: string }).cloudinaryId;
  return id ? cld(id, w) : m.url ?? '';
};

// The photographer and licence entered for a photo in the CMS, if any.
const credit = (m: string | Media | null | undefined): PhotoCredit | null =>
  m && typeof m !== 'string' && m.credit ? { text: m.credit, source: m.source || undefined } : null;

const toDestination = (d: CmsDestination): Destination => {
  const gallery = (d.gallery ?? []).filter(g => img(g, 900));
  return {
    id: d.slug,
    type: d.type,
    name: d.name,
    bn: d.bn,
    district: d.district,
    blurb: d.blurb,
    img: img(d.image, 1400),
    gallery: gallery.map(g => img(g, 900)),
    credits: [credit(d.image), ...gallery.map(credit)],
    article: d.article,
  };
};

// In the order set by dragging rows in the CMS.
export const getDestinations = cache(async (): Promise<Destination[]> => {
  const { docs } = await (await cms()).find({ collection: 'destinations', depth: 1, limit: 500, pagination: false, sort: '_order' });
  return docs.map(toDestination);
});

export const getDestination = cache(async (slug: string) => (await getDestinations()).find(d => d.id === slug) ?? null);

export type HomeContent = {
  heroSubtitle: string;
  introText: string;
  mosaic: { img: string; label: string; wide: boolean; tall: boolean }[];
  introPhotos: string[];
};

export const getHome = cache(async (): Promise<HomeContent> => {
  const h = await (await cms()).findGlobal({ slug: 'home', depth: 1 });
  return {
    heroSubtitle: h.heroSubtitle ?? '',
    introText: h.introText ?? '',
    mosaic: (h.mosaic ?? []).map(m => ({ img: img(m.image, 900), label: m.label, wide: !!m.wide, tall: !!m.tall })).filter(m => m.img),
    introPhotos: (h.introPhotos ?? []).map(p => img(p, 600)).filter(Boolean),
  };
});

export const getFaq = cache(async () => {
  const f = await (await cms()).findGlobal({ slug: 'faq' });
  return (f.items ?? []).map(i => ({ q: i.question, a: i.answer }));
});

export type Contact = {
  email: string;
  phone: string;
  address: string;
  social: { facebook?: string; instagram?: string; youtube?: string };
};

export const getAbout = cache(async () => {
  const a = await (await cms()).findGlobal({ slug: 'about', depth: 1 });
  return {
    subtitle: a.subtitle ?? '',
    heroImage: img(a.heroImage, 1800),
    whoWeAre: (a.whoWeAre ?? '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean),
    contactIntro: a.contactIntro ?? '',
    contact: {
      email: a.contact?.email ?? '',
      phone: a.contact?.phone ?? '',
      address: a.contact?.address ?? '',
      social: { facebook: a.social?.facebook || undefined, instagram: a.social?.instagram || undefined, youtube: a.social?.youtube || undefined },
    } satisfies Contact,
  };
});

export type CreditEntry = { id: string; thumb: string; alt: string; credit: string; source?: string; usedOn: string[] };

// Every photo the site currently shows, with who took it, for the /credits page.
export const getPhotoCredits = cache(async (): Promise<CreditEntry[]> => {
  const p = await cms();
  const [{ docs: dests }, home, about] = await Promise.all([
    p.find({ collection: 'destinations', depth: 1, limit: 500, pagination: false, sort: '_order' }),
    p.findGlobal({ slug: 'home', depth: 1 }),
    p.findGlobal({ slug: 'about', depth: 1 }),
  ]);
  const byId = new Map<string, CreditEntry>();
  const add = (m: string | Media | null | undefined, place: string) => {
    if (!m || typeof m === 'string') return;
    const id = String(m.id);
    const e = byId.get(id) ?? { id, thumb: img(m, 480), alt: m.alt, credit: m.credit || '', source: m.source || undefined, usedOn: [] };
    if (!e.usedOn.includes(place)) e.usedOn.push(place);
    byId.set(id, e);
  };
  for (const d of dests) { add(d.image, d.name); for (const g of d.gallery ?? []) add(g, d.name); }
  for (const m of home.mosaic ?? []) add(m.image, 'Home page');
  for (const m of home.introPhotos ?? []) add(m, 'Home page');
  add(about.heroImage, 'About page');
  return [...byId.values()];
});

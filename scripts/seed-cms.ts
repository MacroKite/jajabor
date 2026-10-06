// One-time: copy the original destinations, home page, FAQ and About content into the CMS.
// Run with: npx payload run scripts/seed-cms.ts
// Photos are copied from Cloudinary (trip/places/) into the CMS media library (trip/media/).
// Safe to re-run: it stops if destinations already exist.
import fs from 'fs';
import path from 'path';
import { getPayload } from 'payload';
import { v2 as cloudinary } from 'cloudinary';
import config from '../payload.config';
import { DESTS } from './seed/destinations';
import { ABOUT, FAQ, HOME } from './seed/content';

const payload = await getPayload({ config });

if ((await payload.count({ collection: 'destinations' })).totalDocs > 0) {
  payload.logger.info('Destinations already exist; nothing to do.');
  process.exit(0);
}

const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
const idFromUrl = (url: string) => url.match(/trip\/places\/([^/?]+)$/)![1];

// Each photo is copied once, even if it is used in several places.
const media = new Map<string, string>();
async function photo(id: string, alt: string): Promise<string> {
  const known = media.get(id);
  if (known) return known;
  const res = await fetch(`https://res.cloudinary.com/${cloud}/image/upload/trip/places/${id}`);
  if (!res.ok) throw new Error(`download ${id}: ${res.status}`);
  const data = Buffer.from(await res.arrayBuffer());
  const info = await cloudinary.api.resource(`trip/places/${id}`, { context: true }).catch(() => null);
  const doc = await payload.create({
    collection: 'media',
    data: { alt, credit: 'Wikimedia Commons contributors, CC BY-SA', source: info?.context?.custom?.source ?? '' },
    file: { data, mimetype: res.headers.get('content-type') || 'image/jpeg', name: `${id}.jpg`, size: data.length },
  });
  media.set(id, String(doc.id));
  payload.logger.info(`photo: ${id}`);
  return String(doc.id);
}

for (const d of DESTS) {
  const image = await photo(idFromUrl(d.img), d.name);
  const gallery = [];
  for (const g of d.gallery) gallery.push(await photo(idFromUrl(g), d.name));
  await payload.create({
    collection: 'destinations',
    data: { slug: d.id, name: d.name, bn: d.bn, type: d.type, district: d.district, blurb: d.blurb, image, gallery, article: d.article },
  });
  payload.logger.info(`destination: ${d.name}`);
}

const mosaic = [];
for (const [id, label, wide, tall] of HOME.mosaic) mosaic.push({ image: await photo(id, label), label, wide, tall });
const introPhotos = [];
for (const id of HOME.introPhotos) introPhotos.push(await photo(id, id.replace(/-/g, ' ')));
await payload.updateGlobal({ slug: 'home', data: { heroSubtitle: HOME.heroSubtitle, introText: HOME.introText, mosaic, introPhotos } });
payload.logger.info('home page');

await payload.updateGlobal({ slug: 'faq', data: { items: FAQ } });
payload.logger.info('faq');

const heroData = fs.readFileSync(path.resolve(ABOUT.heroFile));
const hero = await payload.create({
  collection: 'media',
  data: { alt: ABOUT.heroAlt },
  file: { data: heroData, mimetype: 'image/jpeg', name: 'about-hero.jpg', size: heroData.length },
});
await payload.updateGlobal({
  slug: 'about',
  data: { subtitle: ABOUT.subtitle, heroImage: hero.id, whoWeAre: ABOUT.whoWeAre, contactIntro: ABOUT.contactIntro, contact: ABOUT.contact, social: {} },
});
payload.logger.info('about page');

payload.logger.info(`Done: ${DESTS.length} destinations, ${media.size + 1} photos.`);
process.exit(0);

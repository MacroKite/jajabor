import type { Destination } from './data';

// Lowercase and drop apostrophes and punctuation, so "coxs bazar" finds "Cox's Bazar".
const norm = (s: string) => s.toLowerCase().replace(/[’'`]/g, '').replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ').trim();

// True when some word in `text` starts with `w`: "baz" finds "Bazar" but not "Moulvibazar".
const startsWord = (text: string, w: string) => (' ' + text).includes(' ' + w);

// Destinations matching every word of the query, best first: a word in the name (English or
// Bangla) counts most, then the district, the short description, and finally the guide text.
export function searchDestinations(dests: Destination[], query: string): Destination[] {
  const words = norm(query).split(' ').filter(Boolean);
  if (!words.length) return [];
  const scored = dests.map((d, order) => {
    const fields: [string, number][] = [
      [norm(d.name + ' ' + d.bn), 10],
      [norm(d.district), 5],
      [norm(d.blurb + ' ' + (d.article.headline ?? '')), 3],
      [norm([d.article.intro, ...d.article.sections.map(s => s.title + ' ' + s.body)].join(' ')), 1],
    ];
    let score = 0;
    for (const w of words) {
      const best = Math.max(...fields.map(([text, weight]) => (startsWord(text, w) ? weight : 0)));
      if (!best) return { d, score: 0, order };
      score += best;
    }
    return { d, score, order };
  });
  return scored.filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.order - b.order).map(x => x.d);
}

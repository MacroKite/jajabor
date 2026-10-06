import { findDest, type Destination, type Story } from './data';
import { plain, textBlocks } from './format';

export const MIN_WORDS = 80;
export const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${+d} ${MON[+m - 1]} ${y}`;
};
export const wc = (s: string) => (s.trim().match(/\S+/g) || []).length;
export const cut = (t: string, n: number) => (t.length > n ? t.slice(0, t.lastIndexOf(' ', n)) + '…' : t);

export type Decorated = Story & {
  img: string;
  placeName: string;
  placeBn: string;
  href: string;
  when: string;
  readTime: string;
  paras: string[];
  excerpt: string;
};

// `dests` supplies the place name and the fallback photo for stories without one.
export function decorate(r: Story, dests: Destination[]): Decorated {
  const d = findDest(dests, r.place);
  const paras = textBlocks(r.text).flatMap(b => (b.kind === 'p' ? [plain(b.text)] : []));
  return {
    ...r,
    img: r.image || d?.img || '',
    placeName: d?.name || '',
    placeBn: d?.bn || '',
    href: '/stories/' + r.id,
    when: fmtDate(r.date),
    readTime: Math.max(1, Math.round(wc(r.text) / 200)) + ' min read',
    paras,
    excerpt: cut(paras[0] || '', 230),
  };
}

// Draws the travel personality result as a postcard, 1080×1350 (Instagram portrait size), in the
// browser, so what people see is exactly what they download or share. Nothing is uploaded.
// Layout: a photo of the top suggested place behind a cream postcard with a perforated, stamp-like
// edge; a headline with their name and type, the traveller's photo as the stamp with postmarks,
// their travel dream, a short letter about them built from their answers and Jajabor's picks.

import { PICKS_TITLE, headline, letter, type Result } from './personality';

export const CARD_W = 1080;
export const CARD_H = 1350;

const INK = '#262420', MUTED = '#77736b', PAPER = '#f1ede6', LINE = '#c9c3b8', GREEN = '#006A4E';
// "Noto Sans Bengali" holds only the digits ০–৯ (see SiteDocument): Hind Siliguri draws a broken "১".
const SANS = '"Satoshi", "Noto Sans Bengali", "Hind Siliguri", sans-serif';
const MONTHS = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
const bn = (n: number) => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[+d]);

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>(resolve => {
    const im = new Image();
    im.crossOrigin = 'anonymous'; // destination photos come from Cloudinary, which allows this
    im.onload = () => resolve(im);
    im.onerror = () => resolve(null);
    im.src = src;
  });

// Draws `im` to fill the box, cropping the overflow like CSS object-fit: cover.
function cover(ctx: CanvasRenderingContext2D, im: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const s = Math.max(w / im.width, h / im.height);
  const sw = w / s, sh = h / s;
  ctx.drawImage(im, (im.width - sw) / 2, (im.height - sh) / 2, sw, sh, x, y, w, h);
}

// Largest size up to `size` at which `text` fits in `max` pixels.
function fit(ctx: CanvasRenderingContext2D, text: string, font: (s: number) => string, size: number, max: number) {
  for (let s = size; s > 16; s -= 2) {
    ctx.font = font(s);
    if (ctx.measureText(text).width <= max) return s;
  }
  return 16;
}

// Splits text into lines no wider than `max` (the context's current font).
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? line + ' ' + word : word;
    if (line && ctx.measureText(next).width > max) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

// The cream postcard with a perforated edge, drawn on its own canvas so the holes show the photo behind.
function paper(w: number, h: number): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  // A faint grain, like card stock.
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = `rgba(90,80,60,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
  }
  // Half-circle bites along every edge, evenly spaced.
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = '#000'; // fully opaque, so the bites go right through
  const r = 26, gap = 66;
  const holes = (len: number) => { const n = Math.round(len / gap); return Array.from({ length: n }, (_, i) => (i + 0.5) * (len / n)); };
  ctx.beginPath();
  for (const x of holes(w)) { ctx.moveTo(x + r, 0); ctx.arc(x, 0, r, 0, Math.PI * 2); ctx.moveTo(x + r, h); ctx.arc(x, h, r, 0, Math.PI * 2); }
  for (const y of holes(h)) { ctx.moveTo(r, y); ctx.arc(0, y, r, 0, Math.PI * 2); ctx.moveTo(w + r, y); ctx.arc(w, y, r, 0, Math.PI * 2); }
  ctx.fill();
  return cv;
}

// A round postmark with the site name and today's date, slightly rotated.
function postmark(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, angle: number, serif: string) {
  const d = new Date();
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = 'rgba(38,36,32,0.72)';
  ctx.fillStyle = 'rgba(38,36,32,0.72)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, 0, r - 9, 0, Math.PI * 2); ctx.stroke();
  ctx.textAlign = 'center';
  ctx.font = `700 ${Math.round(r * 0.27)}px ${SANS}`;
  ctx.fillText('JAJABOR', 0, -r * 0.22);
  ctx.font = `400 ${Math.round(r * 0.3)}px ${serif}`;
  ctx.fillText(`${bn(d.getDate())} ${MONTHS[d.getMonth()]} ${bn(d.getFullYear())}`, 0, r * 0.2);
  ctx.font = `400 ${Math.round(r * 0.24)}px ${serif}`;
  ctx.fillText('বাংলাদেশ', 0, r * 0.52);
  ctx.restore();
}

// Three wavy cancellation lines running into the stamp.
function waves(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(38,36,32,0.7)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    for (let i = 0; i <= w; i += 4) {
      const py = y + k * 24 + Math.sin(i / 22) * 7;
      if (i) ctx.lineTo(x + i, py); else ctx.moveTo(x + i, py);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export async function drawCard(opts: { result: Result; name: string; photo?: string; placeNames: string[]; heroImage?: string; siteHost: string; serifFamily: string; logoSvg?: string }): Promise<HTMLCanvasElement> {
  const { result, name, photo, placeNames, heroImage, siteHost } = opts;
  const SERIF = `${opts.serifFamily}, "Hind Siliguri", serif`;
  const serif = (s: number) => `400 ${s}px ${SERIF}`;
  const hand = (s: number) => `italic 400 ${s}px ${SERIF}`;
  // Make sure the fonts are ready, or the canvas falls back to a system font.
  await Promise.all([serif(40), hand(40), `700 40px ${SANS}`, `500 40px ${SANS}`, `400 40px ${SANS}`].flatMap(f => [document.fonts.load(f, 'বাংলা'), document.fonts.load(f, 'Aa'), document.fonts.load(f, '০১২৩৪৫৬৭৮৯')])).catch(() => {});
  const logoSrc = opts.logoSvg ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(opts.logoSvg) : null;
  const [hero, face, logo] = await Promise.all([heroImage ? loadImage(heroImage) : null, photo ? loadImage(photo) : null, logoSrc ? loadImage(logoSrc) : null]);

  const cv = document.createElement('canvas');
  cv.width = CARD_W; cv.height = CARD_H;
  const ctx = cv.getContext('2d')!;

  // Background: the top suggested place, softened and darkened so the postcard stands out.
  ctx.fillStyle = '#3d4a44';
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  if (hero) { ctx.filter = 'blur(3px)'; cover(ctx, hero, -20, -20, CARD_W + 40, CARD_H + 40); ctx.filter = 'none'; }
  ctx.fillStyle = 'rgba(16,20,18,0.5)';
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // The postcard.
  const PX = 108, PY = 132, PW = CARD_W - PX * 2, PH = CARD_H - PY * 2;
  // No drop shadow: it would show through the perforations and hide them.
  ctx.drawImage(paper(PW, PH), PX, PY);

  const L = PX + 110; // left margin of the writing
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  // A small "ভ্রমণ পোস্টকার্ড" label at the top.
  ctx.fillStyle = MUTED;
  ctx.font = `500 26px ${SANS}`; // no letter spacing: it would pull Bangla letter clusters apart
  ctx.fillText('ভ্রমণ পোস্টকার্ড', L, PY + 118);

  // The stamp: the traveller's photo, or the place photo when they didn't add one.
  const SX = PX + PW - 110 - 210, SY = PY + 96, SW = 210, SH = 262;
  const stamp = face ?? hero;
  if (stamp) cover(ctx, stamp, SX, SY, SW, SH);
  else { ctx.fillStyle = '#5d7d6e'; ctx.fillRect(SX, SY, SW, SH); }
  waves(ctx, SX - 150, SY + SH - 22, 175);
  postmark(ctx, SX + SW - 18, SY + SH - 2, 62, -0.22, SERIF);

  // Headline beside the stamp: "{name} {type} যাযাবর", up to three lines.
  const head = headline(name, result.type);
  const headW = SX - L - 40;
  let hs = 60, headLines: string[] = [];
  for (; hs > 36; hs -= 2) { ctx.font = serif(hs); headLines = wrap(ctx, head, headW); if (headLines.length <= 3 && headLines.every(t => ctx.measureText(t).width <= headW)) break; }
  ctx.fillStyle = INK;
  ctx.font = serif(hs);
  const headLh = Math.round(hs * 1.3);
  // A little more space under the label than before the headline's own line height.
  headLines.forEach((t, i) => ctx.fillText(t, L, PY + 215 + i * headLh));

  // স্বপ্ন: the urge behind their travelling, on one ruled line (the text shrinks to fit).
  const textW = PW - 220, lineEnd = L + textW;
  const DY = Math.max(PY + 465, PY + 215 + (headLines.length - 1) * headLh + 100);
  ctx.fillStyle = MUTED; ctx.font = `500 24px ${SANS}`;
  ctx.fillText('স্বপ্ন', L, DY);
  ctx.fillStyle = INK;
  ctx.font = hand(fit(ctx, result.type.dream, hand, 32, lineEnd - L - 85));
  ctx.fillText(result.type.dream, L + 85, DY);
  const ruleY = DY + 22;
  ctx.strokeStyle = LINE; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(L, ruleY); ctx.lineTo(lineEnd, ruleY); ctx.stroke();

  // Jajabor's picks, at the bottom of the card: a green title, then one place per line.
  const PICK_LH = 56, LAST = PY + PH - 78;
  const picks = placeNames.slice(0, 3);
  const PICKS_TOP = LAST - (picks.length - 1) * PICK_LH - 64; // the title's baseline
  if (picks.length) {
    ctx.strokeStyle = LINE; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(L, PICKS_TOP - 52); ctx.lineTo(lineEnd, PICKS_TOP - 52); ctx.stroke();
    ctx.fillStyle = GREEN; ctx.font = `700 26px ${SANS}`;
    ctx.fillText(PICKS_TITLE, L, PICKS_TOP);
    picks.forEach((p, i) => {
      const y = PICKS_TOP + 64 + i * PICK_LH;
      ctx.fillStyle = GREEN;
      ctx.beginPath(); ctx.arc(L + 8, y - 12, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK; ctx.font = serif(fit(ctx, p, serif, 38, textW - 36));
      ctx.fillText(p, L + 32, y);
    });
  }

  // The letter, about the person by name, filling the space between, shrinking if it is long.
  const body = letter(result, name);
  const TOP = ruleY + 82, BOTTOM = (picks.length ? PICKS_TOP - 52 : LAST) - 40;
  let size = 33, lines: string[] = [], lh = 0;
  for (; size > 22; size--) {
    lh = Math.round(size * 1.7);
    ctx.font = hand(size); lines = wrap(ctx, body, textW);
    if (TOP + (lines.length - 1) * lh <= BOTTOM) break;
  }
  ctx.fillStyle = INK;
  ctx.font = hand(size);
  lines.forEach((t, i) => ctx.fillText(t, L, TOP + i * lh));

  // Footer, on the photo below the postcard: where to take the test.
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.font = `500 24px ${SANS}`;
  ctx.fillText(`আপনার ভ্রমণ ব্যক্তিত্ব জানুন · ${siteHost}/travel-personality`, CARD_W / 2, CARD_H - 52);
  // The Jajabor logo above the postcard, as in the navbar, on a cream badge so the black wordmark
  // shows against the photo; the name in text if the logo could not be drawn.
  if (logo) {
    const LH = 58, LW = LH * (114 / 61); // the logo's viewBox is 114 × 61
    const BW = LW + 52, BH = LH + 28, BX = (CARD_W - BW) / 2, BY = 24;
    ctx.beginPath(); ctx.roundRect(BX, BY, BW, BH, 18);
    ctx.fillStyle = PAPER; ctx.fill();
    ctx.drawImage(logo, BX + 26, BY + 14, LW, LH);
  } else {
    ctx.font = `700 30px ${SANS}`;
    ctx.fillText('Jajabor', CARD_W / 2, 84);
  }
  return cv;
}

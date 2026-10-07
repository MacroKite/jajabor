// The travel personality test at /travel-personality: questions, travel types, scoring and the
// places suggested for each type. Everything is in Bangla. Nothing here is saved anywhere.

export type TypeKey = 'hills' | 'sea' | 'wild' | 'calm';
export type PrefKey = 'company' | 'budget' | 'pace' | 'season';

export type TravelType = {
  key: TypeKey;
  title: string;
  tagline: string;
  description: string;
  // Destination slugs, best first.
  places: string[];
};

export const TYPES: Record<TypeKey, TravelType> = {
  hills: {
    key: 'hills',
    title: 'পাহাড়ি অভিযাত্রী',
    tagline: 'মেঘ না ছুঁলে আপনার ছুটি অসম্পূর্ণ।',
    description: 'আঁকাবাঁকা পাহাড়ি পথ, ভোরের মেঘ আর চূড়া থেকে দেখা দিগন্ত আপনাকে টানে। একটু কষ্ট করে হলেও সেরা দৃশ্যটা আপনি নিজের চোখে দেখতে চান।',
    places: ['sajek', 'nilgiri'],
  },
  sea: {
    key: 'sea',
    title: 'সমুদ্রপ্রেমী',
    tagline: 'ঢেউয়ের শব্দেই আপনার মন ভালো হয়ে যায়।',
    description: 'খোলা আকাশ, বালুকাবেলা আর সূর্যাস্ত আপনার প্রিয়। সৈকতে খালি পায়ে হাঁটা আর সন্ধ্যায় টাটকা মাছ ভাজা আপনার কাছে আসল ছুটি।',
    places: ['coxs-bazar', 'kuakata', 'saint-martins'],
  },
  wild: {
    key: 'wild',
    title: 'বুনো অনুসন্ধানী',
    tagline: 'অচেনা পথ আর বন্যপ্রাণী আপনাকে ডাকে।',
    description: 'নৌকায় গহীন বনে ঢোকা, পাখি আর হরিণের খোঁজ, নদীর বুকে রাত কাটানো আপনার কাছে রোমাঞ্চ। ভিড়ের চেয়ে প্রকৃতির নিস্তব্ধতা আপনার বেশি পছন্দ।',
    places: ['sundarbans', 'ratargul'],
  },
  calm: {
    key: 'calm',
    title: 'প্রশান্তিপ্রিয় পর্যটক',
    tagline: 'ভিড় নয়, সবুজ আর চায়ের কাপই আপনার ছুটি।',
    description: 'তাড়াহুড়ো ছাড়া নিজের মতো সময় কাটানোই আপনার ভ্রমণের মূল কথা। চা-বাগান, লেক আর পাখির ডাকের মাঝে আপনি আবার নিজেকে খুঁজে পান।',
    places: ['srimangal', 'madhabpur'],
  },
};

const TYPE_ORDER: TypeKey[] = ['hills', 'sea', 'wild', 'calm'];

// A question either scores the four travel types (one option each, in TYPE_ORDER) or records a
// preference. Each preference option has a `line`, the sentence it adds to the postcard letter.
export type Question =
  | { kind: 'type'; text: string; options: string[] }
  | { kind: 'pref'; pref: PrefKey; text: string; options: { text: string; value: string; line: string }[] };

export const PREF_LABELS: Record<PrefKey, string> = {
  company: 'ভ্রমণসঙ্গী',
  budget: 'বাজেট',
  pace: 'ভ্রমণের গতি',
  season: 'প্রিয় সময়',
};

export const QUESTIONS: Question[] = [
  { kind: 'type', text: 'লম্বা একটা ছুটি পেলে প্রথমেই মাথায় কী আসে?', options: ['মেঘে ঢাকা কোনো পাহাড়চূড়া', 'সাগরপাড়ে বসে ঢেউ গোনা', 'নৌকায় করে গহীন বনে ঢোকা', 'চা-বাগানের মাঝে নিরিবিলি কোনো কটেজ'] },
  { kind: 'pref', pref: 'company', text: 'কার সাথে ঘুরতে সবচেয়ে ভালো লাগে?', options: [
    { text: 'একা, নিজের মতো করে', value: 'একা', line: 'একা ঘুরতেই সবচেয়ে ভালো লাগে।' },
    { text: 'বন্ধুদের দল নিয়ে', value: 'বন্ধুদের সাথে', line: 'বন্ধুদের দল নিয়ে ঘুরতে ভালোবাসি।' },
    { text: 'পরিবারের সবাইকে নিয়ে', value: 'পরিবারের সাথে', line: 'পরিবারের সবাইকে নিয়ে ঘুরতেই আনন্দ।' },
    { text: 'প্রিয় মানুষটির সাথে', value: 'প্রিয় মানুষের সাথে', line: 'প্রিয় মানুষের সাথে ঘুরতে ভালোবাসি।' },
  ] },
  { kind: 'type', text: 'ভোর পাঁচটায় অ্যালার্ম বাজল। কেন উঠবেন?', options: ['পাহাড়ের চূড়া থেকে সূর্যোদয় দেখতে', 'ফাঁকা সৈকতে হাঁটতে', 'হরিণ আর পাখি দেখার এটাই সেরা সময়', 'উঠব না, ঘুমটাই তো ছুটি!'] },
  { kind: 'type', text: 'ট্রিপে কোন খাবারটা না খেলেই নয়?', options: ['বাঁশের ভেতর রান্না ব্যাম্বু চিকেন', 'সৈকতের দোকানে টাটকা মাছ ভাজা', 'লঞ্চের রান্নাঘরে নদীর মাছ', 'সাত রঙের চা আর সাতকরা দিয়ে মাংস'] },
  { kind: 'pref', pref: 'budget', text: 'তিন দিনের একটা ট্রিপে জনপ্রতি কত খরচ করতে চান?', options: [
    { text: '৫,০০০ টাকার মধ্যে', value: 'সাশ্রয়ী', line: 'খরচ রাখি সাশ্রয়ী।' },
    { text: '৫,০০০ থেকে ১০,০০০ টাকা', value: 'মাঝারি', line: 'বাজেট রাখি মাঝারি।' },
    { text: '১০,০০০ থেকে ২০,০০০ টাকা', value: 'আরামদায়ক', line: 'আরামের জন্য খরচে আপত্তি নেই।' },
    { text: 'ভালো অভিজ্ঞতা হলে বাজেট কোনো ব্যাপার না', value: 'খোলা হাত', line: 'ভালো অভিজ্ঞতায় বাজেট নিয়ে ভাবি না।' },
  ] },
  { kind: 'type', text: 'আপনার ফোনের গ্যালারিতে কোন ছবি সবচেয়ে বেশি?', options: ['মেঘ আর পাহাড়ের সারি', 'সূর্যাস্ত আর ঢেউ', 'পশুপাখি আর গাছপালা', 'চায়ের কাপ, বই আর বারান্দার ভিউ'] },
  { kind: 'pref', pref: 'pace', text: 'ট্রিপে আপনার দিন সাধারণত কেমন কাটে?', options: [
    { text: 'ভোর থেকে রাত, যত বেশি জায়গা তত ভালো', value: 'ব্যস্ত', line: 'যত বেশি জায়গা দেখা যায়, তত ভালো।' },
    { text: 'কয়েকটা জায়গা, বাকিটা আড্ডা আর বিশ্রাম', value: 'মাঝামাঝি', line: 'কয়েকটা জায়গা, বাকিটা আড্ডা আর বিশ্রাম।' },
    { text: 'এক জায়গায় বসে প্রকৃতি উপভোগ', value: 'ধীরেসুস্থে', line: 'ধীরেসুস্থে প্রকৃতি উপভোগ করাই আমার ছুটি।' },
  ] },
  { kind: 'type', text: 'ট্রিপের কোন মুহূর্তটা আপনার সবচেয়ে প্রিয়?', options: ['কষ্ট করে চূড়ায় ওঠার পর চারপাশের দৃশ্য', 'খোলা আকাশের নিচে বিশাল জলরাশি', 'অচেনা কিছু আবিষ্কারের রোমাঞ্চ', 'তাড়াহুড়ো ছাড়া নিজের মতো সময়'] },
  { kind: 'type', text: 'রাতটা কোথায় কাটাতে চান?', options: ['পাহাড়ের কাঠের কটেজে, বারান্দায় মেঘ', 'সাগরমুখী রুমে, ঢেউয়ের শব্দে', 'নদীতে নোঙর করা লঞ্চে', 'চা-বাগানের পাশের নিরিবিলি রিসোর্টে'] },
  { kind: 'pref', pref: 'season', text: 'কোন সময়ে ঘুরতে বেশি ভালো লাগে?', options: [
    { text: 'শীতে, কুয়াশা আর পরিষ্কার আকাশে', value: 'শীতকাল', line: 'শীতের কুয়াশা আমার সবচেয়ে প্রিয়।' },
    { text: 'বর্ষায়, সবকিছু যখন সবুজ', value: 'বর্ষাকাল', line: 'বর্ষার সবুজ আমাকে সবচেয়ে টানে।' },
    { text: 'সময় পেলেই বেরিয়ে পড়ি', value: 'যেকোনো সময়', line: 'সময় পেলেই বেরিয়ে পড়ি।' },
  ] },
];

// Places to skip for a season: Saint Martin's and the Sundarbans are closed to visitors through
// the monsoon, and Ratargul's forest is dry in winter (see their guides).
const OUT_OF_SEASON: Record<string, string[]> = {
  'বর্ষাকাল': ['saint-martins', 'sundarbans'],
  'শীতকাল': ['ratargul'],
};

export type Result = {
  type: TravelType;
  second: TravelType | null;
  prefs: { key: PrefKey; label: string; value: string; line: string }[];
  places: string[];
};

// `answers[i]` is the chosen option for QUESTIONS[i].
export function scoreTest(answers: number[]): Result {
  const score: Record<TypeKey, number> = { hills: 0, sea: 0, wild: 0, calm: 0 };
  const prefs: Result['prefs'] = [];
  QUESTIONS.forEach((q, i) => {
    const a = answers[i];
    if (a === undefined) return;
    if (q.kind === 'type') score[TYPE_ORDER[a]]++;
    else prefs.push({ key: q.pref, label: PREF_LABELS[q.pref], ...q.options[a] });
  });
  // Highest score wins; on a tie, the type picked in the last scoring question breaks it.
  const lastType = [...QUESTIONS.keys()].reverse().find(i => QUESTIONS[i].kind === 'type' && answers[i] !== undefined);
  const tieBreak = lastType === undefined ? null : TYPE_ORDER[answers[lastType]];
  const ranked = [...TYPE_ORDER].sort((a, b) => score[b] - score[a] || (b === tieBreak ? 1 : 0) - (a === tieBreak ? 1 : 0));
  const type = TYPES[ranked[0]];
  const second = score[ranked[1]] > 0 ? TYPES[ranked[1]] : null;

  // Up to three places: the main type's first, then the second type's, skipping any that are
  // out of season for the chosen time of year.
  const season = prefs.find(p => p.key === 'season')?.value ?? '';
  const skip = OUT_OF_SEASON[season] ?? [];
  const pool = [...type.places, ...(second?.places ?? []), ...ranked.slice(2).flatMap(k => TYPES[k].places)];
  const places = [...new Set(pool)].filter(p => !skip.includes(p)).slice(0, 3);
  return { type, second, prefs, places };
}

// "ক", "ক আর খ", "ক, খ আর গ".
export const bnList = (items: string[]) => (items.length < 2 ? items.join('') : items.slice(0, -1).join(', ') + ' আর ' + items[items.length - 1]);

// The postcard letter: the travel type, one sentence per preference and where they're going next.
export function letter(r: Result, placeNames: string[]): string {
  const next = placeNames.length ? `এবারের ছুটিতে যাচ্ছি ${bnList(placeNames)}।` : '';
  return [`আমি একজন ${r.type.title}।`, ...r.prefs.map(p => p.line), next].filter(Boolean).join(' ');
}

// 1234 → "১২৩৪".
export const bnDigits = (n: number | string) => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[+d]);

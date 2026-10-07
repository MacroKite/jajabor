// The travel personality test at /travel-personality: questions, travel types, scoring and the
// places suggested for each type. Everything is in Bangla. Nothing here is saved anywhere.

export type TypeKey = 'hills' | 'sea' | 'wild' | 'calm';
export type PrefKey = 'company' | 'budget' | 'pace' | 'season';

export type TravelType = {
  key: TypeKey;
  // One word; the headline reads "{name} {title} যাযাবর".
  title: string;
  tagline: string;
  // The result page's paragraph and key points, speaking to the person.
  description: string;
  traits: string[];
  // The "স্বপ্ন" line on the postcard: the urge behind their travelling.
  dream: string;
  // The postcard letter's opening, about the person by name (`{n}`), in a friendly, proud tone.
  opener: string;
  // Destination slugs, best first.
  places: string[];
};

export const NOMAD = 'যাযাবর';

export const TYPES: Record<TypeKey, TravelType> = {
  hills: {
    key: 'hills',
    title: 'পাহাড়প্রেমী',
    tagline: 'মেঘ না ছুঁলে আপনার ছুটি অসম্পূর্ণ।',
    description: 'আপনি সেই মানুষ, যিনি ভোরের অ্যালার্মে বিরক্ত হন না, কারণ জানেন চূড়ায় উঠলেই মেঘের সমুদ্র অপেক্ষা করছে। আঁকাবাঁকা পাহাড়ি পথ, খোলা জিপের ছাদে বাতাস আর চূড়া থেকে দেখা দিগন্ত আপনাকে বারবার টানে। একটু কষ্ট আপনার কাছে কোনো ব্যাপার না, সেরা দৃশ্যটা নিজের চোখে দেখাই আসল। পাহাড়ি মানুষের জীবন, বাঁশের ভেতর রান্না ব্যাম্বু চিকেন আর রাতের তারাভরা আকাশ আপনার ভ্রমণকে পূর্ণ করে।',
    traits: ['ভোরে উঠে সূর্যোদয় দেখতে কখনো আলসেমি করেন না', 'কষ্টের পথ পেরিয়ে সেরা দৃশ্যটা খুঁজে নেন', 'পাহাড়ি সংস্কৃতি আর মানুষের জীবন নিয়ে আপনার কৌতূহল আছে', 'বর্ষা আর শরতে মেঘ দেখার সেরা সময়টা আপনি চেনেন'],
    dream: 'দেশের সব পাহাড়চূড়ায় দাঁড়িয়ে মেঘ ছুঁয়ে দেখা',
    opener: '{n} মেঘ ছুঁতে ভোর পাঁচটায় উঠে পড়ে, চূড়ায় না উঠে থামে না।',
    places: ['sajek', 'nilgiri'],
  },
  sea: {
    key: 'sea',
    title: 'সমুদ্রপ্রেমী',
    tagline: 'ঢেউয়ের শব্দেই আপনার মন ভালো হয়ে যায়।',
    description: 'ঢেউয়ের শব্দই আপনার কাছে সবচেয়ে প্রিয় গান। খালি পায়ে বালুতে হাঁটা, ভোরের ফাঁকা সৈকত আর সন্ধ্যায় দিগন্তে সূর্য ডুবে যাওয়া, এই মুহূর্তগুলোর জন্যই আপনি ঘুরতে বের হন। আপনি খোলা মনের মানুষ, বড় আকাশের নিচে নিজেকে মুক্ত লাগে। সন্ধ্যায় সৈকতের দোকানে নিজে মাছ বেছে নিয়ে টাটকা ভাজা খাওয়া আপনার ছুটির সেরা অংশ।',
    traits: ['সূর্যাস্তের সময়টা আপনি কখনো মিস করেন না', 'খোলা আকাশ আর বিশাল জলরাশিতে আপনার মন হালকা হয়', 'টাটকা সামুদ্রিক খাবার আপনার প্রিয়', 'নভেম্বর থেকে মার্চ, শান্ত সাগরের সময়টা আপনার জন্য সেরা'],
    dream: 'দেশের প্রতিটা সৈকতে একবার করে সূর্যাস্ত দেখা',
    opener: '{n} ঢেউয়ের শব্দ শুনলেই খুশি, সূর্যাস্তটা কখনো মিস করে না।',
    places: ['coxs-bazar', 'kuakata', 'saint-martins'],
  },
  wild: {
    key: 'wild',
    title: 'অরণ্যপ্রেমী',
    tagline: 'অচেনা পথ আর বন্যপ্রাণী আপনাকে ডাকে।',
    description: 'আপনি অচেনা পথের মানুষ। যেখানে বেশিরভাগ লোক থেমে যায়, সেখান থেকেই আপনার ভ্রমণ শুরু। নৌকায় সরু খাল ধরে গহীন বনে ঢোকা, কাদায় বাঘের পায়ের ছাপ খোঁজা আর গাছের ডালে পাখির ডাক শোনা আপনার কাছে আসল রোমাঞ্চ। প্রকৃতিকে আপনি সম্মান করেন, তাই নিঃশব্দে দেখতে জানেন আর পেছনে কিছু ফেলে আসেন না।',
    traits: ['নতুন জায়গা আবিষ্কারে আপনি সাহসী', 'বন্যপ্রাণী আর পাখি দেখার ধৈর্য আপনার আছে', 'প্রকৃতির নিয়ম মেনে চলেন, পরিবেশের যত্ন নেন', 'নদীর বুকে লঞ্চে রাত কাটানো আপনার স্বপ্নের ছুটি'],
    dream: 'বাংলাদেশের প্রতিটা বনের গভীরে একবার হলেও ঢুকে দেখা',
    opener: '{n} অচেনা পথে নামতে ভয় পায় না, বনের গভীরে ঢোকাই ওর রোমাঞ্চ।',
    places: ['sundarbans', 'ratargul'],
  },
  calm: {
    key: 'calm',
    title: 'শান্তিপ্রিয়',
    tagline: 'ভিড় নয়, সবুজ আর চায়ের কাপই আপনার ছুটি।',
    description: 'আপনার কাছে ছুটি মানে দৌড়াদৌড়ি নয়, নিজের মতো করে সময় কাটানো। চা-বাগানের মাঝে নিরিবিলি কটেজ, সকালের কুয়াশা, হাতে এক কাপ চা আর পাখির ডাক, এর বেশি কিছু আপনার লাগে না। আপনি জানেন কীভাবে প্রতিটা মুহূর্ত ধীরে উপভোগ করতে হয়। ভিড় থেকে দূরে সবুজের মাঝে কয়েকটা দিন কাটালেই আপনি নতুন করে চাঙ্গা হয়ে ফেরেন।',
    traits: ['তাড়াহুড়ো ছাড়া ধীরে ভ্রমণ উপভোগ করেন', 'নিরিবিলি আর সবুজ জায়গা আপনার সবচেয়ে প্রিয়', 'স্থানীয় খাবার আর চায়ের স্বাদ খুঁজে বেড়ান', 'ক্লান্ত হয়ে নয়, বিশ্রাম নিয়ে ফেরেন'],
    dream: 'দেশের সবচেয়ে নিরিবিলি কোণগুলো খুঁজে বের করা',
    opener: '{n} জানে ছুটিটা আসলে কীভাবে উপভোগ করতে হয়, তাড়াহুড়ো ওর ধাতে নেই।',
    places: ['srimangal', 'madhabpur'],
  },
};

// "মারুফ সমুদ্রপ্রেমী যাযাবর".
export const headline = (name: string, t: TravelType) => `${name} ${t.title} ${NOMAD}`;

const TYPE_ORDER: TypeKey[] = ['hills', 'sea', 'wild', 'calm'];

// A question either scores the four travel types (one option each, in TYPE_ORDER) or records a
// preference. Each preference option has a `line`: a short sentence about the person for the
// postcard letter, which follows the opener.
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
    { text: 'একা, নিজের মতো করে', value: 'একা', line: 'একাই বেরিয়ে পড়ে, সাহসটা দারুণ।' },
    { text: 'বন্ধুদের দল নিয়ে', value: 'বন্ধুদের সাথে', line: 'বন্ধুদের নিয়ে ঘুরলে আড্ডাটা ও-ই জমায়।' },
    { text: 'পরিবারের সবাইকে নিয়ে', value: 'পরিবারের সাথে', line: 'পরিবারের সবাইকে নিয়ে ঘোরে, সবার খেয়াল রাখে।' },
    { text: 'প্রিয় মানুষটির সাথে', value: 'প্রিয় মানুষের সাথে', line: 'প্রিয় মানুষটার সাথে ঘোরাই ওর সেরা ছুটি।' },
  ] },
  { kind: 'type', text: 'ভোর পাঁচটায় অ্যালার্ম বাজল। কেন উঠবেন?', options: ['পাহাড়ের চূড়া থেকে সূর্যোদয় দেখতে', 'ফাঁকা সৈকতে হাঁটতে', 'হরিণ আর পাখি দেখার এটাই সেরা সময়', 'উঠব না, ঘুমটাই তো ছুটি!'] },
  { kind: 'type', text: 'ট্রিপে কোন খাবারটা না খেলেই নয়?', options: ['বাঁশের ভেতর রান্না ব্যাম্বু চিকেন', 'সৈকতের দোকানে টাটকা মাছ ভাজা', 'লঞ্চের রান্নাঘরে নদীর মাছ', 'সাত রঙের চা আর সাতকরা দিয়ে মাংস'] },
  { kind: 'pref', pref: 'budget', text: 'তিন দিনের একটা ট্রিপে জনপ্রতি কত খরচ করতে চান?', options: [
    { text: '৫,০০০ টাকার মধ্যে', value: 'সাশ্রয়ী', line: 'কম খরচে দারুণ ট্রিপ বানাতে ও ওস্তাদ।' },
    { text: '৫,০০০ থেকে ১০,০০০ টাকা', value: 'মাঝারি', line: 'খরচের হিসাবটা একদম ঠিকঠাক রাখে।' },
    { text: '১০,০০০ থেকে ২০,০০০ টাকা', value: 'আরামদায়ক', line: 'আরামটা বোঝে, ভালো জায়গায় থাকতে জানে।' },
    { text: 'ভালো অভিজ্ঞতা হলে বাজেট কোনো ব্যাপার না', value: 'খোলা হাত', line: 'ভালো অভিজ্ঞতার জন্য খরচে পিছপা হয় না।' },
  ] },
  { kind: 'type', text: 'আপনার ফোনের গ্যালারিতে কোন ছবি সবচেয়ে বেশি?', options: ['মেঘ আর পাহাড়ের সারি', 'সূর্যাস্ত আর ঢেউ', 'পশুপাখি আর গাছপালা', 'চায়ের কাপ, বই আর বারান্দার ভিউ'] },
  { kind: 'pref', pref: 'pace', text: 'ট্রিপে আপনার দিন সাধারণত কেমন কাটে?', options: [
    { text: 'ভোর থেকে রাত, যত বেশি জায়গা তত ভালো', value: 'ব্যস্ত', line: 'এক ট্রিপে যত জায়গা সম্ভব, সব ঘুরে ফেলে।' },
    { text: 'কয়েকটা জায়গা, বাকিটা আড্ডা আর বিশ্রাম', value: 'মাঝামাঝি', line: 'ঘোরা আর বিশ্রামের ব্যালান্সটা দারুণ রাখে।' },
    { text: 'এক জায়গায় বসে প্রকৃতি উপভোগ', value: 'ধীরেসুস্থে', line: 'ধীরেসুস্থে প্রতিটা মুহূর্ত উপভোগ করে।' },
  ] },
  { kind: 'type', text: 'ট্রিপের কোন মুহূর্তটা আপনার সবচেয়ে প্রিয়?', options: ['কষ্ট করে চূড়ায় ওঠার পর চারপাশের দৃশ্য', 'খোলা আকাশের নিচে বিশাল জলরাশি', 'অচেনা কিছু আবিষ্কারের রোমাঞ্চ', 'তাড়াহুড়ো ছাড়া নিজের মতো সময়'] },
  { kind: 'type', text: 'রাতটা কোথায় কাটাতে চান?', options: ['পাহাড়ের কাঠের কটেজে, বারান্দায় মেঘ', 'সাগরমুখী রুমে, ঢেউয়ের শব্দে', 'নদীতে নোঙর করা লঞ্চে', 'চা-বাগানের পাশের নিরিবিলি রিসোর্টে'] },
  { kind: 'pref', pref: 'season', text: 'কোন সময়ে ঘুরতে বেশি ভালো লাগে?', options: [
    { text: 'শীতে, কুয়াশা আর পরিষ্কার আকাশে', value: 'শীতকাল', line: 'শীতের কুয়াশা ওর প্রিয় মৌসুম।' },
    { text: 'বর্ষায়, সবকিছু যখন সবুজ', value: 'বর্ষাকাল', line: 'বর্ষার সবুজ ওকে সবচেয়ে বেশি টানে।' },
    { text: 'সময় পেলেই বেরিয়ে পড়ি', value: 'যেকোনো সময়', line: 'সময় পেলেই ব্যাগ গুছিয়ে বেরিয়ে পড়ে।' },
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

// The title over the suggested places, on the postcard and the result page.
export const PICKS_TITLE = 'আপনার জন্য যাযাবরের বাছাইকৃত প্রিয় গন্তব্য';

// The postcard letter, about the person by name: the type's opener and one short line per
// preference. The suggested places are shown separately, under PICKS_TITLE.
export function letter(r: Result, name: string): string {
  const first = name.trim().split(/\s+/)[0] || name.trim();
  return [r.type.opener.replace('{n}', first), ...r.prefs.map(p => p.line)].join(' ');
}

// 1234 → "১২৩৪".
export const bnDigits = (n: number | string) => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[+d]);

// The original home, FAQ and About content, copied into the CMS by scripts/seed-cms.ts. Not used by the site.
// Photo ids are Cloudinary images under trip/places/.

export const HOME = {
  heroSubtitle: 'Authentic Bangladesh travel guides, written by people who’ve actually been there.',
  introText: 'Forget scattered posts and out-of-date blogs. Every place gets **one clear guide** with the routes, stays, food and seasons you need.',
  // [photo id, label, wide, tall]
  mosaic: [
    ['a-dusk-at-coxs-bazar-sea-beach', "Cox's Bazar", true, false],
    ['sajek-valley-01', 'Sajek', false, false],
    ['ratargul-swamp-forest-sylhet', 'Ratargul', false, false],
    ['blue-waters-of-saint-martin-island-bangladesh', "Saint Martin's", false, true],
    ['boat-trees-and-water-in-sundarbans', 'Sundarbans', false, false],
    ['tea-garden-srimongol-sylhet-bangladesh-2', 'Srimangal', false, false],
    ['nilgiri-bandarban-bangladesh-20', 'Nilgiri', false, false],
    ['coxs-bazar-sea-beach', 'Inani', true, false],
    ['sajek-valley-bangladesh', 'Ruilui Para', false, false],
    ['sundarbans-river', 'Katka', false, true],
    ['srimangal-tea-garden', 'Lawachara', false, false],
    ['saint-martins-island', 'Chera Dwip', false, false],
    ['ratargul-0315', 'Gowainghat', true, false],
    ['nymphaea-nouchali-madhabpur-tea-garden-srimangal', 'Madhabpur Lake', false, false],
    ['runmoy-sajek-valley-04', 'Konglak Hill', false, false],
    ['river-in-sundarban', 'Mongla', false, false],
    ['amazing-evening-view-of-saint-martin-island-bangladesh', 'Teknaf', true, false],
    ['coxs-bazar-sea-beach-in-between-day-and-night', 'Himchari', false, false],
  ] as [string, string, boolean, boolean][],
  introPhotos: [
    'blue-waters-of-saint-martin-island-bangladesh',
    'ratargul-0315',
    'sajek-valley-01',
    'tea-garden-srimongol-sylhet-bangladesh-2',
    'a-dusk-at-coxs-bazar-sea-beach',
  ],
};

export const FAQ = [
  { question: 'Who runs Jajabor?', answer: 'Jajabor is made by a team of travellers who love exploring Bangladesh, together with the travellers who share their own trips here.' },
  { question: 'Where do the costs come from?', answer: 'Recent traveller reports and local operators, checked weekly and shown in Taka.' },
  { question: 'Can I write for Jajabor?', answer: 'Yes. Anyone can share a travel story. Tell it honestly and include what you spent; it helps the next person most.' },
  { question: 'When is the best time to travel?', answer: 'October to March for most places. Monsoon (June–September) is best for haors, waterfalls and tea gardens.' },
  { question: 'Do I need permits?', answer: 'Some places do — like the Sundarbans and parts of Bandarban. Each guide lists what you need.' },
];

export const ABOUT = {
  subtitle: 'A free, honest guide to travelling in Bangladesh.',
  heroFile: 'public/images/about-hero.jpg',
  heroAlt: 'A traveller standing on rocks above the hills at dusk',
  whoWeAre:
    'Jajabor is a travel guide to Bangladesh, made by people who love exploring it. We started because planning a trip here usually means digging through old Facebook posts, outdated blogs and scattered advice. We wanted one clear, honest place where anyone could find out how to get somewhere, what to eat, where to stay and when to go.\n\n' +
    'Every guide is free to read, and every story is written by a real traveller. Our goal is to help more people see their own country, and to do it in a way that respects the places and the communities who live there.',
  contactIntro: 'Have a question, an idea or a place we should cover? We’d love to hear from you, and every message helps us make Jajabor better.',
  contact: { phone: '01621089309, 01625680371' },
};

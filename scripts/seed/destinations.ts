// The original destinations, copied into the CMS by scripts/seed-cms.ts with their guides from articles.ts. Not used by the site.

import type { Destination } from '../../lib/data';
import { photo } from '../../lib/images';

export const DESTS: Omit<Destination, 'article'>[] = [
  {
    "id": "coxs-bazar",
    "type": "popular",
    "name": "Cox's Bazar",
    "bn": "কক্সবাজার",
    "district": "Cox's Bazar",
    "blurb": "বিশ্বের দীর্ঘতম প্রাকৃতিক সমুদ্রসৈকত, বঙ্গোপসাগরের তীরে প্রায় ১২০ কিলোমিটার বালুকাময় সৈকত।",
    "img": photo('coxs-bazar-sea-beach', 1400),
    "gallery": [
      photo('a-dusk-at-coxs-bazar-sea-beach', 900),
      photo('coxs-bazar-sea-beach-in-between-day-and-night', 900)
    ]
  },
  {
    "id": "sajek",
    "type": "popular",
    "name": "Sajek Valley",
    "bn": "সাজেক ভ্যালি",
    "district": "Rangamati",
    "blurb": "রাঙামাটির পাহাড়চূড়ার গ্রাম, যেখানে ভোরে মেঘ ভেসে বেড়ায় পায়ের নিচে।",
    "img": photo('sajek-valley-bangladesh', 1400),
    "gallery": [
      photo('sajek-valley-01', 900),
      photo('runmoy-sajek-valley-04', 900)
    ]
  },
  {
    "id": "sundarbans",
    "type": "popular",
    "name": "Sundarbans",
    "bn": "সুন্দরবন",
    "district": "Khulna",
    "blurb": "পৃথিবীর বৃহত্তম ম্যানগ্রোভ বন, রয়েল বেঙ্গল টাইগারের আবাসভূমি।",
    "img": photo('sundarbans-river', 1400),
    "gallery": [
      photo('boat-trees-and-water-in-sundarbans', 900),
      photo('river-in-sundarban', 900)
    ]
  },
  {
    "id": "srimangal",
    "type": "popular",
    "name": "Srimangal",
    "bn": "শ্রীমঙ্গল",
    "district": "Moulvibazar",
    "blurb": "দেশের চায়ের রাজধানী, ঢেউখেলানো চা-বাগান আর লাউয়াছড়ার বর্ষাবন।",
    "img": photo('srimangal-tea-garden', 1400),
    "gallery": [
      photo('tea-garden-srimongol-sylhet-bangladesh-2', 900),
      photo('nymphaea-nouchali-madhabpur-tea-garden-srimangal', 900)
    ]
  },
  {
    "id": "saint-martins",
    "type": "popular",
    "name": "Saint Martin's",
    "bn": "সেন্টমার্টিন",
    "district": "Cox's Bazar",
    "blurb": "দেশের একমাত্র প্রবাল দ্বীপ, স্বচ্ছ নীল পানি আর নিরিবিলি রাত।",
    "img": photo('saint-martins-island', 1400),
    "gallery": [
      photo('blue-waters-of-saint-martin-island-bangladesh', 900),
      photo('amazing-evening-view-of-saint-martin-island-bangladesh', 900)
    ]
  },
  {
    "id": "ratargul",
    "type": "gem",
    "name": "Ratargul",
    "bn": "রাতারগুল",
    "district": "Sylhet",
    "blurb": "মিঠাপানির জলাবন, বর্ষায় ছোট নৌকায় করে গাছের ফাঁকে ফাঁকে ঘুরে দেখতে হয়।",
    "img": photo('ratargul-0315', 1400),
    "gallery": [
      photo('ratargul-swamp-forest-sylhet', 900),
      photo('ratargul-swamp-forest-sylhet-bangladesh', 900)
    ]
  },
  {
    "id": "chera-dwip",
    "type": "gem",
    "name": "Chera Dwip",
    "bn": "ছেঁড়া দ্বীপ",
    "district": "Saint Martin's",
    "blurb": "দেশের সর্বদক্ষিণ বিন্দু, প্রবাল পাথর আর খোলা সমুদ্রে ঘেরা। বর্তমানে পর্যটকদের প্রবেশ নিষিদ্ধ।",
    "img": photo('st-martin-island-chera-dwip', 1400),
    "gallery": [
      photo('blue-waters-of-saint-martin-island-bangladesh', 900),
      photo('saint-martins-island', 900)
    ]
  },
  {
    "id": "nilgiri",
    "type": "gem",
    "name": "Nilgiri",
    "bn": "নীলগিরি",
    "district": "Bandarban",
    "blurb": "বান্দরবানের অন্যতম উঁচু পাহাড়চূড়া, যেখানে মেঘ এসে ছুঁয়ে যায়।",
    "img": photo('nilgiri-bandarban-bangladesh-20', 1400),
    "gallery": []
  },
  {
    "id": "madhabpur",
    "type": "gem",
    "name": "Madhabpur Lake",
    "bn": "মাধবপুর লেক",
    "district": "Moulvibazar",
    "blurb": "চা-বাগানের টিলার মাঝে লুকানো নিরিবিলি লেক, বর্ষায় বেগুনি আর নীল শাপলায় ভরে থাকে।",
    "img": photo('nymphaea-nouchali-madhabpur-tea-garden-srimangal', 1400),
    "gallery": [
      photo('tea-garden-srimongol-sylhet-bangladesh-2', 900),
      photo('srimangal-tea-garden', 900)
    ]
  }
];

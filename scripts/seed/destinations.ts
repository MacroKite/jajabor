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
    "blurb": "The longest natural sea beach in the world, with 120 km of sand along the Bay of Bengal.",
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
    "blurb": "A hilltop village in Rangamati where the clouds drift below you at dawn.",
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
    "blurb": "The largest mangrove forest on earth, and home of the Royal Bengal tiger.",
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
    "blurb": "The tea capital of Bangladesh, with rolling gardens and the Lawachara rainforest.",
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
    "blurb": "Bangladesh's only coral island, with clear blue water and quiet nights.",
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
    "blurb": "A freshwater swamp forest you explore by small boat during the monsoon.",
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
    "blurb": "The country's southernmost tip. Coral rocks and open sea, reachable at low tide.",
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
    "blurb": "One of the highest points in Bandarban, where clouds touch the hilltop.",
    "img": photo('nilgiri-bandarban-bangladesh-20', 1400),
    "gallery": []
  },
  {
    "id": "madhabpur",
    "type": "gem",
    "name": "Madhabpur Lake",
    "bn": "মাধবপুর লেক",
    "district": "Moulvibazar",
    "blurb": "A quiet lake hidden among tea hills, covered in blue water lilies in summer.",
    "img": photo('nymphaea-nouchali-madhabpur-tea-garden-srimangal', 1400),
    "gallery": [
      photo('tea-garden-srimongol-sylhet-bangladesh-2', 900),
      photo('srimangal-tea-garden', 900)
    ]
  }
];

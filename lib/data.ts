// Shapes used by the site. Destination content comes from the CMS (lib/content.ts); stories from MongoDB (lib/db.ts).

export type Destination = {
  id: string;
  type: 'popular' | 'gem';
  name: string;
  bn: string;
  district: string;
  blurb: string;
  img: string;
  gallery: string[];
  // Photographer and licence for img, then each gallery photo, with a link to where it came from.
  credits?: (PhotoCredit | null)[];
  article: { about: string; food: string; stay: string; route: string };
};

export type PhotoCredit = { text: string; source?: string };

export type Story = {
  id: string;
  place: string;
  title: string;
  text: string;
  name: string;
  from: string;
  date: string; // YYYY-MM-DD
  image?: string; // URL of the traveller's photo, if they uploaded one
  authorId?: string; // account that wrote it; starter stories have none
  authorImage?: string; // the author's profile photo
};

export const findDest = (dests: Destination[], id: string | null | undefined) => dests.find(d => d.id === id);

// Longest bio on a traveller profile.
export const BIO_MAX = 300;

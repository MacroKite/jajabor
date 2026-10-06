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
  article: { about: string; food: string; stay: string; route: string };
};

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
};

export const findDest = (dests: Destination[], id: string | null | undefined) => dests.find(d => d.id === id);

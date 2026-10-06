import type { CollectionConfig } from 'payload';
import { anyone, isAdmin, loggedIn } from '../access';
import { revalidateAfterChange, revalidateAfterDelete } from '../revalidate';

const PARAS = 'Leave an empty line between paragraphs.';

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  // Drag to reorder in the list; the site shows destinations in this order.
  orderable: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'district', 'slug'],
    description: 'Places with a guide. Drag rows to change the order they appear on the site.',
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: isAdmin },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'bn', label: 'Name in Bangla', type: 'text', required: true },
      ],
    },
    {
      name: 'slug',
      label: 'Web address',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'The end of the page address: "sajek" gives /destinations/sajek. Lowercase letters, numbers and dashes. Changing it breaks old links.' },
      validate: (v: unknown) => (typeof v === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) || 'Use lowercase letters, numbers and dashes only, e.g. "saint-martins".',
    },
    {
      type: 'row',
      fields: [
        { name: 'type', type: 'select', required: true, defaultValue: 'popular', options: [{ label: 'Popular', value: 'popular' }, { label: 'Hidden gem', value: 'gem' }] },
        { name: 'district', type: 'text', required: true, admin: { description: 'Also used by search.' } },
      ],
    },
    { name: 'blurb', label: 'Short description', type: 'textarea', required: true, maxLength: 200, admin: { description: 'One sentence, shown on cards and the home page.' } },
    { name: 'image', label: 'Main photo', type: 'upload', relationTo: 'media', required: true },
    { name: 'gallery', label: 'Gallery photos', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 2, admin: { description: 'Two photos shown side by side in the middle of the guide.' } },
    {
      name: 'article',
      label: 'Guide',
      type: 'group',
      fields: [
        { name: 'about', label: 'About the place', type: 'textarea', required: true, admin: { description: PARAS, rows: 10 } },
        { name: 'food', label: 'What to eat', type: 'textarea', required: true, admin: { description: PARAS, rows: 8 } },
        { name: 'stay', label: 'Where to stay', type: 'textarea', required: true, admin: { description: PARAS, rows: 8 } },
        { name: 'route', label: 'How to get there', type: 'textarea', required: true, admin: { description: PARAS, rows: 8 } },
      ],
    },
  ],
};

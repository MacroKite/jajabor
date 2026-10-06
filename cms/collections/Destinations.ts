import type { CollectionConfig } from 'payload';
import { anyone, isAdmin, loggedIn } from '../access';
import { revalidateAfterChange, revalidateAfterDelete } from '../revalidate';

const PARAS = 'Leave an empty line between paragraphs.';
const BODY = `${PARAS} Start a line with "- " for a bullet point, or "  - " (two spaces first) for a point inside the one above. Wrap words in **double stars** to make them bold.`;

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
        { name: 'headline', label: 'Subheading', type: 'text', admin: { description: 'Shown above the introduction, e.g. "মেঘের ওপরে এক রাত".' } },
        { name: 'intro', label: 'Introduction', type: 'textarea', required: true, admin: { description: PARAS, rows: 5 } },
        { name: 'notice', label: 'Important notice', type: 'textarea', admin: { description: 'Optional. Shown in a highlighted box under the introduction, for rules or closures travellers must know.', rows: 4 } },
        {
          name: 'sections',
          type: 'array',
          required: true,
          minRows: 1,
          labels: { singular: 'Section', plural: 'Sections' },
          admin: {
            description: 'Shown in this order, e.g. "কেন যাবেন", "কীভাবে যাবেন". The two gallery photos appear after the second section.',
            initCollapsed: true,
            components: { RowLabel: '/cms/components/RowLabels#SectionRowLabel' },
          },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'body', label: 'Text', type: 'textarea', required: true, admin: { description: BODY, rows: 12 } },
          ],
        },
      ],
    },
  ],
};

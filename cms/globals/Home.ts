import type { GlobalConfig } from 'payload';
import { anyone, loggedIn } from '../access';
import { revalidateAfterChange } from '../revalidate';

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home page',
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateAfterChange] },
  fields: [
    { name: 'heroSubtitle', label: 'Text under the headline', type: 'textarea', required: true },
    {
      name: 'introText',
      label: 'Text under “Stop digging through old Facebook posts”',
      type: 'textarea',
      required: true,
      admin: { description: 'Wrap words in **double stars** to make them bold.' },
    },
    {
      name: 'mosaic',
      label: 'Photo grid',
      type: 'array',
      labels: { singular: 'Photo', plural: 'Photos' },
      admin: {
        description: 'On desktop the grid is 6 columns by 4 rows. A normal photo fills 1 cell, “wide” fills 2 across and “tall” fills 2 down. To fill the grid exactly, the cells should add up to 24 (the current layout: 18 photos, 4 wide and 2 tall). Phones show the first 9 photos.',
        initCollapsed: true,
        components: { RowLabel: '/cms/components/RowLabels#MosaicRowLabel' },
      },
      fields: [
        { type: 'row', fields: [
          { name: 'image', type: 'upload', relationTo: 'media', required: true },
          { name: 'label', type: 'text', required: true, admin: { description: 'Place name. Not shown on the photo; screen readers read it out.' } },
        ] },
        { type: 'row', fields: [
          { name: 'wide', type: 'checkbox', defaultValue: false },
          { name: 'tall', type: 'checkbox', defaultValue: false },
        ] },
      ],
    },
    {
      name: 'introPhotos',
      label: '“Most loved destinations” floating photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 5,
      admin: { description: 'Up to 5 small photos that float around the heading before the popular places scroll in.' },
    },
  ],
};

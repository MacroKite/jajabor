import type { GlobalConfig } from 'payload';
import { anyone, loggedIn } from '../access';
import { revalidateAfterChange } from '../revalidate';

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About page & contact',
  admin: { description: 'The About page. The contact details and social links are also shown in the footer on every page.' },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateAfterChange] },
  fields: [
    { name: 'subtitle', label: 'Text beside the heading', type: 'text', required: true },
    { name: 'heroImage', label: 'Main photo', type: 'upload', relationTo: 'media', required: true },
    { name: 'whoWeAre', label: '“Who we are”', type: 'textarea', required: true, admin: { description: 'Leave an empty line between paragraphs.', rows: 10 } },
    { name: 'contactIntro', label: 'Text under “Get in touch”', type: 'textarea', required: true },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { type: 'row', fields: [
          { name: 'email', type: 'email', required: true },
          { name: 'phone', type: 'text', required: true },
        ] },
        { name: 'address', type: 'text', required: true },
      ],
    },
    {
      name: 'social',
      label: 'Social links',
      type: 'group',
      admin: { description: 'Full links, e.g. https://facebook.com/tripbd. Leave empty to hide the icon.' },
      fields: [
        { type: 'row', fields: [
          { name: 'facebook', type: 'text' },
          { name: 'instagram', type: 'text' },
          { name: 'youtube', label: 'YouTube', type: 'text' },
        ] },
      ],
    },
  ],
};

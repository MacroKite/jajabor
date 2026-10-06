import type { GlobalConfig } from 'payload';
import { anyone, loggedIn } from '../access';
import { revalidateAfterChange } from '../revalidate';

export const Faq: GlobalConfig = {
  slug: 'faq',
  label: 'FAQ',
  admin: { description: 'The “Frequently asked questions” section at the bottom of the home page. Drag to reorder.' },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateAfterChange] },
  fields: [
    {
      name: 'items',
      label: 'Questions',
      type: 'array',
      labels: { singular: 'Question', plural: 'Questions' },
      admin: { components: { RowLabel: '/cms/components/RowLabels#FaqRowLabel' } },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
};

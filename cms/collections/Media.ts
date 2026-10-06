import type { CollectionConfig } from 'payload';
import { anyone, isAdmin, loggedIn } from '../access';
import { revalidateAfterChange, revalidateAfterDelete } from '../revalidate';

// Photos for destinations and pages. Files are stored on Cloudinary (see cloudinary-adapter.ts).
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo', plural: 'Photos' },
  admin: { useAsTitle: 'alt', defaultColumns: ['filename', 'alt', 'credit'] },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: isAdmin },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  upload: { mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  fields: [
    { name: 'alt', label: 'Description', type: 'text', required: true, admin: { description: 'What the photo shows, for people using screen readers. E.g. "Clouds over the hills at Sajek Valley".' } },
    { name: 'credit', type: 'text', admin: { description: 'Photographer and licence, e.g. "Jane Doe, CC BY-SA 4.0". Needed for Wikimedia Commons photos.' } },
    { name: 'source', type: 'text', admin: { description: 'Where the photo came from (link), if it isn’t yours.' } },
  ],
};

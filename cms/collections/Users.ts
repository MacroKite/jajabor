import type { CollectionConfig } from 'payload';
import { adminOrSelf, isAdmin, isAdminField } from '../access';

// People who can log in to the CMS at /admin. Separate from the site's reader accounts.
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'CMS user', plural: 'CMS users' },
  auth: true,
  admin: { useAsTitle: 'email', defaultColumns: ['name', 'email', 'role'], group: 'Settings' },
  access: { read: adminOrSelf, create: isAdmin, update: adminOrSelf, delete: isAdmin },
  hooks: {
    // The very first account (made on the /admin welcome screen) becomes an admin.
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          // find, not count: this runs inside a transaction, where MongoDB doesn't allow counts.
          const { docs } = await req.payload.find({ collection: 'users', limit: 1, depth: 0, pagination: false, req });
          if (docs.length === 0) data.role = 'admin';
        }
        return data;
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin: content and CMS users', value: 'admin' },
        { label: 'Editor: content only', value: 'editor' },
      ],
      access: { create: isAdminField, update: isAdminField },
      admin: { description: 'The very first account is always an admin. After that, only admins can change roles.' },
    },
  ],
};

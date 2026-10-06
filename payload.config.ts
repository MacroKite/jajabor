import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { cloudinaryAdapter } from './cms/cloudinary-adapter';
import { Users } from './cms/collections/Users';
import { Media } from './cms/collections/Media';
import { Destinations } from './cms/collections/Destinations';
import { Home } from './cms/globals/Home';
import { Faq } from './cms/globals/Faq';
import { About } from './cms/globals/About';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Payload CMS, served at /admin. Content is stored in the same MongoDB database as the site,
// in Payload's own collections (users, media, destinations, globals, payload-*).
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  db: mongooseAdapter({ url: process.env.MONGODB_URI || '' }),
  admin: {
    user: Users.slug,
    // Use the site's mountain icon in the browser tab instead of Payload's.
    meta: { titleSuffix: ' · JAJABOR CMS', icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/icon.svg' }] },
    importMap: { baseDir: dirname },
  },
  collections: [Destinations, Media, Users],
  globals: [Home, Faq, About],
  plugins: [
    cloudStoragePlugin({
      collections: { media: { adapter: cloudinaryAdapter, disableLocalStorage: true, disablePayloadAccessControl: true } },
    }),
  ],
  graphQL: { disable: true },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
});

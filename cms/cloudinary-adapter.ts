import type { Adapter } from '@payloadcms/plugin-cloud-storage/types';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

// Payload storage adapter: files uploaded in the CMS go to Cloudinary under trip/media/.
// Each media document keeps its Cloudinary id, so the site can ask for resized WebP/AVIF versions.

const FOLDER = 'trip/media';
const { CLOUDINARY_CLOUD_NAME: cloud_name, CLOUDINARY_API_KEY: api_key, CLOUDINARY_API_SECRET: api_secret } = process.env;
if (cloud_name && api_key && api_secret) cloudinary.config({ cloud_name, api_key, api_secret, secure: true });

// Payload already makes filenames unique; strip the extension and anything Cloudinary won't keep.
const publicId = (filename: string) =>
  `${FOLDER}/${filename.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '')}`;

export const cloudinaryAdapter: Adapter = () => ({
  name: 'cloudinary',
  fields: [{ name: 'cloudinaryId', type: 'text', admin: { hidden: true } }],

  async handleUpload({ data, file }) {
    const r = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ public_id: publicId(file.filename), overwrite: true, resource_type: 'image' }, (e, out) => (e || !out ? reject(e) : resolve(out)))
        .end(file.buffer);
    });
    data.cloudinaryId = r.public_id;
    return data;
  },

  async handleDelete({ doc, filename }) {
    const id = (doc as { cloudinaryId?: string }).cloudinaryId || publicId(filename);
    await cloudinary.uploader.destroy(id, { invalidate: true });
  },

  generateURL: ({ filename }) => cloudinary.url(publicId(filename), { secure: true, fetch_format: 'auto', quality: 'auto' }),

  // Files are served by Cloudinary; Payload's own file URL just redirects there.
  staticHandler: (_req, { params }) => Response.redirect(cloudinary.url(publicId(params.filename), { secure: true }), 302),
});

import { v2 as cloudinary } from 'cloudinary';

const { CLOUDINARY_CLOUD_NAME: cloud_name, CLOUDINARY_API_KEY: api_key, CLOUDINARY_API_SECRET: api_secret } = process.env;

export const hasImageStorage = !!(cloud_name && api_key && api_secret);
if (hasImageStorage) cloudinary.config({ cloud_name, api_key, api_secret, secure: true });

const FOLDER = 'trip/stories';

// Uploads a validated photo and returns a delivery URL that serves WebP/AVIF
// at an automatic quality to browsers that support them.
export async function uploadStoryImage(storyId: string, image: { mime: string; base64: string }): Promise<{ publicId: string; url: string }> {
  const r = await cloudinary.uploader.upload(`data:${image.mime};base64,${image.base64}`, {
    folder: FOLDER,
    public_id: storyId,
    resource_type: 'image',
    overwrite: false,
  });
  return {
    publicId: r.public_id,
    url: cloudinary.url(r.public_id, { secure: true, version: r.version, fetch_format: 'auto', quality: 'auto' }),
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { invalidate: true });
}

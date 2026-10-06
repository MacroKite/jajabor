// Images on Cloudinary. The cloud name appears in every image URL, so it is public and safe to keep in code.
export const CLOUD = 'hm7vy6n0';

// f_auto/q_auto serve WebP or AVIF at a sensible quality; c_limit never upscales.
export const cld = (publicId: string, w = 1400) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_limit,w_${w}/${publicId}`;

// The original destination photos under trip/places/ (used by the CMS seed script).
export const photo = (id: string, w = 1400) => cld(`trip/places/${id}`, w);

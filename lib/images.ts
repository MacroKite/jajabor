// Destination photos, copied from Wikimedia Commons (CC BY-SA) to Cloudinary under
// trip/places/. Each image's original Commons page is in its `source` context field.
// The cloud name appears in every image URL, so it is public and safe to keep in code.
const CLOUD = 'hm7vy6n0';

// f_auto/q_auto serve WebP or AVIF at a sensible quality; c_limit never upscales.
export const photo = (id: string, w = 1400) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_limit,w_${w}/trip/places/${id}`;

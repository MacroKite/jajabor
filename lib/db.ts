import type { Story } from './data';
import { MONGODB_URI, connect } from './mongodb';
import { deleteImage, uploadStoryImage } from './cloudinary';
import { Story as StoryModel, type StoryDoc } from '@/models/Story';
import { Message } from '@/models/Message';

export const hasDatabase = !!MONGODB_URI;

type Row = Pick<StoryDoc, '_id' | 'place' | 'title' | 'body' | 'name' | 'hometown' | 'date' | 'imageUrl'>;
const FIELDS = '_id place title body name hometown date imageUrl';
const toStory = (r: Row): Story => ({
  id: r._id, place: r.place, title: r.title, text: r.body,
  name: r.name, from: r.hometown, date: r.date,
  image: r.imageUrl ?? undefined,
});

export async function listStories(limit = 1000): Promise<Story[]> {
  if (!hasDatabase) return [];
  await connect();
  const rows = await StoryModel.find({ status: 'published' }, FIELDS)
    .sort({ date: -1, createdAt: -1 }).limit(limit).lean<Row[]>();
  return rows.map(toStory);
}

export async function getStory(id: string): Promise<Story | null> {
  if (!hasDatabase) return null;
  await connect();
  const row = await StoryModel.findOne({ _id: id, status: 'published' }, FIELDS).lean<Row>();
  return row ? toStory(row) : null;
}

export async function insertStory(s: Story, image: { mime: string; base64: string }, userId: string): Promise<void> {
  if (!hasDatabase) throw new Error('MONGODB_URI is not set');
  await connect();
  // Upload the photo first, so a story never goes live without it.
  const img = await uploadStoryImage(s.id, image);
  try {
    await StoryModel.create({
      _id: s.id, place: s.place, title: s.title, body: s.text, name: s.name, hometown: s.from, date: s.date,
      imageUrl: img.url, imagePublicId: img.publicId, userId,
    });
  } catch (e) {
    await deleteImage(img.publicId).catch(() => {});
    throw e;
  }
}

export async function insertMessage(m: { name: string; email: string; message: string }): Promise<void> {
  if (!hasDatabase) throw new Error('MONGODB_URI is not set');
  await connect();
  await Message.create(m);
}

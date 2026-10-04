import { SEED, type Story } from './data';
import { MONGODB_URI, connect } from './mongodb';
import { deleteImage, uploadStoryImage } from './cloudinary';
import { Story as StoryModel, type StoryDoc } from '@/models/Story';
import { Message } from '@/models/Message';

export const hasDatabase = !!MONGODB_URI;

// Connects, then adds the starter stories if the collection is empty,
// so a fresh database works without a separate seed step.
let ready: Promise<void> | null = null;
function init() {
  ready ??= (async () => {
    await connect();
    if (await StoryModel.estimatedDocumentCount()) return;
    try {
      await StoryModel.insertMany(
        SEED.map(s => ({ _id: s.id, place: s.place, title: s.title, body: s.text, name: s.name, hometown: s.from, date: s.date })),
        { ordered: false },
      );
    } catch (e) {
      // Another instance seeded at the same moment; the duplicates are harmless.
      if ((e as { code?: number }).code !== 11000) throw e;
    }
  })().catch(e => { ready = null; throw e; });
  return ready;
}

type Row = Pick<StoryDoc, '_id' | 'place' | 'title' | 'body' | 'name' | 'hometown' | 'date' | 'imageUrl'>;
const FIELDS = '_id place title body name hometown date imageUrl';
const toStory = (r: Row): Story => ({
  id: r._id, place: r.place, title: r.title, text: r.body,
  name: r.name, from: r.hometown, date: r.date,
  image: r.imageUrl ?? undefined,
});

const byDate = (a: Story, b: Story) => b.date.localeCompare(a.date);

export async function listStories(limit = 1000): Promise<Story[]> {
  if (!hasDatabase) return [...SEED].sort(byDate).slice(0, limit);
  await init();
  const rows = await StoryModel.find({ status: 'published' }, FIELDS)
    .sort({ date: -1, createdAt: -1 }).limit(limit).lean<Row[]>();
  return rows.map(toStory);
}

export async function getStory(id: string): Promise<Story | null> {
  if (!hasDatabase) return SEED.find(s => s.id === id) ?? null;
  await init();
  const row = await StoryModel.findOne({ _id: id, status: 'published' }, FIELDS).lean<Row>();
  return row ? toStory(row) : null;
}

export async function insertStory(s: Story, image: { mime: string; base64: string }): Promise<void> {
  if (!hasDatabase) throw new Error('MONGODB_URI is not set');
  await init();
  // Upload the photo first, so a story never goes live without it.
  const img = await uploadStoryImage(s.id, image);
  try {
    await StoryModel.create({
      _id: s.id, place: s.place, title: s.title, body: s.text, name: s.name, hometown: s.from, date: s.date,
      imageUrl: img.url, imagePublicId: img.publicId,
    });
  } catch (e) {
    await deleteImage(img.publicId).catch(() => {});
    throw e;
  }
}

export async function insertMessage(m: { name: string; email: string; message: string }): Promise<void> {
  if (!hasDatabase) throw new Error('MONGODB_URI is not set');
  await init();
  await Message.create(m);
}

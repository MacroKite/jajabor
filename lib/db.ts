import mongoose from 'mongoose';
import type { Story } from './data';
import { MONGODB_URI, connect } from './mongodb';
import { deleteImage, uploadStoryImage } from './cloudinary';
import type { StoryFields, StoryImageInput } from './story-input';
import { Story as StoryModel, type StoryDoc } from '@/models/Story';
import { Message } from '@/models/Message';

export const hasDatabase = !!MONGODB_URI;

type Row = Pick<StoryDoc, '_id' | 'place' | 'title' | 'body' | 'name' | 'hometown' | 'date' | 'imageUrl' | 'userId'>;
const FIELDS = '_id place title body name hometown date imageUrl userId';
const toStory = (r: Row): Story => ({
  id: r._id, place: r.place, title: r.title, text: r.body,
  name: r.name, from: r.hometown, date: r.date,
  image: r.imageUrl ?? undefined,
  authorId: r.userId ?? undefined,
});

// Accounts live in Better Auth's `user` collection, keyed by ObjectId.
const users = () => mongoose.connection.db!.collection('user');
const oid = (id: string) => (mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null);

// Stories show their author's current name and photo, so renaming an account updates every story.
async function withAuthors(stories: Story[]): Promise<Story[]> {
  const ids = [...new Set(stories.map(s => s.authorId).filter((x): x is string => !!x))].map(oid).filter(x => x !== null);
  if (!ids.length) return stories;
  const found = await users().find({ _id: { $in: ids } }, { projection: { name: 1, image: 1 } }).toArray();
  const byId = new Map(found.map(u => [String(u._id), u]));
  return stories.map(s => {
    const u = s.authorId ? byId.get(s.authorId) : undefined;
    return u ? { ...s, name: u.name || s.name, authorImage: u.image || undefined } : s;
  });
}

export async function listStories(limit = 1000): Promise<Story[]> {
  if (!hasDatabase) return [];
  await connect();
  const rows = await StoryModel.find({ status: 'published' }, FIELDS)
    .sort({ date: -1, createdAt: -1 }).limit(limit).lean<Row[]>();
  return withAuthors(rows.map(toStory));
}

export async function getStory(id: string): Promise<Story | null> {
  if (!hasDatabase) return null;
  await connect();
  const row = await StoryModel.findOne({ _id: id, status: 'published' }, FIELDS).lean<Row>();
  return row ? (await withAuthors([toStory(row)]))[0] : null;
}

export async function listStoriesByUser(userId: string): Promise<Story[]> {
  if (!hasDatabase) return [];
  await connect();
  const rows = await StoryModel.find({ userId, status: 'published' }, FIELDS).sort({ date: -1, createdAt: -1 }).lean<Row[]>();
  return withAuthors(rows.map(toStory));
}

export type Profile = { id: string; name: string; image?: string; hometown?: string; bio?: string; joined: string };

// The public part of an account: never the email.
export async function getProfile(id: string): Promise<Profile | null> {
  const _id = oid(id);
  if (!hasDatabase || !_id) return null;
  await connect();
  const u = await users().findOne({ _id }, { projection: { name: 1, image: 1, hometown: 1, bio: 1, createdAt: 1 } });
  if (!u) return null;
  return {
    id, name: u.name, image: u.image || undefined, hometown: u.hometown || undefined, bio: u.bio || undefined,
    joined: new Date(u.createdAt ?? Date.now()).toISOString().slice(0, 10),
  };
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

// A published story, only if `userId` wrote it.
export async function getOwnedStory(id: string, userId: string): Promise<Story | null> {
  if (!hasDatabase) return null;
  await connect();
  const row = await StoryModel.findOne({ _id: id, userId, status: 'published' }, FIELDS).lean<Row>();
  return row ? toStory(row) : null;
}

// Returns false if the story doesn't exist or `userId` didn't write it.
export async function updateStory(id: string, userId: string, s: StoryFields, image: StoryImageInput | null): Promise<boolean> {
  if (!hasDatabase) throw new Error('MONGODB_URI is not set');
  await connect();
  const mine = { _id: id, userId, status: 'published' as const };
  // Check ownership before touching the photo.
  if (!(await StoryModel.exists(mine))) return false;
  const set: Record<string, string> = { place: s.place, title: s.title, body: s.text, name: s.name, hometown: s.from };
  if (image) {
    const img = await uploadStoryImage(id, image, true);
    set.imageUrl = img.url;
    set.imagePublicId = img.publicId;
  }
  await StoryModel.updateOne(mine, { $set: set });
  return true;
}

// Deletes the story and its photo. Returns false if it doesn't exist or `userId` didn't write it.
export async function deleteStory(id: string, userId: string): Promise<boolean> {
  if (!hasDatabase) throw new Error('MONGODB_URI is not set');
  await connect();
  const doc = await StoryModel.findOneAndDelete({ _id: id, userId }).lean<{ imagePublicId?: string }>();
  if (!doc) return false;
  if (doc.imagePublicId) await deleteImage(doc.imagePublicId).catch(e => console.error('deleteImage failed', doc.imagePublicId, e));
  return true;
}

export async function insertMessage(m: { name: string; email: string; message: string }): Promise<void> {
  if (!hasDatabase) throw new Error('MONGODB_URI is not set');
  await connect();
  await Message.create(m);
}

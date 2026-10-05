import { Schema, deleteModel, model, models, type InferSchemaType, type Model } from 'mongoose';

const StorySchema = new Schema(
  {
    // Short readable ids (s1, u…) are used in URLs, so they replace ObjectIds.
    _id: { type: String, required: true },
    place: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    name: { type: String, required: true },
    hometown: { type: String, required: true, default: 'Bangladesh' },
    date: { type: String, required: true }, // YYYY-MM-DD
    // The traveller's photo, stored on Cloudinary.
    imageUrl: { type: String },
    imagePublicId: { type: String },
    // The account that wrote it (Better Auth user id); starter stories have none.
    userId: { type: String, index: true },
    status: { type: String, required: true, enum: ['pending', 'published', 'rejected'], default: 'published' },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

StorySchema.index({ status: 1, date: -1, createdAt: -1 });

export type StoryDoc = InferSchemaType<typeof StorySchema>;

// Next re-runs this file on hot reload; replace the cached model so schema edits take effect.
if (models.Story) deleteModel('Story');
export const Story: Model<StoryDoc> = model<StoryDoc>('Story', StorySchema);

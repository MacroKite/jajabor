import { Schema, deleteModel, model, models, type InferSchemaType, type Model } from 'mongoose';

const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

export type MessageDoc = InferSchemaType<typeof MessageSchema>;

// Next re-runs this file on hot reload; replace the cached model so schema edits take effect.
if (models.Message) deleteModel('Message');
export const Message: Model<MessageDoc> = model<MessageDoc>('Message', MessageSchema);

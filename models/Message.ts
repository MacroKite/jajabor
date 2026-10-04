import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

export type MessageDoc = InferSchemaType<typeof MessageSchema>;

export const Message: Model<MessageDoc> = models.Message || model<MessageDoc>('Message', MessageSchema);

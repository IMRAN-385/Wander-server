import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  destinationId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', ReviewSchema);
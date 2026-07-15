import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  authorId: Schema.Types.ObjectId;
  authorName: string;
  authorAvatar?: string;
  tags: string[];
  readTime: number;
  createdAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String },
    authorAvatar: { type: String },
    tags: [{ type: String }],
    readTime: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
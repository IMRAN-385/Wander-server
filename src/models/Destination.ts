import mongoose, { Schema, Document } from 'mongoose';

export interface IDestination extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  category: string;
  location: string;
  country: string;
  continent: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  bestSeason: string;
  activities: string[];
  highlights: string[];
  amenities: string[];
  coordinates: { lat: number; lng: number };
  featured: boolean;
  trending: boolean;
  authorId: Schema.Types.ObjectId;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema = new Schema<IDestination>(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    images: [{ type: String }],
    category: { type: String, required: true, index: true },
    location: { type: String, required: true, index: true },
    country: { type: String, required: true, index: true },
    continent: { type: String, default: 'Asia' },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    bestSeason: { type: String, default: 'Year-round' },
    activities: [{ type: String }],
    highlights: [{ type: String }],
    amenities: [{ type: String }],
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    featured: { type: Boolean, default: false, index: true },
    trending: { type: Boolean, default: false, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String },
  },
  { timestamps: true }
);

DestinationSchema.index({ featured: 1, rating: -1 });
DestinationSchema.index({ trending: 1, reviewCount: -1 });

export default mongoose.model<IDestination>('Destination', DestinationSchema);
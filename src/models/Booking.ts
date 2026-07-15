import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: Schema.Types.ObjectId;
  destinationId: Schema.Types.ObjectId;
  destinationName: string;
  destinationImage: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
    destinationName: { type: String, required: true },
    destinationImage: { type: String },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, default: 1, min: 1 },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
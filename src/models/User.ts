import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  wishlist: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Destination' }],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { password, ...rest } = ret;
    return rest;
  },
});

export default mongoose.model<IUser>('User', UserSchema);
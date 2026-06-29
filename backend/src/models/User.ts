import { Schema, model } from 'mongoose';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    website: { type: String, default: '' },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager'],
      default: 'user',
    },
    enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    completedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    completedCategories: [{ type: String }],
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);

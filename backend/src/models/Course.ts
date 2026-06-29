import { Schema, model } from 'mongoose';
import { ICourse } from '../types';

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    thumbnail: { type: String, required: true },
    images: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'DevOps',
        'Design',
        'Business',
        'Marketing',
      ],
      index: true,
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      index: true,
    },
    price: { type: Number, required: true, min: 0, index: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    enrollments: { type: Number, default: 0, index: true },
    duration: { type: Number, required: true }, // in minutes
    tags: [{ type: String, lowercase: true }],
    outcomes: [{ type: String }],
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Text index for full-text search
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Compound index for common filter+sort queries
courseSchema.index({ category: 1, rating: -1 });
courseSchema.index({ category: 1, price: 1 });
courseSchema.index({ isPublished: 1, createdAt: -1 });

export const Course = model<ICourse>('Course', courseSchema);

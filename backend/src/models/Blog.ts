import { Schema, model } from 'mongoose';
import { IBlog } from '../types';

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    thumbnail: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String, lowercase: true }],
    isPublished: { type: Boolean, default: true, index: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ isPublished: 1, createdAt: -1 });

export const Blog = model<IBlog>('Blog', blogSchema);

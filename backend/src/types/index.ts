import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── User ───────────────────────────────────────────────
export type UserRole = 'user' | 'admin' | 'manager';

export interface IUser extends Document {
  _id: Types.ObjectId;
  clerkId: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  website?: string;
  role: UserRole;
  enrolledCourses: Types.ObjectId[];
  completedCourses: Types.ObjectId[];
  completedCategories: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Course ─────────────────────────────────────────────
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseCategory =
  | 'Web Development'
  | 'Mobile Development'
  | 'Data Science'
  | 'Machine Learning'
  | 'DevOps'
  | 'Design'
  | 'Business'
  | 'Marketing';

export interface ICourse extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  images: string[];
  category: CourseCategory;
  level: CourseLevel;
  price: number;
  rating: number;
  reviewCount: number;
  enrollments: number;
  duration: number; // minutes
  tags: string[];
  outcomes: string[];
  instructor: Types.ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Review ─────────────────────────────────────────────
export interface IReview extends Document {
  _id: Types.ObjectId;
  course: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

// ─── Blog ───────────────────────────────────────────────
export interface IBlog extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  author: Types.ObjectId;
  tags: string[];
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Request Extensions ──────────────────────────────────
// Use type intersection instead of interface extension to avoid
// TypeScript overload conflicts with Express route handlers
export type AuthenticatedRequest = Request & {
  auth: {
    userId: string;
    sessionId: string;
  };
  user?: IUser;
}

// ─── API Response ───────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── Pagination ─────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ─── Course Filter Params ────────────────────────────────
export interface CourseFilterParams {
  search?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: string;
  page: number;
  limit: number;
}

// ─── AI Types ───────────────────────────────────────────
export interface GeneratedCourseContent {
  description: string;
  outcomes: string[];
  tags: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// ─── Dashboard Stats ─────────────────────────────────────
export interface DashboardStats {
  totalCourses: number;
  totalUsers: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentEnrollments: Array<{ date: string; count: number }>;
  coursesByCategory: Array<{ category: string; count: number }>;
  levelDistribution: Array<{ level: string; count: number }>;
}

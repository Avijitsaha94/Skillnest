export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type CourseCategory =
  | "Web Development"
  | "Mobile Development"
  | "Data Science"
  | "Machine Learning"
  | "DevOps"
  | "Design"
  | "Business"
  | "Marketing";

export interface Course {
  _id: string;
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
  duration: number;
  tags: string[];
  outcomes: string[];
  instructor: { _id: string; name: string; avatar: string; bio?: string };
  isPublished: boolean;
  createdAt: string;
}

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  website?: string;
  role: "user" | "admin" | "manager";
  enrolledCourses: string[];
  completedCourses: string[];
  createdAt: string;
}

export interface Review {
  _id: string;
  course: string;
  user: { _id: string; name: string; avatar: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  author: { _id: string; name: string; avatar: string };
  tags: string[];
  views: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface FilterState {
  category: string;
  level: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  sort: string;
}

export interface GeneratedContent {
  description: string;
  outcomes: string[];
  tags: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AdminStats {
  overview: {
    totalCourses: number;
    totalUsers: number;
    totalReviews: number;
    totalBlogs: number;
    totalEnrollments: number;
    totalRevenue: number;
  };
  enrollmentStats: Array<{ _id: { week: number; year: number }; totalEnrollments: number }>;
  coursesByCategory: Array<{ category: string; count: number }>;
  levelDistribution: Array<{ level: string; count: number }>;
  revenueByCategory: Array<{ category: string; revenue: number }>;
  recentUsers: User[];
}

export interface UserStats {
  enrolledCount: number;
  completedCount: number;
  progressPercent: number;
  recentCourses: Course[];
}

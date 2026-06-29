import { Types } from 'mongoose';
import { Course } from '../models/Course';
import { ICourse, CourseFilterParams, PaginatedResponse } from '../types';

export class CourseRepository {
  static async findWithFilters(params: CourseFilterParams): Promise<PaginatedResponse<ICourse>> {
    const { search, category, level, minPrice, maxPrice, rating, sort = 'newest', page = 1, limit = 12 } = params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { isPublished: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (level) query.level = level;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    if (rating) query.rating = { $gte: Number(rating) };

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest:     { createdAt: -1 },
      rating:     { rating: -1 },
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      popular:    { enrollments: -1 },
    };

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Course.find(query)
        .populate('instructor', 'name avatar')
        .sort(sortMap[sort] ?? { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as unknown as ICourse[],
      Course.countDocuments(query),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async findById(id: string): Promise<ICourse | null> {
    return Course.findById(id)
      .populate('instructor', 'name avatar bio')
      .lean() as unknown as ICourse | null;
  }

  static async create(data: Partial<ICourse>): Promise<ICourse> {
    const course = new Course(data);
    return course.save() as unknown as ICourse;
  }

  static async update(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    return Course.findByIdAndUpdate(id, { $set: data }, { new: true }).lean() as unknown as ICourse | null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await Course.findByIdAndDelete(id);
    return !!result;
  }

  static async findTopRated(limit = 8): Promise<ICourse[]> {
    return Course.find({ isPublished: true })
      .populate('instructor', 'name avatar')
      .sort({ rating: -1, enrollments: -1 })
      .limit(limit)
      .lean() as unknown as ICourse[];
  }

  static async findCandidatesForRecommendation(
    excludeIds: Types.ObjectId[],
    preferredCategories: string[]
  ): Promise<ICourse[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {
      isPublished: true,
      _id: { $nin: excludeIds },
    };
    if (preferredCategories.length > 0) {
      query.category = { $in: preferredCategories };
    }
    return Course.find(query).sort({ rating: -1 }).limit(20).lean() as unknown as ICourse[];
  }

  static async updateRating(courseId: string): Promise<void> {
    const { Review } = await import('../models/Review');
    const result = await Review.aggregate([
      { $match: { course: new Types.ObjectId(courseId) } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const avg = result[0]?.avg ?? 0;
    const count = result[0]?.count ?? 0;
    await Course.findByIdAndUpdate(courseId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: count,
    });
  }

  static async incrementEnrollment(courseId: string): Promise<void> {
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollments: 1 } });
  }

  static async getStats() {
    const [total, byCategory, byLevel] = await Promise.all([
      Course.countDocuments({ isPublished: true }),
      Course.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { category: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
      Course.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$level', count: { $sum: 1 } } },
        { $project: { level: '$_id', count: 1, _id: 0 } },
      ]),
    ]);
    return { total, byCategory, byLevel };
  }

  static async getAdminAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Course.find()
        .populate('instructor', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as unknown as ICourse[],
      Course.countDocuments(),
    ]);
    return { items, total, page, pages: Math.ceil(total / limit) };
  }
}
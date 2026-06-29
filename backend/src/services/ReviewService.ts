import { Types } from 'mongoose';
import { Review } from '../models/Review';
import { IReview } from '../types';
import { createError } from '../middleware/errorHandler';
import { CourseRepository } from '../repositories/CourseRepository';
import { UserRepository } from '../repositories/UserRepository';
import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
});

export class ReviewService {
  static async getByCourse(courseId: string, page = 1, limit = 10) {
    if (!Types.ObjectId.isValid(courseId)) throw createError('Invalid course ID', 400);

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Review.find({ course: courseId })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IReview[]>(),
      Review.countDocuments({ course: courseId }),
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  static async create(
    courseId: string,
    clerkId: string,
    data: z.infer<typeof createReviewSchema>
  ): Promise<IReview> {
    if (!Types.ObjectId.isValid(courseId)) throw createError('Invalid course ID', 400);

    const [course, user] = await Promise.all([
      CourseRepository.findById(courseId),
      UserRepository.findByClerkId(clerkId),
    ]);

    if (!course) throw createError('Course not found', 404);
    if (!user) throw createError('User not found', 404);

    // Must be enrolled to review
    const isEnrolled = user.enrolledCourses.map(String).includes(courseId);
    if (!isEnrolled) throw createError('You must be enrolled to leave a review', 403);

    const validated = createReviewSchema.parse(data);

    // Check duplicate
    const existing = await Review.findOne({ course: courseId, user: user._id });
    if (existing) throw createError('You have already reviewed this course', 409);

    const review = new Review({
      course: courseId,
      user: user._id,
      ...validated,
    });
    await review.save();

    // Recalculate course rating asynchronously
    CourseRepository.updateRating(courseId).catch(console.error);

    return review.populate('user', 'name avatar') as unknown as IReview;
  }

  static async delete(reviewId: string, clerkId: string): Promise<void> {
    const [review, user] = await Promise.all([
      Review.findById(reviewId),
      UserRepository.findByClerkId(clerkId),
    ]);

    if (!review) throw createError('Review not found', 404);
    if (!user) throw createError('User not found', 404);

    const isOwner = String(review.user) === String(user._id);
    const isAdmin = user.role === 'admin' || user.role === 'manager';

    if (!isOwner && !isAdmin) throw createError('Permission denied', 403);

    const courseId = String(review.course);
    await review.deleteOne();
    CourseRepository.updateRating(courseId).catch(console.error);
  }

  static async getAllAdmin(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Review.find()
        .populate('user', 'name avatar email')
        .populate('course', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IReview[]>(),
      Review.countDocuments(),
    ]);
    return { items, total, page, pages: Math.ceil(total / limit) };
  }
}

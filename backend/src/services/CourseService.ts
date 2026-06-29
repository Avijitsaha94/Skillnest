import { Types } from 'mongoose';
import { CourseRepository } from '../repositories/CourseRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ICourse, CourseFilterParams } from '../types';
import { createError } from '../middleware/errorHandler';
import { z } from 'zod';

// ─── Zod Validators ────────────────────────────────────────
export const createCourseSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(50),
  shortDescription: z.string().min(10).max(200),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()).optional().default([]),
  category: z.enum([
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Design',
    'Business',
    'Marketing',
  ]),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  price: z.number().min(0).max(9999),
  duration: z.number().min(1),
  tags: z.array(z.string()).max(10).optional().default([]),
  outcomes: z.array(z.string()).min(3).max(10),
});

export const updateCourseSchema = createCourseSchema.partial();

// ─── Course Service ────────────────────────────────────────
export class CourseService {
  static async getAll(params: CourseFilterParams) {
    return CourseRepository.findWithFilters(params);
  }

  static async getById(id: string): Promise<ICourse> {
    if (!Types.ObjectId.isValid(id)) throw createError('Invalid course ID', 400);
    const course = await CourseRepository.findById(id);
    if (!course) throw createError('Course not found', 404);
    return course;
  }

  static async create(
    data: z.infer<typeof createCourseSchema>,
    instructorClerkId: string
  ): Promise<ICourse> {
    const instructor = await UserRepository.findByClerkId(instructorClerkId);
    if (!instructor) throw createError('Instructor not found', 404);

    const validated = createCourseSchema.parse(data);
    return CourseRepository.create({
      ...validated,
      instructor: instructor._id,
    });
  }

  static async update(
    id: string,
    data: z.infer<typeof updateCourseSchema>,
    requestorClerkId: string
  ): Promise<ICourse> {
    if (!Types.ObjectId.isValid(id)) throw createError('Invalid course ID', 400);

    const course = await CourseRepository.findById(id);
    if (!course) throw createError('Course not found', 404);

    const requestor = await UserRepository.findByClerkId(requestorClerkId);
    const isAdmin = requestor?.role === 'admin' || requestor?.role === 'manager';
    const isOwner = String(course.instructor) === String(requestor?._id);

    if (!isAdmin && !isOwner) throw createError('Permission denied', 403);

    const validated = updateCourseSchema.parse(data);
    const updated = await CourseRepository.update(id, validated);
    if (!updated) throw createError('Update failed', 500);
    return updated;
  }

  static async delete(id: string, requestorClerkId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw createError('Invalid course ID', 400);

    const requestor = await UserRepository.findByClerkId(requestorClerkId);
    if (requestor?.role !== 'admin') throw createError('Only admins can delete courses', 403);

    const deleted = await CourseRepository.delete(id);
    if (!deleted) throw createError('Course not found', 404);
  }

  static async enroll(courseId: string, clerkId: string): Promise<void> {
    if (!Types.ObjectId.isValid(courseId)) throw createError('Invalid course ID', 400);

    const [course, user] = await Promise.all([
      CourseRepository.findById(courseId),
      UserRepository.findByClerkId(clerkId),
    ]);

    if (!course) throw createError('Course not found', 404);
    if (!user) throw createError('User not found', 404);

    const alreadyEnrolled = user.enrolledCourses
      .map(String)
      .includes(courseId);
    if (alreadyEnrolled) throw createError('Already enrolled in this course', 409);

    await Promise.all([
      UserRepository.addEnrolledCourse(clerkId, new Types.ObjectId(courseId)),
      CourseRepository.incrementEnrollment(courseId),
    ]);
  }

  static async getTopRated() {
    return CourseRepository.findTopRated(8);
  }

  static async getStats() {
    return CourseRepository.getStats();
  }
}

import { Course } from '../models/Course';
import { User } from '../models/User';
import { Review } from '../models/Review';
import { Blog } from '../models/Blog';

export class DashboardService {
  // Admin overview stats
  static async getAdminStats() {
    const [
      totalCourses,
      totalUsers,
      totalReviews,
      totalBlogs,
      enrollmentStats,
      coursesByCategory,
      levelDistribution,
      revenueByCategory,
      recentUsers,
    ] = await Promise.all([
      Course.countDocuments({ isPublished: true }),
      User.countDocuments(),
      Review.countDocuments(),
      Blog.countDocuments({ isPublished: true }),

      // Enrollments over last 12 weeks
      Course.aggregate([
        {
          $group: {
            _id: {
              week: { $week: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            totalEnrollments: { $sum: '$enrollments' },
          },
        },
        { $sort: { '_id.year': 1, '_id.week': 1 } },
        { $limit: 12 },
      ]),

      // Courses by category
      Course.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { category: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      // Level distribution
      Course.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$level', count: { $sum: 1 } } },
        { $project: { level: '$_id', count: 1, _id: 0 } },
      ]),

      // Revenue (price × enrollments) by category
      Course.aggregate([
        { $match: { isPublished: true } },
        {
          $group: {
            _id: '$category',
            revenue: { $sum: { $multiply: ['$price', '$enrollments'] } },
          },
        },
        { $project: { category: '$_id', revenue: 1, _id: 0 } },
        { $sort: { revenue: -1 } },
      ]),

      // Recent 5 users
      User.find().sort({ createdAt: -1 }).limit(5).select('name email avatar role createdAt'),
    ]);

    const totalEnrollments = await Course.aggregate([
      { $group: { _id: null, total: { $sum: '$enrollments' } } },
    ]);
    const totalRevenue = revenueByCategory.reduce(
      (sum: number, c: { revenue: number }) => sum + c.revenue,
      0
    );

    return {
      overview: {
        totalCourses,
        totalUsers,
        totalReviews,
        totalBlogs,
        totalEnrollments: totalEnrollments[0]?.total ?? 0,
        totalRevenue: Math.round(totalRevenue),
      },
      enrollmentStats,
      coursesByCategory,
      levelDistribution,
      revenueByCategory,
      recentUsers,
    };
  }

  // User-facing dashboard stats
  static async getUserStats(userId: string) {
    const user = await User.findById(userId)
      .populate({
        path: 'enrolledCourses',
        select: 'title thumbnail category level rating duration',
        options: { limit: 6 },
      })
      .lean();

    const enrolledCount = Array.isArray(user?.enrolledCourses)
      ? user.enrolledCourses.length
      : 0;
    const completedCount = Array.isArray(user?.completedCourses)
      ? user.completedCourses.length
      : 0;

    return {
      enrolledCount,
      completedCount,
      progressPercent:
        enrolledCount > 0 ? Math.round((completedCount / enrolledCount) * 100) : 0,
      recentCourses: user?.enrolledCourses ?? [],
    };
  }
}

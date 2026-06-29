import { Types } from 'mongoose';
import { User } from '../models/User';
import { IUser } from '../types';

export class UserRepository {
  static async findByClerkId(clerkId: string): Promise<IUser | null> {
    return User.findOne({ clerkId }).lean<IUser>();
  }

  static async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    return User.findById(id).lean<IUser>();
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() }).lean<IUser>();
  }

  static async create(data: {
    clerkId: string;
    email: string;
    name: string;
    avatar?: string;
  }): Promise<IUser> {
    const user = new User(data);
    return user.save() as unknown as IUser;
  }

  static async updateProfile(
    clerkId: string,
    data: Partial<Pick<IUser, 'name' | 'bio' | 'website' | 'avatar'>>
  ): Promise<IUser | null> {
    return User.findOneAndUpdate(
      { clerkId },
      { $set: data },
      { new: true }
    ).lean<IUser>();
  }

  static async updateRole(
    userId: string,
    role: IUser['role']
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $set: { role } },
      { new: true }
    ).lean<IUser>();
  }

  static async addEnrolledCourse(
    clerkId: string,
    courseId: Types.ObjectId
  ): Promise<IUser | null> {
    return User.findOneAndUpdate(
      { clerkId },
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    ).lean<IUser>();
  }

  static async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find()
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IUser[]>(),
      User.countDocuments(),
    ]);
    return { users, total, page, pages: Math.ceil(total / limit) };
  }

  static async getTotalCount(): Promise<number> {
    return User.countDocuments();
  }

  static async findByIdWithHistory(userId: string): Promise<IUser | null> {
    return User.findById(userId)
      .populate('enrolledCourses', 'category tags')
      .lean<IUser>();
  }
}

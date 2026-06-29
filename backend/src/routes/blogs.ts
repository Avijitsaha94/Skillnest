import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, attachUser, requireRole } from '../middleware/auth';
import { Blog } from '../models/Blog';
import { IUser } from '../types';
import { z } from 'zod';

const router = Router();
const asAuth = (req: Request) => req as Request & { auth: { userId: string }; user?: IUser };

const blogSchema = z.object({
  title: z.string().min(5).max(150),
  slug: z.string().min(3).max(150).regex(/^[a-z0-9-]+$/),
  content: z.string().min(100),
  excerpt: z.string().min(20).max(300),
  thumbnail: z.string().url(),
  tags: z.array(z.string()).max(10).default([]),
  isPublished: z.boolean().default(true),
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 9);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Blog.find({ isPublished: true }).populate('author', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments({ isPublished: true }),
    ]);
    res.json({ success: true, data: { items, total, page, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
});

router.get('/admin/all', requireAuth, attachUser, requireRole('admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page ?? 1);
      const skip = (page - 1) * 10;
      const [items, total] = await Promise.all([
        Blog.find().populate('author', 'name').sort({ createdAt: -1 }).skip(skip).limit(10).lean(),
        Blog.countDocuments(),
      ]);
      res.json({ success: true, data: { items, total, page, pages: Math.ceil(total / 10) } });
    } catch (err) { next(err); }
  }
);

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true }).populate('author', 'name avatar bio');
    if (!blog) { res.status(404).json({ success: false, error: 'Post not found' }); return; }
    blog.views += 1;
    await blog.save();
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
});

router.post('/', requireAuth, attachUser, requireRole('admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = blogSchema.parse(req.body);
      const blog = new Blog({ ...validated, author: asAuth(req).user!._id });
      await blog.save();
      res.status(201).json({ success: true, data: blog });
    } catch (err) { next(err); }
  }
);

router.patch('/:id', requireAuth, attachUser, requireRole('admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = blogSchema.partial().parse(req.body);
      const blog = await Blog.findByIdAndUpdate(req.params.id, { $set: validated }, { new: true });
      if (!blog) { res.status(404).json({ success: false, error: 'Post not found' }); return; }
      res.json({ success: true, data: blog });
    } catch (err) { next(err); }
  }
);

router.delete('/:id', requireAuth, attachUser, requireRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);
      if (!blog) { res.status(404).json({ success: false, error: 'Post not found' }); return; }
      res.json({ success: true, message: 'Post deleted' });
    } catch (err) { next(err); }
  }
);

export default router;
import { Router, Request, Response, NextFunction } from 'express';
import { requireAuthGuard, attachUser, requireRole, getUserId } from '../middleware/auth';
import { CourseService, createCourseSchema, updateCourseSchema } from '../services/CourseService';

const router = Router();

// ── Public ──────────────────────────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseService.getAll({
      search: req.query.search as string | undefined,
      category: req.query.category as string | undefined,
      level: req.query.level as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      rating: req.query.rating ? Number(req.query.rating) : undefined,
      sort: (req.query.sort as string) ?? 'newest',
      page: Number(req.query.page ?? 1),
      limit: Math.min(Number(req.query.limit ?? 12), 50),
    });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.get('/top', async (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await CourseService.getTopRated() }); }
  catch (err) { next(err); }
});

router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await CourseService.getStats() }); }
  catch (err) { next(err); }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await CourseService.getById(req.params.id) }); }
  catch (err) { next(err); }
});

// ── Protected ────────────────────────────────────────────
router.post('/:id/enroll', requireAuthGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CourseService.enroll(req.params.id, getUserId(req));
      res.json({ success: true, message: 'Successfully enrolled' });
    } catch (err) { next(err); }
  }
);

// ── Admin ─────────────────────────────────────────────────
router.post('/', requireAuthGuard, attachUser, requireRole('admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await CourseService.create(createCourseSchema.parse(req.body), getUserId(req));
      res.status(201).json({ success: true, data: course });
    } catch (err) { next(err); }
  }
);

router.patch('/:id', requireAuthGuard, attachUser, requireRole('admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await CourseService.update(req.params.id, updateCourseSchema.parse(req.body), getUserId(req));
      res.json({ success: true, data: course });
    } catch (err) { next(err); }
  }
);

router.delete('/:id', requireAuthGuard, attachUser, requireRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CourseService.delete(req.params.id, getUserId(req));
      res.json({ success: true, message: 'Course deleted' });
    } catch (err) { next(err); }
  }
);

export default router;
import { Router, Request, Response, NextFunction } from 'express';
import { requireAuthGuard, attachUser, requireRole, getUserId } from '../middleware/auth';
import { ReviewService, createReviewSchema } from '../services/ReviewService';

const router = Router();

router.get('/course/:courseId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ReviewService.getByCourse(req.params.courseId, Number(req.query.page ?? 1), Number(req.query.limit ?? 10));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/course/:courseId', requireAuthGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await ReviewService.create(req.params.courseId, getUserId(req), createReviewSchema.parse(req.body));
      res.status(201).json({ success: true, data: review });
    } catch (err) { next(err); }
  }
);

router.delete('/:id', requireAuthGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ReviewService.delete(req.params.id, getUserId(req));
      res.json({ success: true, message: 'Review deleted' });
    } catch (err) { next(err); }
  }
);

router.get('/admin/all', requireAuthGuard, attachUser, requireRole('admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ReviewService.getAllAdmin(Number(req.query.page ?? 1));
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }
);

export default router;
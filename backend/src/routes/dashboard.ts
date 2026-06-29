import { Router, Request, Response, NextFunction } from 'express';
import { requireAuthGuard, attachUser, requireRole, getDbUser } from '../middleware/auth';
import { DashboardService } from '../services/DashboardService';
import { CourseRepository } from '../repositories/CourseRepository';

const router = Router();

router.get('/user', requireAuthGuard, attachUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getDbUser(req);
      const stats = await DashboardService.getUserStats(String(user!._id));
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  }
);

router.get('/admin', requireAuthGuard, attachUser, requireRole('admin', 'manager'),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ success: true, data: await DashboardService.getAdminStats() });
    } catch (err) { next(err); }
  }
);

router.get('/admin/courses', requireAuthGuard, attachUser, requireRole('admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CourseRepository.getAdminAll(Number(req.query.page ?? 1), Number(req.query.limit ?? 10));
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }
);

export default router;
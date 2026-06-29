import { Router, Request, Response, NextFunction } from 'express';
import { requireAuthGuard, attachUser, requireRole, getUserId } from '../middleware/auth';
import { UserRepository } from '../repositories/UserRepository';
import { z } from 'zod';

const router = Router();

const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal('')),
  avatar: z.string().url().optional(),
});

router.get('/me', requireAuthGuard, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserRepository.findByClerkId(getUserId(req));
    if (!user) { res.status(404).json({ success: false, error: 'User not found' }); return; }
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

router.patch('/me', requireAuthGuard, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await UserRepository.updateProfile(getUserId(req), profileSchema.parse(req.body));
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

router.get('/', requireAuthGuard, attachUser, requireRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await UserRepository.findAllPaginated(Number(req.query.page ?? 1), Number(req.query.limit ?? 20));
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }
);

router.patch('/:id/role', requireAuthGuard, attachUser, requireRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = z.object({ role: z.enum(['user', 'admin', 'manager']) }).parse(req.body);
      const updated = await UserRepository.updateRole(req.params.id, role);
      res.json({ success: true, data: updated });
    } catch (err) { next(err); }
  }
);

export default router;
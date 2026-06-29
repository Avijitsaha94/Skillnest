import { Router, Request, Response, NextFunction } from 'express';
import { requireAuthGuard, attachUser, getDbUser } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimiter';
import { AIService } from '../services/AIService';
import { z } from 'zod';

const router = Router();

const generateSchema = z.object({
  title: z.string().min(5).max(100),
  audience: z.string().min(5).max(200),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(2000),
  })).min(1).max(20),
});

router.post('/generate', aiLimiter, requireAuthGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const content = await AIService.generateCourseContent(generateSchema.parse(req.body));
      res.json({ success: true, data: content });
    } catch (err) { next(err); }
  }
);

router.get('/recommendations', aiLimiter, requireAuthGuard, attachUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getDbUser(req);
      const courses = await AIService.getRecommendations(String(user!._id));
      res.json({ success: true, data: courses });
    } catch (err) { next(err); }
  }
);

router.post('/chat', aiLimiter, requireAuthGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { messages } = chatSchema.parse(req.body);
      await AIService.streamChatResponse(messages, res);
    } catch (err) { next(err); }
  }
);

export default router;
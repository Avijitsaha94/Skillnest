import { Request, Response, NextFunction } from 'express';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { UserRole, IUser } from '../types';
import { UserRepository } from '../repositories/UserRepository';

// Clerk middleware — verifies JWT on every request
export const requireAuth = clerkMiddleware();

// Guard: reject if not authenticated
export const requireAuthGuard = (req: Request, res: Response, next: NextFunction): void => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }
  next();
};

// Attach full DB user to req after auth
export const attachUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const user = await UserRepository.findByClerkId(auth.userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found in database' });
      return;
    }
    // Attach to request object
    (req as Request & { dbUser: IUser }).dbUser = user;
    next();
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
};

// RBAC guard — use after attachUser
export const requireRole = (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as Request & { dbUser?: IUser }).dbUser;
    if (!user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    if (!roles.includes(user.role)) {
      res.status(403).json({ success: false, error: `Access denied. Required: ${roles.join(' or ')}` });
      return;
    }
    next();
  };

// Helper: get userId from request
export const getUserId = (req: Request): string => {
  const auth = getAuth(req);
  return auth?.userId ?? '';
};

// Helper: get dbUser from request
export const getDbUser = (req: Request): IUser | undefined => {
  return (req as Request & { dbUser?: IUser }).dbUser;
};
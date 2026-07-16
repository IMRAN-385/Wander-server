import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  userId: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in .env — refusing to start with an insecure default.');
}

export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: '7d' });
};

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(authHeader.slice(7), JWT_SECRET as string) as AuthPayload;
    } catch {
      // ignore invalid token — this route just proceeds unauthenticated
    }
  }
  next();
};

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin access required' });
    return;
  }
  next();
};
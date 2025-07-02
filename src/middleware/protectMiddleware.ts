import { Request, Response, NextFunction, RequestHandler } from 'express';
import { TokenPayload } from '../token/types';

export function protectMiddleware(allowedRoles: string[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as TokenPayload | undefined;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized: No user found' });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
}

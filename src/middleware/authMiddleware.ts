import { Request, Response, NextFunction, RequestHandler } from 'express';
import { TokenManager } from '../token/tokenManager';
import { TokenPayload } from '../token/types';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authMiddleware(tokenManager: TokenManager): RequestHandler {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = tokenManager.verifyAccess(token);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }
  };
}

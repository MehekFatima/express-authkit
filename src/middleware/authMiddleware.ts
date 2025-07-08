import { Request, Response, NextFunction, RequestHandler } from 'express';
import { TokenManager } from '../token/tokenManager';
import { TokenPayload } from '../token/types';
import { MongoTokenBlacklist } from '../session/MongoTokenBlacklist';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authMiddleware(tokenManager: TokenManager, blackList?: MongoTokenBlacklist): RequestHandler {
  
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const cookieToken = req.cookies?.accessToken || null;

    const token = bearerToken || cookieToken;

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    if (blackList && await blackList.isBlacklisted(token)) {
      res.status(401).json({ message: 'Token has been revoked' });
      return;
    }
    try {
      const decoded = tokenManager.verifyAccess(token);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}

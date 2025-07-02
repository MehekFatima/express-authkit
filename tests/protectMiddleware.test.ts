import express, { Request, Response } from 'express';
import request from 'supertest';
import { TokenManager } from '../src/token/tokenManager';
import { authMiddleware } from '../src/middleware/authMiddleware';
import { protectMiddleware } from '../src/middleware/protectMiddleware';

const ACCESS_SECRET = 'test-access';
const REFRESH_SECRET = 'test-refresh';

describe('protectMiddleware', () => {
  const tokenManager = new TokenManager(
    { secret: ACCESS_SECRET, expiresIn: '1h' },
    { secret: REFRESH_SECRET, expiresIn: '7d' }
  );

  let app: express.Express;
  let adminToken: string;
  let userToken: string;

  beforeAll(() => {
    adminToken = tokenManager.signTokens({ id: 'admin1', role: 'admin' }).accessToken;
    userToken = tokenManager.signTokens({ id: 'user1', role: 'user' }).accessToken;

    app = express();
    app.use(authMiddleware(tokenManager));

    app.get('/admin', protectMiddleware(['admin']), (req: Request, res: Response) => {
      res.json({ message: `Welcome admin ${req.user?.id}` });
    });

    app.get('/user-or-admin', protectMiddleware(['user', 'admin']), (req: Request, res: Response) => {
      res.json({ message: `Welcome ${req.user?.id}` });
    });
  });

  it('allows access to admin route for admin user', async () => {
    const res = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/admin admin1/);
  });

  it('denies access to admin route for non-admin user', async () => {
    const res = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: Insufficient permissions');
  });

  it('allows access to mixed route for user', async () => {
    const res = await request(app)
      .get('/user-or-admin')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Welcome user1/);
  });
});

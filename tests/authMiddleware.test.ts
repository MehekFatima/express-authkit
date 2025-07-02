import express, { Request, Response } from 'express';
import request from 'supertest';
import { authMiddleware } from '../src/middleware/authMiddleware';
import { TokenManager } from '../src/token/tokenManager';

const ACCESS_SECRET = 'test-access-secret';
const REFRESH_SECRET = 'test-refresh-secret';

describe('authMiddleware', () => {
  const tokenManager = new TokenManager(
    { secret: ACCESS_SECRET, expiresIn: '1h' },
    { secret: REFRESH_SECRET, expiresIn: '7d' }
  );

  let app: express.Express;
  let accessToken: string;

  beforeAll(() => {
    accessToken = tokenManager.signTokens({ id: 'user123', role: 'admin' }).accessToken;

    app = express();
    app.use(authMiddleware(tokenManager));
    app.get('/protected', (req: Request, res: Response) => {
      res.json({ user: req.user });
    });
  });

  it('allows access with valid token and attaches user to req', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ id: 'user123', role: 'admin' });
  });

  it('rejects access if Authorization header is missing', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Missing or invalid Authorization header' });
  });

  it('rejects access if token is invalid', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer invalid.token.here`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Invalid or expired token' });
  });

  it('rejects access if Authorization header does not start with Bearer', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Token ${accessToken}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Missing or invalid Authorization header' });
  });
});

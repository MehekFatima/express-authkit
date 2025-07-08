import { Command } from 'commander';
import express from 'express';
import cookieParser from 'cookie-parser';
import { TokenManager } from '../../token/tokenManager';

export const setCookieTokenCommand = new Command('set-cookie-token')
  .description('Start a test server and set JWT as cookie (for dev/test only)')
  .requiredOption('--id <id>', 'User ID')
  .requiredOption('--role <role>', 'User Role')
  .option('--access-secret <secret>', 'Access token secret', process.env.ACCESS_SECRET || 'default-access')
  .option('--access-expiry <expiry>', 'Access token expiry', process.env.ACCESS_EXPIRY || '15m')
  .option('--port <port>', 'Port to run test server on', '4000')
  .action((opts) => {
    const tokenManager = new TokenManager(
      { secret: opts.accessSecret, expiresIn: opts.accessExpiry },
      { secret: 'dummy', expiresIn: '1d' }
    );

    const token = tokenManager.signAccess({ id: opts.id, role: opts.role });

    const app = express();
    app.use(cookieParser());

    app.get('/set-cookie', (req, res) => {
      res.cookie('accessToken', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15, 
      });
      res.json({ message: '🍪 Token set in cookie', token });
    });

    app.get('/clear-cookie', (req, res) => {
      res.clearCookie('accessToken');
      res.json({ message: '🧹 Cookie cleared' });
    });

    app.listen(opts.port, () => {
      console.log(`🚀 Test server running at http://localhost:${opts.port}`);
      console.log(`🔐 Access http://localhost:${opts.port}/set-cookie to set token in browser`);
    });
  });

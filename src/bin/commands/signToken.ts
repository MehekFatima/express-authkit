import { Command } from 'commander';
import { TokenManager } from '../../token/tokenManager';

export const signCommand = new Command('sign-token')
  .description('Generate a new access/refresh token')
  .requiredOption('--id <id>', 'User ID')
  .requiredOption('--role <role>', 'User role')
  .option('--access-secret <secret>', 'Access token secret', process.env.ACCESS_SECRET || 'default-access')
  .option('--refresh-secret <secret>', 'Refresh token secret', process.env.REFRESH_SECRET || 'default-refresh')
  .option('--access-expiry <exp>', 'Access token expiry', process.env.ACCESS_EXPIRY || '15m')
  .option('--refresh-expiry <exp>', 'Refresh token expiry', process.env.REFRESH_EXPIRY || '7d')
  .action((opts) => {
    const tokenManager = new TokenManager(
      { secret: opts.accessSecret, expiresIn: opts.accessExpiry },
      { secret: opts.refreshSecret, expiresIn: opts.refreshExpiry }
    );

    const payload = { id: opts.id, role: opts.role };
    const tokens = tokenManager.signTokens(payload);

    console.log(`\nAccess Token:\n${tokens.accessToken}`);
    console.log(`\nRefresh Token:\n${tokens.refreshToken}\n`);
  });

import { Command } from 'commander';
import { TokenManager } from '../../token/tokenManager';

export const refreshCommand = new Command('refresh-token')
  .description('Generate a new access token using refresh token')
  .requiredOption('--refresh-token <token>', 'Valid refresh token')
  .option('--access-secret <secret>', 'Access token secret', process.env.ACCESS_SECRET || 'default-access-secret')
  .option('--refresh-secret <secret>', 'Refresh token secret', process.env.REFRESH_SECRET || 'default-refresh-secret')
  .option('--access-expiry <expiry>', 'Access token expiry time', process.env.ACCESS_EXPIRY || '15m')
  .option('--refresh-expiry <expiry>', 'Refresh token expiry time', process.env.REFRESH_EXPIRY || '7d')
  .action((opts) => {
    const tokenManager = new TokenManager(
      { secret: opts.accessSecret, expiresIn: opts.accessExpiry },
      { secret: opts.refreshSecret, expiresIn: opts.refreshExpiry }
    );

    try {
      const payload = tokenManager.verifyRefresh(opts.refreshToken);
      const newTokens = tokenManager.signTokens(payload);

      console.log(`\n🎉 Token refreshed successfully!`);
      console.log(`New Access Token:\n${newTokens.accessToken}\n`);
    } catch (err: any) {
      console.error(`\n❌ Refresh failed: ${err.message}`);
    }
  });

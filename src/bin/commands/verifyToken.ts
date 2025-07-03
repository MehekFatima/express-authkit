import { Command } from "commander";
import { TokenManager } from "../../token/tokenManager";
export const verifyCommand = new Command('verify-token')
  .description('Verify a token and show the payload')
  .requiredOption('--token <token>', 'JWT token to verify')
  .option('--access-secret <secret>', 'Access token secret', process.env.ACCESS_SECRET || 'default-access')
  .option('--refresh-secret <secret>', 'Refresh token secret', process.env.REFRESH_SECRET || process.env.ACCESS_SECRET || 'default-access')
  .option('--refresh', 'Verify as refresh token', false)
  .action((opts: { accessSecret: any; refreshSecret: any; refresh: any; token: any; }) => {
    const accessSecret = opts.accessSecret || process.env.ACCESS_SECRET || 'default-access';
    const refreshSecret = opts.refreshSecret || process.env.REFRESH_SECRET || accessSecret;

    const tokenManager = new TokenManager(
      { secret: accessSecret, expiresIn: process.env.ACCESS_EXPIRY || '15m' },
      { secret: refreshSecret, expiresIn: process.env.REFRESH_EXPIRY || '7d' }
    );

    try {
      const decoded = opts.refresh
        ? tokenManager.verifyRefresh(opts.token)
        : tokenManager.verifyAccess(opts.token);

      console.log(`\n✅ Token is valid. Decoded payload:\n`);
      console.log(decoded);
    } catch (err: any) {
      console.error(`\n❌ Invalid token:\n${err.message}`);
    }
  });

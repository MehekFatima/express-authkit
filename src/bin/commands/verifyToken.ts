import { Command } from 'commander';
import { TokenManager } from '../../token/tokenManager';
import { MongoTokenBlacklist } from '../../session/MongoTokenBlacklist'; 
import dotenv from 'dotenv';

dotenv.config();

export const verifyCommand = new Command('verify-token')
  .description('Verify a JWT access token')
  .requiredOption('--token <jwt>', 'Token to verify')
  .option('--mongo <uri>', 'Mongo URI to check blacklist') 
  .action(async ({ token, mongo }) => {
    const tokenManager = new TokenManager(
      { secret: process.env.ACCESS_SECRET || 'your-access-secret', expiresIn: '15m' },
      { secret: process.env.REFRESH_SECRET || 'your-refresh-secret', expiresIn: '7d' }
    );

    const mongoUri = mongo || process.env.MONGO_URI;
    if (mongoUri) {
      const blacklist = new MongoTokenBlacklist(mongoUri);
      await blacklist.init();

      const isRevoked = await blacklist.isBlacklisted(token);
      if (isRevoked) {
        console.log('❌ Token is blacklisted (revoked)');
        return;
      }
    }

    try {
      const decoded = tokenManager.verifyAccess(token);
      console.log('✅ Token is valid. Decoded payload:\n');
      console.log(decoded);
    } catch (err) {
      console.error('❌ Invalid or expired token');
    }
  });

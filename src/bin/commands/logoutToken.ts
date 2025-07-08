import { Command } from 'commander';
import jwt from 'jsonwebtoken';
import { MongoTokenBlacklist } from '../../session/MongoTokenBlacklist';

export const logoutCommand = new Command('logout-token')
  .description('Blacklist a JWT token (logout) using MongoDB')
  .requiredOption('--token <jwt>', 'JWT token to revoke')
  .requiredOption('--mongo <url>', 'MongoDB URL')
  .action(async ({ token, mongo }) => {
    const decoded: any = jwt.decode(token);
    const exp = decoded?.exp;
    if (!exp) {
      console.error('❌ Invalid token');
      return;
    }

    const expiresIn = exp - Math.floor(Date.now() / 1000);
    const blacklist = new MongoTokenBlacklist(mongo);
    await blacklist.init(); 
    await blacklist.blacklistToken(token, expiresIn);

    console.log('✅ Token successfully blacklisted');
  });

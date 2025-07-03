import { Command } from 'commander';
import { TokenManager } from '../../token/tokenManager';

export const createUserCommand = new Command('create-user')
  .description('Create user and generate access & refresh tokens')
  .requiredOption('--id <string>', 'User ID')
  .requiredOption('--role <string>', 'User role')
  .action(({ id, role }) => {
    const tokenManager = new TokenManager(
      {
        secret: process.env.ACCESS_SECRET || 'default-access-secret',
        expiresIn: process.env.ACCESS_EXPIRY || '15m',
      },
      {
        secret: process.env.REFRESH_SECRET || 'default-refresh-secret',
        expiresIn: process.env.REFRESH_EXPIRY || '7d',
      }
    );

    const tokens = tokenManager.signTokens({ id, role });

    console.log('✅ User created!');
    console.log('Access Token:\n', tokens.accessToken);
    console.log('Refresh Token:\n', tokens.refreshToken);
  });

export const config = {
  accessSecret: process.env.ACCESS_SECRET || 'default-access-secret',
  refreshSecret: process.env.REFRESH_SECRET || 'default-refresh-secret',
  accessExpiry: process.env.ACCESS_EXPIRY || '15m',
  refreshExpiry: process.env.REFRESH_EXPIRY || '7d',

  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  sessionPrefix: process.env.SESSION_PREFIX || 'express-authkit:sess:',
};

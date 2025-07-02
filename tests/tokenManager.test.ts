import { TokenManager } from '../src/token/tokenManager';

describe('TokenManager', () => {
  const accessSecret = 'test-access-secret';
  const refreshSecret = 'test-refresh-secret';
  const accessExpiry = '1h';
  const refreshExpiry = '7d';

  const tokenManager = new TokenManager(
    { secret: accessSecret, expiresIn: accessExpiry },
    { secret: refreshSecret, expiresIn: refreshExpiry }
  );

  const payload = { id: 'user123', role: 'admin' };

  it('should sign access and refresh tokens', () => {
    const tokens = tokenManager.signTokens(payload);
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
  });

  it('should verify access token correctly', () => {
    const { accessToken } = tokenManager.signTokens(payload);
    const decoded = tokenManager.verifyAccess(accessToken);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.role).toBe(payload.role);
  });

  it('should verify refresh token correctly', () => {
    const { refreshToken } = tokenManager.signTokens(payload);
    const decoded = tokenManager.verifyRefresh(refreshToken);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.role).toBe(payload.role);
  });

  it('should throw error for invalid token', () => {
    expect(() => tokenManager.verifyAccess('invalid.token')).toThrow();
  });
});

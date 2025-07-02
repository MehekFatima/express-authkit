import { RedisStore } from '../src/session/redisStore';
import { MockRedisClient } from '../src/session/mockRedisClient';

describe('RedisStore (mock)', () => {
  const prefix = 'test:';
  const mockClient = new MockRedisClient();
  const store = new RedisStore('', prefix, mockClient);

  const sessionId = 'session123';
  const sessionData = { userId: 'user123', foo: 'bar' };

  it('sets and gets session data', async () => {
    await store.set(sessionId, sessionData);
    const data = await store.get(sessionId);
    expect(data).toEqual(sessionData);
  });

  it('destroys session data', async () => {
    await store.set(sessionId, sessionData);
    await store.destroy(sessionId);
    const data = await store.get(sessionId);
    expect(data).toBeNull();
  });
});

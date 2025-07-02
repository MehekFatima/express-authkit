import type { RedisLikeClient } from './redisStore';

export class MockRedisClient implements RedisLikeClient {
  private store = new Map<string, string>();

  async set(key: string, value: string) {
    this.store.set(key, value);
  }

  async get(key: string) {
    return this.store.get(key) || null;
  }

  async del(key: string) {
    this.store.delete(key);
  }

  async quit() {
    // no-op for mock
  }
}

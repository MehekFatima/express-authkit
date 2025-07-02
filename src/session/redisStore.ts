import { createClient, RedisClientType } from 'redis';

interface SessionData {
  [key: string]: any;
}

// Minimal interface covering only methods used by RedisStore
export interface RedisLikeClient {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
  quit(): Promise<void>;
}

export class RedisStore {
  private client: RedisLikeClient;
  private prefix: string;

  /**
   * 
   * @param redisUrl Redis connection URL (ignored if client provided)
   * @param prefix Key prefix in Redis
   * @param client Optional Redis client instance (for mocking/testing)
   */
  constructor(redisUrl: string, prefix = 'express-authkit:sess:', client?: RedisLikeClient) {
    if (client) {
      this.client = client;
    } else {
      const realClient: RedisClientType = createClient({ url: redisUrl });
      realClient.connect().catch(console.error);
      // Wrap RedisClientType to match RedisLikeClient interface
      this.client = {
        set: async (key: string, value: string) => { await realClient.set(key, value); },
        get: async (key: string) => realClient.get(key),
        del: async (key: string) => { await realClient.del(key); },
        quit: async () => { await realClient.quit(); }
      };
    }
    this.prefix = prefix;
  }

  private getKey(sessionId: string): string {
    return `${this.prefix}${sessionId}`;
  }

  async set(sessionId: string, data: SessionData): Promise<void> {
    await this.client.set(this.getKey(sessionId), JSON.stringify(data));
  }

  async get(sessionId: string): Promise<SessionData | null> {
    const json = await this.client.get(this.getKey(sessionId));
    return json ? JSON.parse(json) : null;
  }

  async destroy(sessionId: string): Promise<void> {
    await this.client.del(this.getKey(sessionId));
  }

  async disconnect(): Promise<void> {
    if (this.client.quit) {
      await this.client.quit();
    }
  }
}

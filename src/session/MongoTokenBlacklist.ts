import { MongoClient, Db, Collection } from 'mongodb';

export class MongoTokenBlacklist {
  private client: MongoClient;
  private db!: Db;
  private collection!: Collection;

  constructor(private mongoUri: string, private dbName = 'authkit', private collectionName = 'blacklist') {
    this.client = new MongoClient(mongoUri);
  }

  async init() {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    this.collection = this.db.collection(this.collectionName);
    await this.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  }

  async blacklistToken(token: string, expiresIn: number) {
    if (!this.collection) throw new Error('MongoTokenBlacklist not initialized');
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    await this.collection.insertOne({ token, expiresAt });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    if (!this.collection) throw new Error('MongoTokenBlacklist not initialized');
    const now = new Date();
    const doc = await this.collection.findOne({ token, expiresAt: { $gt: now } });
    return !!doc;
  }
}


import { MongoClient, Db, Collection } from 'mongodb';

export interface SessionData {
  userId: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
  sessionId: string;
}

export class MongoSessionStore {
  private collection!: Collection<SessionData>;

  constructor(mongoUri: string, dbName = 'authkit', collectionName = 'sessions') {
    const client = new MongoClient(mongoUri);
    client.connect().then(() => {
      const db = client.db(dbName);
      this.collection = db.collection<SessionData>(collectionName);
      this.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 
      console.log("connected to MongoDB session store");
    }).catch(err => {
      console.error("Failed to connect to MongoDB session store:", err);
      throw err;
    });
      
  }

  async saveSession(data: SessionData) {
    await this.collection.insertOne(data);
  }

  async findSession(sessionId: string): Promise<SessionData | null> {
    return this.collection.findOne({ sessionId });
  }

  async deleteSession(sessionId: string) {
    await this.collection.deleteOne({ sessionId });
  }

  async clearUserSessions(userId: string) {
    await this.collection.deleteMany({ userId });
  }
}

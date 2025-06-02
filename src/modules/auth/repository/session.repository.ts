import { db } from '../../../db';
import { sessions } from '../../../db/schema';

export class SessionRepository {
  async createSession({
    userId,
    token,
    expiresAt,
  }: {
    userId: string;
    token: string;
    expiresAt: Date;
  }) {
    await db.insert(sessions).values({
      userId,
      token,
      expiresAt,
    });
  }
}

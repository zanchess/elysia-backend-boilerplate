import { db } from '../../../db';
import { sessions } from '../../../db/schema';
import type { ISessionRepository } from './session.repository.interface';

export class SessionRepository implements ISessionRepository {
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

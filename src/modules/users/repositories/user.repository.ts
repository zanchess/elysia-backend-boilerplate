import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { User } from '../types/user.types';

export class UserRepository {
  async findById(id: number): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id)
    });
    return result || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    return result || null;
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        ...data,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return result[0];
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const result = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    
    return result[0] || null;
  }

  async delete(id: number): Promise<void> {
    await db
      .delete(users)
      .where(eq(users.id, id));
  }
} 
import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import type { User, RegisterDto } from '../../../models/user.model';

interface UpdateUserDto {
  name?: string;
  email?: string;
}

export class UserRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    return db.query.users.findFirst({
      where: eq(users.email, email)
    });
  }

  async findById(id: number): Promise<User | undefined> {
    return db.query.users.findFirst({
      where: eq(users.id, id)
    });
  }

  async create(userData: RegisterDto): Promise<User> {
    const [user] = await db.insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async update(id: number, userData: UpdateUserDto): Promise<User> {
    const [user] = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async delete(id: number) {
    await db.delete(users)
      .where(eq(users.id, id));
  }
} 
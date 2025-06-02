import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from '../../user/type/user.types';
import { RegisterDto } from '../type/auth.types';
import { InferSelectModel } from 'drizzle-orm';

type UserModel = InferSelectModel<typeof users>;

export class UserRepository {
  async findByEmail(email: string): Promise<UserModel | undefined> {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findById(id: number): Promise<UserModel | undefined> {
    return db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async create(userData: RegisterDto): Promise<UserModel> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async update(id: number, userData: UpdateUserDto): Promise<UserModel> {
    const [user] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return user;
  }

  async delete(id: number) {
    await db.delete(users).where(eq(users.id, id));
  }
}

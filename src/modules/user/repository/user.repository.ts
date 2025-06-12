import { db } from '../../../db';
import { users, userRoles, roles } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { InferSelectModel } from 'drizzle-orm';
import type { IUserRepository } from './user.repository.interface';
import { injectable } from 'tsyringe';

type UserModel = InferSelectModel<typeof users>;

export { UserModel };

@injectable()
export class UserRepository implements IUserRepository {
  async findById(id: number): Promise<UserModel | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return result;
  }

  async findByEmail(email: string): Promise<UserModel | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return undefined;

    const userRolesResult = await db
      .select({
        id: roles.id,
        name: roles.name,
        roleType: roles.roleType,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, user.id));

    return {
      ...user,
      roles: userRolesResult,
    };
  }

  async create(
    data: Omit<UserModel, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>
  ): Promise<UserModel> {
    const result = await db
      .insert(users)
      .values({
        ...data,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const [employeeRole] = await db
      .select({ id: roles.id, name: roles.name, roleType: roles.roleType })
      .from(roles)
      .where(eq(roles.name, 'Employee'));

    if (employeeRole) {
      await db.insert(userRoles).values({ userId: result[0].id, roleId: employeeRole.id });
    }

    return {
      ...result[0],
      ...(employeeRole && {
        roles: [{ id: employeeRole.id, name: employeeRole.name, roleType: employeeRole.roleType }],
      }),
    };
  }

  async update(id: number, data: Partial<UserModel>): Promise<UserModel> {
    const result = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (!result[0]) {
      throw new Error('User not found');
    }

    return result[0];
  }

  async delete(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}

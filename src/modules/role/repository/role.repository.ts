import { db } from '../../../db';
import { roles } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { CreateRoleDto, UpdateRoleDto } from '../type/role.types';
import type { IRoleRepository } from './role.repository.interface';

export class RoleRepository implements IRoleRepository {
  async create(data: CreateRoleDto) {
    const [role] = await db.insert(roles).values(data).returning();
    return role;
  }

  async findAll() {
    return db.select().from(roles);
  }

  async findById(id: string) {
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role;
  }

  async update(id: string, data: UpdateRoleDto) {
    const [role] = await db.update(roles).set(data).where(eq(roles.id, id)).returning();
    return role;
  }

  async delete(id: string) {
    const [role] = await db.delete(roles).where(eq(roles.id, id)).returning();
    return role;
  }
}
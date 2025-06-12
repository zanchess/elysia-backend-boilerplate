import { db } from '../../../db';
import { departments } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import type { IDepartamentRepository } from './departament.repository.interface';
import type { CreateDepartamentDto, UpdateDepartamentDto, DepartamentModel } from '../type/departament.types';
import { injectable } from 'tsyringe';

@injectable()
export class DepartamentRepository implements IDepartamentRepository {
  async create(data: CreateDepartamentDto): Promise<DepartamentModel> {
    const [departament] = await db.insert(departments).values(data).returning();
    return departament;
  }

  async findAll(): Promise<DepartamentModel[]> {
    return db.select().from(departments);
  }

  async findById(id: string): Promise<DepartamentModel | undefined> {
    const [departament] = await db.select().from(departments).where(eq(departments.id, id));
    return departament;
  }

  async update(id: string, data: UpdateDepartamentDto): Promise<DepartamentModel | undefined> {
    const [departament] = await db.update(departments).set(data).where(eq(departments.id, id)).returning();
    return departament;
  }

  async delete(id: string): Promise<DepartamentModel | undefined> {
    const [departament] = await db.delete(departments).where(eq(departments.id, id)).returning();
    return departament;
  }
} 
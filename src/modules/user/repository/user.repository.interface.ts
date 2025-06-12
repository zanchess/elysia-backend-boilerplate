import type { InferSelectModel } from 'drizzle-orm';
import type { users } from '../../../db/schema';

type UserModel = InferSelectModel<typeof users>;

export type IUserRepository = {
  findById(id: number): Promise<UserModel | undefined>;
  findByEmail(email: string): Promise<UserModel | undefined>;
  create(data: Omit<UserModel, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): Promise<UserModel>;
  update(id: number, data: Partial<UserModel>): Promise<UserModel | null>;
  delete(id: number): Promise<void>;
}; 
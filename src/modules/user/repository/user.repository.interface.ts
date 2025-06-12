import type { InferSelectModel } from 'drizzle-orm';
import type { users } from '../../../db/schema';

type UserModel = InferSelectModel<typeof users>;

export type IUserRepository = {
  findById(id: number): Promise<UserModel | null>;
  findByEmail(email: string): Promise<UserModel | null>;
  create(data: Omit<UserModel, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): Promise<UserModel>;
  update(id: number, data: Partial<UserModel>): Promise<UserModel | null>;
  delete(id: number): Promise<void>;
}; 
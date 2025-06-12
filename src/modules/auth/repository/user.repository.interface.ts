import type { RegisterDto } from '../type/auth.types';
import type { UpdateUserDto } from '../../user/type/user.types';
import type { InferSelectModel } from 'drizzle-orm';
import type { users } from '../../../db/schema';

type UserModel = InferSelectModel<typeof users>;

export type IUserRepository = {
  findByEmail(email: string): Promise<UserModel | undefined>;
  findById(id: number): Promise<UserModel | undefined>;
  create(userData: RegisterDto): Promise<UserModel>;
  update(id: number, userData: UpdateUserDto): Promise<UserModel>;
  delete(id: number): Promise<void>;
}; 
import type { UserResponse, UpdateUserDto } from '../type/user.types';

export type IUserService = {
  getProfile(userId: number): Promise<UserResponse>;
  updateUser(userId: number, userData: UpdateUserDto): Promise<UserResponse>;
  deleteUser(userId: number): Promise<void>;
  getUser(userId: number): Promise<UserResponse>;
} 
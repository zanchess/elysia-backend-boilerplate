import { UserRepository } from '../repositories/user.repository';
import { AUTH_SUCCESS } from '../../../constants/success.messages';
import { ApiResponse } from '../../../types/common.types';
import { User, UserResponse, UpdateUserDto } from '../types/user.types';
import { NotFoundError, InternalServerError } from 'elysia';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getProfile(userId: number): Promise<UserResponse> {
    try {
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        throw new NotFoundError('User not found');
      }
      
      return {
        id: user.id,
        email: user.email,
        name: user.name
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to get profile');
    }
  }

  async updateUser(userId: number, userData: Partial<UserResponse>): Promise<UserResponse> {
    try {
      const user = await this.userRepository.update(userId, userData);
      
      if (!user) {
        throw new NotFoundError('User not found');
      }
      
      return {
        id: user.id,
        email: user.email,
        name: user.name
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to update profile');
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        throw new NotFoundError('User not found');
      }

      await this.userRepository.delete(userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to delete user');
    }
  }
} 
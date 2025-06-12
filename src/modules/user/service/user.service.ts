import { ERROR_MESSAGES } from '../../../constant/error.messages';
import { UserResponse, UpdateUserDto } from '../type/user.types';
import { NotFoundError, ValidationError } from '../../../error/base.error';
import type { IUserService } from './user.service.interface';
import type { IUserRepository } from '../repository/user.repository.interface';

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getProfile(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async updateUser(userId: number, userData: UpdateUserDto): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const updatedUser = await this.userRepository.update(userId, userData);

    if (!updatedUser) {
      throw new ValidationError(ERROR_MESSAGES.UPDATE_FAILED);
    }

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    };
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    try {
      await this.userRepository.delete(userId);
    } catch (error) {
      throw new ValidationError(ERROR_MESSAGES.DELETE_FAILED);
    }
  }

  async getUser(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}

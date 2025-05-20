import { UserRepository } from '../repositories/user.repository';
import { ERROR_MESSAGES } from '../../../constants/error.messages';
import { UserResponse, UpdateUserDto } from '../types/user.types';
import { NotFoundError, ValidationError } from '../../../errors/base.error';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

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

import { UserRepository } from '../../users/repositories/user.repository';
import { AUTH_SUCCESS } from '../../../constants/success.messages';
import { AUTH_ERRORS } from '../../../constants/error.messages';
import { ApiResponse } from '../../../types/common.types';
import { User, UserResponse } from '../../users/types/user.types';
import { RegisterDto, LoginDto } from '../types/auth.types';
import { Elysia } from 'elysia';
import bcrypt from 'bcryptjs';
import { jwt } from '@elysiajs/jwt';

export class AuthService {
  private userRepository: UserRepository;
  private jwtInstance: ReturnType<typeof jwt>;

  constructor() {
    this.userRepository = new UserRepository();
    this.jwtInstance = jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'your-secret-key'
    });
  }

  async register(userData: RegisterDto): Promise<UserResponse> {
    try {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await this.userRepository.create({
        ...userData,
        password: hashedPassword
      });
      
      return {
        id: user.id,
        email: user.email,
        name: user.name
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to register user');
    }
  }

  async login(credentials: LoginDto): Promise<{ token: string; user: UserResponse }> {
    try {
      const user = await this.userRepository.findByEmail(credentials.email);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const isValidPassword = await bcrypt.compare(credentials.password, user.password);
      
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }
      
      const token = await this.jwtInstance.sign({ userId: user.id });
      
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to login');
    }
  }

  async getProfile(userId: number): Promise<ApiResponse<UserResponse>> {
    try {
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return {
          success: false,
          error: AUTH_ERRORS.USER_NOT_FOUND
        };
      }
      
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      return {
        success: false,
        error: AUTH_ERRORS.PROFILE_FETCH_FAILED
      };
    }
  }

  async deleteUser(userId: number): Promise<ApiResponse> {
    try {
      await this.userRepository.delete(userId);
      
      return {
        success: true,
        message: AUTH_SUCCESS.DELETED
      };
    } catch (error) {
      return {
        success: false,
        error: AUTH_ERRORS.DELETE_FAILED
      };
    }
  }
} 
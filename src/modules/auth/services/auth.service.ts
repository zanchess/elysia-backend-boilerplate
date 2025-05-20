import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { RegisterDto, LoginDto } from '../types/auth.types';
import { JwtService } from './jwt.service';
import { ERROR_MESSAGES } from '../../../constants/error.messages';
import { NotFoundError, AuthenticationError, ConflictError } from '../../../errors/base.error';

export class AuthService {
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
  }

  async register(data: RegisterDto) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email)
    });

    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.USER_EXISTS);
    }

    const [user] = await db.insert(users).values({
      email: data.email,
      password: data.password,
      name: data.name
    }).returning();

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_CREATION_FAILED);
    }

    return user;
  }

  async login(data: LoginDto) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email)
    });

    if (!user) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.password !== data.password) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = await this.jwtService.sign({ userId: user.id });

    return {
      token,
      user
    };
  }

  async getProfile(userId: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  async deleteUser(userId: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    await db.delete(users).where(eq(users.id, userId));

    return {
      success: true,
      message: 'User deleted successfully'
    };
  }
} 
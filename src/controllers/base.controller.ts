import { Elysia } from 'elysia';
import { ApiResponse } from '../types/api.types';
import { jwt } from '@elysiajs/jwt';

export abstract class BaseController {
  protected abstract prefix: string;

  protected success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message
    };
  }

  protected error(message: string): ApiResponse {
    return {
      success: false,
      error: message
    };
  }

  protected abstract routes(): Elysia;

  public getRoutes(): Elysia {
    return new Elysia({ prefix: this.prefix })
      .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET || 'your-secret-key'
      }))
      .use(this.routes()) as unknown as Elysia;
  }
} 
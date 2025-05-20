import { Elysia } from 'elysia';
import { ApiResponse } from '../types/api.types';
import { jwt } from '@elysiajs/jwt';
import { AppError } from '../errors/base.error';
import { timestamp } from 'drizzle-orm/gel-core';

export abstract class BaseController {
  protected abstract prefix: string;

  protected success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  protected error(message: string, code: string = 'INTERNAL_SERVER_ERROR'): ApiResponse {
    return {
      success: false,
      error: {
        message,
        code,
      },
    };
  }

  protected abstract routes(): Elysia;

  public getRoutes(): Elysia {
    return new Elysia({ prefix: this.prefix })
      .use(
        jwt({
          name: 'jwt',
          secret: process.env.JWT_SECRET || 'your-secret-key',
        })
      )
      .onError(({ error, set }) => {
        set.status = (error as AppError).statusCode;
        set.headers['content-type'] = 'application/json';
        return {
          success: false,
          error: {
            message: (error as AppError).message || 'Internal server error',
            code: (error as AppError).code,
          },
          timestamp: new Date().toISOString(),
        };
      })
      .use(this.routes()) as unknown as Elysia;
  }
}

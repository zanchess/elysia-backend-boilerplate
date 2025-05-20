import { Elysia } from 'elysia';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { BaseController } from '../../../controllers/base.controller';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../types/auth.types';
import {
  registerSchema,
  registerResponseSchema,
  errorResponseSchema,
  loginResponseSchema,
  loginSchema,
} from '../schema';

export class AuthController extends BaseController {
  protected prefix = '/auth';
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  protected routes() {
    return new Elysia()
      .use(authMiddleware)
      .post(
        '/register',
        async ({ body }) => {
          const user = await this.authService.register(body as RegisterDto);
          return { success: true, data: user };
        },
        {
          body: registerSchema,
          response: {
            200: registerResponseSchema,
            400: errorResponseSchema,
            409: errorResponseSchema,
          },
          detail: {
            tags: ['Authentication'],
            summary: 'Register a new user',
            description: 'Creates a new user account with the provided credentials',
            examples: [
              {
                request: {
                  body: {
                    email: 'user@example.com',
                    password: 'password123',
                    name: 'John Doe',
                  },
                },
              },
            ],
          },
        }
      )
      .post(
        '/login',
        async ({ body }) => {
          const result = await this.authService.login(body as LoginDto);
          return { success: true, data: result };
        },
        {
          body: loginSchema,
          response: {
            200: loginResponseSchema,
            401: errorResponseSchema,
          },
          detail: {
            tags: ['Authentication'],
            summary: 'Login user',
            description: 'Authenticates a user and returns a JWT token',
            examples: [
              {
                request: {
                  body: {
                    email: 'user@example.com',
                    password: 'password123',
                  },
                },
              },
            ],
          },
        }
      ) as unknown as Elysia;
  }
}

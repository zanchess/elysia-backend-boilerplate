import { Elysia } from 'elysia';
import { z } from 'zod';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { BaseController } from '../../../controllers/base.controller';
import { AuthService } from '../services/auth.service';
import { Context } from '../../../types/common.types';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export class AuthController extends BaseController {
  protected prefix = '/auth';
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  protected routes() {
    return (
      new Elysia()
        .use(authMiddleware)
        .post('/register', async ({ body }: Context) => {
          try {
            const userData = registerSchema.parse(body);
            return await this.authService.register(userData);
          } catch (error) {
            if (error instanceof z.ZodError) {
              return this.error('Validation error: ' + error.errors.map(e => e.message).join(', '));
            }
            return this.error('Registration failed');
          }
        }, {
          detail: {
            tags: ['auth'],
            summary: 'Register a new user',
            description: 'Creates a new user account with email, password, and name'
          }
        })
        .post('/login', async ({ body, jwt }: Context) => {
          try {
            const credentials = loginSchema.parse(body);
            const { token, user } = await this.authService.login(credentials);
            return this.success({ user, token });
          } catch (error) {
            if (error instanceof z.ZodError) {
              return this.error('Validation error: ' + error.errors.map(e => e.message).join(', '));
            }
            return this.error('Login failed');
          }
        }, {
          detail: {
            tags: ['auth'],
            summary: 'Login user',
            description: 'Authenticates user and returns JWT token'
          }
        })
    ) as unknown as Elysia;
  }
}
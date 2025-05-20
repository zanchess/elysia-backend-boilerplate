import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { BaseController } from '../../../controllers/base.controller';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../types/auth.types';

const registerSchema = t.Object({
  email: t.String({ format: 'email', description: 'User email address' }),
  password: t.String({ minLength: 6, description: 'User password (min 6 characters)' }),
  name: t.String({ minLength: 2, description: 'User full name' })
});

const loginSchema = t.Object({
  email: t.String({ format: 'email', description: 'User email address' }),
  password: t.String({ description: 'User password' })
});

const userResponseSchema = t.Object({
  id: t.Number(),
  email: t.String(),
  name: t.String()
});

const registerResponseSchema = t.Object({
  success: t.Boolean(),
  data: userResponseSchema,
  message: t.Optional(t.String())
});

const loginResponseSchema = t.Object({
  success: t.Boolean(),
  data: t.Object({
    token: t.String(),
    user: userResponseSchema
  }),
  message: t.Optional(t.String())
});

const errorResponseSchema = t.Object({
  success: t.Boolean(),
  error: t.Object({
    message: t.String(),
    code: t.String(),
    details: t.Optional(t.String())
  })
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
        // Register new user
        .post('/register',
          async ({ body }) => {
            const user = await this.authService.register(body as RegisterDto);
            return { success: true, data: user };
          },
          {
            body: registerSchema,
            response: {
              200: registerResponseSchema,
              400: errorResponseSchema,
              409: errorResponseSchema
            },
            detail: {
              tags: ['Authentication'],
              summary: 'Register a new user',
              description: 'Creates a new user account with the provided credentials',
              examples: [{
                request: {
                  body: {
                    email: 'user@example.com',
                    password: 'password123',
                    name: 'John Doe'
                  }
                },
                response: {
                  success: true,
                  data: {
                    id: 1,
                    email: 'user@example.com',
                    name: 'John Doe'
                  }
                }
              }]
            }
          }
        )
        // Login user
        .post('/login',
          async ({ body }) => {
            const result = await this.authService.login(body as LoginDto);
            return { success: true, data: result };
          },
          {
            body: loginSchema,
            response: {
              200: loginResponseSchema,
              401: errorResponseSchema
            },
            detail: {
              tags: ['Authentication'],
              summary: 'Login user',
              description: 'Authenticates a user and returns a JWT token',
              examples: [{
                request: {
                  body: {
                    email: 'user@example.com',
                    password: 'password123'
                  }
                },
                response: {
                  success: true,
                  data: {
                    token: 'eyJhbGciOiJIUzI1NiIs...',
                    user: {
                      id: 1,
                      email: 'user@example.com',
                      name: 'John Doe'
                    }
                  }
                }
              }]
            }
          }
        )
        // Get user profile
        .get('/profile',
          async ({ requireAuth, request }) => {
            try {
              const payload = await requireAuth(request);
              const profile = await this.authService.getProfile(payload.userId);
              return { success: true, data: profile };
            } catch (error) {
              throw error;
            }
          },
          {
            response: {
              200: registerResponseSchema,
              401: errorResponseSchema,
              404: errorResponseSchema
            },
            detail: {
              tags: ['Authentication'],
              summary: 'Get user profile',
              description: 'Retrieves the profile of the currently authenticated user',
              security: [{ bearerAuth: [] }]
            }
          }
        )
        // Delete user profile
        .delete('/profile',
          async ({ requireAuth, request }) => {
            const payload = await requireAuth(request);
            const result = await this.authService.deleteUser(payload.userId);
            return result;
          },
          {
            response: {
              200: t.Object({
                success: t.Boolean(),
                message: t.Optional(t.String())
              }),
              401: errorResponseSchema,
              404: errorResponseSchema
            },
            detail: {
              tags: ['Authentication'],
              summary: 'Delete user profile',
              description: 'Deletes the currently authenticated user account',
              security: [{ bearerAuth: [] }]
            }
          }
        )
    ) as unknown as Elysia;
  }
}
import { Elysia } from 'elysia';
import { z } from 'zod';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { BaseController } from '../../../controllers/base.controller';
import { UserService } from '../services/user.service';

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional()
});

interface JWTPayload {
  userId: number;
  [key: string]: any;
}

interface Context {
  body: unknown;
  jwt: {
    sign: (payload: JWTPayload) => Promise<string>;
    verify: (token: string) => Promise<JWTPayload | null>;
  };
  headers: Record<string, string | undefined>;
  requireAuth: () => Promise<JWTPayload>;
}

export class UserController extends BaseController {
  protected prefix = '/users';
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  protected routes() {
    return (
      new Elysia()
        .use(authMiddleware)
        .get('/', async ({ requireAuth }: Context) => {
          try {
            const payload = await requireAuth();
            return await this.userService.getProfile(payload.userId);
          } catch (error) {
            return this.error('Failed to get profile');
          }
        }, {
          detail: {
            tags: ['users'],
            summary: 'Get user profile',
            description: 'Returns the authenticated user profile'
          }
        })
        .put('/', async ({ body, requireAuth }: Context) => {
          try {
            const payload = await requireAuth();
            const userData = updateUserSchema.parse(body);
            return await this.userService.updateUser(payload.userId, userData);
          } catch (error) {
            if (error instanceof z.ZodError) {
              return this.error('Validation error: ' + error.errors.map(e => e.message).join(', '));
            }
            return this.error('Failed to update user');
          }
        }, {
          detail: {
            tags: ['users'],
            summary: 'Update user profile',
            description: 'Updates the authenticated user profile'
          }
        })
        .delete('/', async ({ requireAuth }: Context) => {
          try {
            const payload = await requireAuth();
            return await this.userService.deleteUser(payload.userId);
          } catch (error) {
            return this.error('Failed to delete user');
          }
        }, {
          detail: {
            tags: ['users'],
            summary: 'Delete user profile',
            description: 'Deletes the authenticated user account'
          }
        })
    ) as unknown as Elysia;
  }
} 
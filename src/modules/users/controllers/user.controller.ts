import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { BaseController } from '../../../controllers/base.controller';
import { UserService } from '../services/user.service';
import { UserResponse, UpdateUserDto } from '../types/user.types';
import { NotFoundError } from '../../../errors/base.error';

const updateUserSchema = t.Object({
  email: t.Optional(t.String({ format: 'email', description: 'User email address' })),
  name: t.Optional(t.String({ minLength: 2, description: 'User full name' }))
});

const userResponseSchema = t.Object({
  success: t.Boolean(),
  data: t.Object({
    id: t.Number(),
    email: t.String(),
    name: t.String()
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
        // Get current user profile
        .get('/me',
          async ({ requireAuth, request }) => {
            const payload = await requireAuth(request);
            const user = await this.userService.getProfile(payload.userId);
            return { success: true, data: user };
          },
          {
            response: {
              200: userResponseSchema,
              404: errorResponseSchema
            },
            detail: {
              tags: ['Users'],
              summary: 'Get current user profile',
              description: 'Retrieves the profile of the currently authenticated user',
              security: [{ bearerAuth: [] }]
            }
          }
        )
        // Update current user profile
        .put('/me',
          async ({ requireAuth, request, body }) => {
            const payload = await requireAuth(request);
            const user = await this.userService.updateUser(
              payload.userId,
              body as UpdateUserDto
            );
            return { success: true, data: user };
          },
          {
            body: updateUserSchema,
            response: {
              200: userResponseSchema,
              400: errorResponseSchema,
              404: errorResponseSchema
            },
            detail: {
              tags: ['Users'],
              summary: 'Update current user profile',
              description: 'Updates the profile of the currently authenticated user',
              security: [{ bearerAuth: [] }]
            }
          }
        )
        // Delete current user profile
        .delete('/me',
          async ({ requireAuth, request }) => {
            const payload = await requireAuth(request);
            await this.userService.deleteUser(payload.userId);
            return {
              success: true,
              message: 'User deleted successfully'
            };
          },
          {
            response: {
              200: t.Object({
                success: t.Boolean(),
                message: t.Optional(t.String())
              }),
              404: errorResponseSchema
            },
            detail: {
              tags: ['Users'],
              summary: 'Delete current user profile',
              description: 'Deletes the profile of the currently authenticated user',
              security: [{ bearerAuth: [] }]
            }
          }
        )
        // Get user by ID
        .get('/:id',
          async ({ requireAuth, request, params }) => {
            console.error('get user by id');
            await requireAuth(request); // Require authentication but don't use the ID
            const user = await this.userService.getUser(Number(params.id));
            return { success: true, data: user };
          },
          {
            params: t.Object({
              id: t.Number({ description: 'User ID' })
            }),
            response: {
              200: userResponseSchema,
              404: errorResponseSchema
            },
            detail: {
              tags: ['Users'],
              summary: 'Get user by ID',
              description: 'Retrieves a user profile by their ID',
              security: [{ bearerAuth: [] }],
              examples: [{
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
        // Update user by ID
        .put('/:id',
          async ({ requireAuth, request, params, body }) => {
            await requireAuth(request); // Require authentication but don't use the ID
            const user = await this.userService.updateUser(
              Number(params.id),
              body as UpdateUserDto
            );
            return { success: true, data: user };
          },
          {
            params: t.Object({
              id: t.Number({ description: 'User ID' })
            }),
            body: updateUserSchema,
            response: {
              200: userResponseSchema,
              400: errorResponseSchema,
              404: errorResponseSchema
            },
            detail: {
              tags: ['Users'],
              summary: 'Update user by ID',
              description: 'Updates a user profile with the provided data',
              security: [{ bearerAuth: [] }]
            }
          }
        )
    ) as unknown as Elysia;
  }
} 
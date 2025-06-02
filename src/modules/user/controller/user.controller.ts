import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { BaseController } from '../../../controller/base.controller';
import { UserService } from '../service/user.service';
import { userResponseSchema, updateUserSchema, errorResponseSchema } from '../schema';
import { UpdateUserDto } from '../type/user.types';

export class UserController extends BaseController {
  protected prefix = '/users';
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  protected routes() {
    return new Elysia()
      .use(authMiddleware)
      .get(
        '/me',
        async ({ requireAuth, request }) => {
          const payload = await requireAuth(request);
          const user = await this.userService.getProfile(payload.userId);
          return { success: true, data: user };
        },
        {
          response: {
            200: userResponseSchema,
            404: errorResponseSchema,
          },
          detail: {
            tags: ['Users'],
            summary: 'Get current user profile',
            description: 'Retrieves the profile of the currently authenticated user',
            security: [{ bearerAuth: [] }],
          },
        }
      )
      .put(
        '/me',
        async ({ requireAuth, request, body }) => {
          const payload = await requireAuth(request);
          const user = await this.userService.updateUser(payload.userId, body as UpdateUserDto);
          return { success: true, data: user };
        },
        {
          body: updateUserSchema,
          response: {
            200: userResponseSchema,
            400: errorResponseSchema,
            404: errorResponseSchema,
          },
          detail: {
            tags: ['Users'],
            summary: 'Update current user profile',
            description: 'Updates the profile of the currently authenticated user',
            security: [{ bearerAuth: [] }],
          },
        }
      )
      .delete(
        '/me',
        async ({ requireAuth, request }) => {
          const payload = await requireAuth(request);
          await this.userService.deleteUser(payload.userId);
          return {
            success: true,
            message: 'User deleted successfully',
          };
        },
        {
          response: {
            200: t.Object({
              success: t.Boolean(),
              message: t.Optional(t.String()),
            }),
            404: errorResponseSchema,
          },
          detail: {
            tags: ['Users'],
            summary: 'Delete current user profile',
            description: 'Deletes the profile of the currently authenticated user',
            security: [{ bearerAuth: [] }],
          },
        }
      )
      .get(
        '/:id',
        async ({ requireAuth, request, params }) => {
          await requireAuth(request); // Require authentication but don't use the ID
          const user = await this.userService.getUser(Number(params.id));
          return { success: true, data: user };
        },
        {
          params: t.Object({
            id: t.Number({ description: 'User ID' }),
          }),
          response: {
            200: userResponseSchema,
            404: errorResponseSchema,
          },
          detail: {
            tags: ['Users'],
            summary: 'Get user by ID',
            description: 'Retrieves a user profile by their ID',
            security: [{ bearerAuth: [] }],
          },
        }
      )
      .put(
        '/:id',
        async ({ requireAuth, request, params, body }) => {
          await requireAuth(request); // Require authentication but don't use the ID
          const user = await this.userService.updateUser(Number(params.id), body as UpdateUserDto);
          return { success: true, data: user };
        },
        {
          params: t.Object({
            id: t.Number({ description: 'User ID' }),
          }),
          body: updateUserSchema,
          response: {
            200: userResponseSchema,
            400: errorResponseSchema,
            404: errorResponseSchema,
          },
          detail: {
            tags: ['Users'],
            summary: 'Update user by ID',
            description: 'Updates a user profile with the provided data',
            security: [{ bearerAuth: [] }],
          },
        }
      ) as unknown as Elysia;
  }
}

import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { BaseController } from '../../../controller/base.controller';
import type { IUserService } from '../service/user.service.interface';
import { userResponseSchema, updateUserSchema, errorResponseSchema } from '../schema';
import { UpdateUserDto } from '../type/user.types';

export class UserController extends BaseController {
  protected prefix = '/users';
  private userService: IUserService;

  constructor(userService: IUserService) {
    super();
    this.userService = userService;
  }

  protected routes() {
    return new Elysia()
      .use(authMiddleware)
      .get(
        '/me',
        async ({ user }) => {
          const userData = await this.userService.getProfile(user.id);
          return { success: true, data: userData };
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
        async ({ user, body }) => {
          const updatedUser = await this.userService.updateUser(user.id, body as UpdateUserDto);
          return { success: true, data: updatedUser };
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
        async ({ user }) => {
          await this.userService.deleteUser(user.id);
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
        async ({ params }) => {
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
        async ({ params, body }) => {
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

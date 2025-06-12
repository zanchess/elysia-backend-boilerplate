import { Elysia, t } from 'elysia';
import { BaseController } from '../../../controller/base.controller';
import type { IRoleService } from '../service/role.service.interface';
import {
  createRoleSchema,
  updateRoleSchema,
  roleResponseSchema,
  rolesListResponseSchema,
  errorResponseSchema,
} from '../schema';
import type { CreateRoleDto, UpdateRoleDto } from '../type/role.types';
import { authMiddleware, adminGuard } from '../../../middleware/auth.middleware';
import { injectable, inject } from 'tsyringe';

@injectable()
export class RoleController extends BaseController {
  protected prefix = '/roles';
  private roleService: IRoleService;

  constructor(@inject('RoleService') roleService: IRoleService) {
    super();
    this.roleService = roleService;
  }

  protected routes() {
    return new Elysia().group(this.prefix, app =>
      app
        .use(authMiddleware)
        .use(adminGuard)
        .post(
          '/',
          async ({ body }) => {
            const role = await this.roleService.createRole(body as CreateRoleDto);
            return {
              success: true,
              data: {
                ...role,
                createdAt: role.createdAt.toISOString(),
                updatedAt: role.updatedAt.toISOString(),
              },
            };
          },
          {
            body: createRoleSchema,
            response: { 200: roleResponseSchema, 400: errorResponseSchema },
            detail: {
              tags: ['Roles'],
              summary: 'Create role',
              description: 'Creates a new role',
            },
          }
        )
        .get(
          '/',
          async () => {
            const roles = await this.roleService.getRoles();
            return {
              success: true,
              data: roles.map(role => ({
                ...role,
                createdAt: role.createdAt.toISOString(),
                updatedAt: role.updatedAt.toISOString(),
              })),
            };
          },
          {
            response: { 200: rolesListResponseSchema },
            detail: {
              tags: ['Roles'],
              summary: 'Get all roles',
              description: 'Returns all roles',
            },
          }
        )
        .get(
          '/:id',
          async ({ params }) => {
            const role = await this.roleService.getRoleById(params.id);
            if (!role) {
              return {
                success: false,
                error: { message: 'Role not found', code: 'NOT_FOUND' },
              };
            }
            return {
              success: true,
              data: {
                ...role,
                createdAt: role.createdAt.toISOString(),
                updatedAt: role.updatedAt.toISOString(),
              },
            };
          },
          {
            params: t.Object({ id: t.String({ description: 'Role ID' }) }),
            response: { 200: roleResponseSchema, 404: errorResponseSchema },
            detail: {
              tags: ['Roles'],
              summary: 'Get role by ID',
              description: 'Returns a role by its ID',
            },
          }
        )
        .put(
          '/:id',
          async ({ params, body }) => {
            const role = await this.roleService.updateRole(params.id, body as UpdateRoleDto);
            if (!role) {
              return {
                success: false,
                error: { message: 'Role not found', code: 'NOT_FOUND' },
              };
            }
            return {
              success: true,
              data: {
                ...role,
                createdAt: role.createdAt.toISOString(),
                updatedAt: role.updatedAt.toISOString(),
              },
            };
          },
          {
            params: t.Object({ id: t.String({ description: 'Role ID' }) }),
            body: updateRoleSchema,
            response: { 200: roleResponseSchema, 404: errorResponseSchema },
            detail: {
              tags: ['Roles'],
              summary: 'Update role',
              description: 'Updates a role by its ID',
            },
          }
        )
        .delete(
          '/:id',
          async ({ params }) => {
            const role = await this.roleService.deleteRole(params.id);
            if (!role) {
              return {
                success: false,
                error: { message: 'Role not found', code: 'NOT_FOUND' },
              };
            }
            return {
              success: true,
              data: {
                ...role,
                createdAt: role.createdAt.toISOString(),
                updatedAt: role.updatedAt.toISOString(),
              },
              message: 'Role deleted successfully',
            };
          },
          {
            params: t.Object({ id: t.String({ description: 'Role ID' }) }),
            response: { 200: roleResponseSchema, 404: errorResponseSchema },
            detail: {
              tags: ['Roles'],
              summary: 'Delete role',
              description: 'Deletes a role by its ID',
            },
          }
        )
    );
  }
}

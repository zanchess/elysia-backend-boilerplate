import { t } from 'elysia';

export const createRoleSchema = t.Object({
  name: t.String({
    description: 'Role name',
  }),
  roleType: t.Enum(
    {
      SUPER_ADMIN: 'SUPER_ADMIN',
      ADMIN: 'ADMIN',
      MODERATOR: 'MODERATOR',
      MANAGER: 'MANAGER',
      USER: 'USER',
      GUEST: 'GUEST',
    },
    { description: 'Role type' }
  ),
});

export const updateRoleSchema = t.Object({
  name: t.Optional(
    t.String({
      description: 'Role name',
    })
  ),
  roleType: t.Optional(
    t.Enum(
      {
        SUPER_ADMIN: 'SUPER_ADMIN',
        ADMIN: 'ADMIN',
        MODERATOR: 'MODERATOR',
        MANAGER: 'MANAGER',
        USER: 'USER',
        GUEST: 'GUEST',
      },
      { description: 'Role type' }
    )
  ),
});

export const roleResponseSchema = t.Object({
  success: t.Boolean(),
  data: t.Object({
    id: t.String(),
    name: t.String(),
    roleType: t.String(),
    createdAt: t.String(),
    updatedAt: t.String(),
  }),
  message: t.Optional(t.String()),
});

export const rolesListResponseSchema = t.Object({
  success: t.Boolean(),
  data: t.Array(
    t.Object({
      id: t.String(),
      name: t.String(),
      roleType: t.String(),
      createdAt: t.String(),
      updatedAt: t.String(),
    })
  ),
  message: t.Optional(t.String()),
});

export const errorResponseSchema = t.Object({
  success: t.Boolean(),
  error: t.Object({
    message: t.String(),
    code: t.String(),
    details: t.Optional(t.String()),
  }),
});

import { t } from 'elysia';

export const createDepartamentSchema = t.Object({
  name: t.String({ description: 'Department name' }),
});

export const updateDepartamentSchema = t.Object({
  name: t.Optional(t.String({ description: 'Department name' })),
});

export const departamentResponseSchema = t.Object({
  success: t.Boolean(),
  data: t.Object({
    id: t.String(),
    name: t.String(),
    createdAt: t.String(),
    updatedAt: t.String(),
  }),
  message: t.Optional(t.String()),
});

export const departamentsListResponseSchema = t.Object({
  success: t.Boolean(),
  data: t.Array(
    t.Object({
      id: t.String(),
      name: t.String(),
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
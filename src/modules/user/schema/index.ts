import { t } from 'elysia';

export const updateUserSchema = t.Object({
  email: t.Optional(t.String({ format: 'email', description: 'User email address' })),
  name: t.Optional(t.String({ minLength: 2, description: 'User full name' })),
});

export const userResponseSchema = t.Object({
  success: t.Boolean(),
  data: t.Object({
    id: t.Number(),
    email: t.String(),
    name: t.String(),
  }),
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

import { t } from 'elysia';

export const registerSchema = t.Object({
  email: t.String({ format: 'email', description: 'User email address' }),
  password: t.String({ minLength: 6, description: 'User password (min 6 characters)' }),
  name: t.String({ minLength: 2, description: 'User full name' }),
});

export const loginSchema = t.Object({
  email: t.String({ format: 'email', description: 'User email address' }),
  password: t.String({ description: 'User password' }),
});

export const userResponseSchema = t.Object({
  id: t.Number(),
  email: t.String(),
  name: t.String(),
});

export const registerResponseSchema = t.Object({
  success: t.Boolean(),
  data: userResponseSchema,
  message: t.Optional(t.String()),
});

export const loginResponseSchema = t.Object({
  success: t.Boolean(),
  data: t.Object({
    token: t.String(),
    user: userResponseSchema,
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

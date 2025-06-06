import type { Static } from 'elysia';
import { createRoleSchema, updateRoleSchema } from '../schema';

export type CreateRoleDto = Static<typeof createRoleSchema>;
export type UpdateRoleDto = Static<typeof updateRoleSchema>;

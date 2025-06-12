import type { Static } from 'elysia';
import { createDepartamentSchema, updateDepartamentSchema } from '../schema';
import type { InferSelectModel } from 'drizzle-orm';
import { departments } from '../../../db/schema';

export type CreateDepartamentDto = Static<typeof createDepartamentSchema>;
export type UpdateDepartamentDto = Static<typeof updateDepartamentSchema>;
export type DepartamentModel = InferSelectModel<typeof departments>; 
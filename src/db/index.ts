import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, sessions } from './schema';

const connectionString =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/elysia_db';

const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema: { users, sessions } });

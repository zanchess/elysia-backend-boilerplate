import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const runMigration = async () => {
  const connectionString = 'postgres://postgres:postgres@localhost:5432/elysia_db';
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  console.log('Running migrations...');
  
  await migrate(db, { migrationsFolder: 'drizzle' });
  
  console.log('Migrations completed!');
  
  await sql.end();
};

runMigration().catch((err) => {
  console.error('Migration failed!');
  console.error(err);
  process.exit(1);
}); 
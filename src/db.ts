import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'bagsbe',
  user: 'user',
  password: 'password',
});

export const db = drizzle(pool);

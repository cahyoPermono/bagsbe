import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/models/_schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/bagsbe',
  },
} satisfies Config;

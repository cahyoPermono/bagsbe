import type { Config } from 'drizzle-kit';

export default {
  schema: './src/models',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/your_db',
  },
} satisfies Config;

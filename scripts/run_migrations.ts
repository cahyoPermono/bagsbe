import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'bagsbe',
    user: 'user',
    password: 'password',
  });

  const client = await pool.connect();

  try {
    const migrationsDir = path.resolve(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      console.log(`Running migration: ${file}`);
      await client.query(sql);
    }

    console.log('Migrations completed successfully.');
  } catch (err) {
    console.error('Error running migrations:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();

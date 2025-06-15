import { exec } from 'child_process';

function runMigrations() {
  // Use the correct Drizzle Kit command to apply migrations
  const migrateCmd = 'npx drizzle-kit push';

  const migrateProcess = exec(migrateCmd);

  migrateProcess.stdout?.on('data', (data) => {
    console.log(data.toString());
  });

  migrateProcess.stderr?.on('data', (data) => {
    console.error(data.toString());
  });

  migrateProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Migrations completed successfully.');
    } else {
      console.error('Migration process exited with code ' + code);
      process.exit(code || 1);
    }
  });
}

runMigrations();

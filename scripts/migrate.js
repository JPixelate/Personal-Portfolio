import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: join(process.cwd(), '.env') });

const cliCommand = process.platform === 'win32' ? 'supabase.cmd' : 'supabase';
const migrationDir = join(process.cwd(), 'supabase', 'migrations');

function getProjectRef() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  if (!url) return null;

  try {
    return new URL(url).hostname.split('.')[0] || null;
  } catch {
    return null;
  }
}

function runCli(args) {
  if (process.platform === 'win32') {
    return execFileSync('cmd.exe', ['/c', cliCommand, ...args], { stdio: 'inherit' });
  }

  return execFileSync(cliCommand, args, { stdio: 'inherit' });
}

function main() {
  const projectRef = getProjectRef();
  const dbPassword = process.env.SUPABASE_DB_PASSWORD?.trim();
  const migrationFiles = readdirSync(migrationDir)
    .filter((file) => file.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => join(migrationDir, file));

  for (const migrationPath of migrationFiles) {
    if (!existsSync(migrationPath)) {
      console.error(`Migration file not found: ${migrationPath}`);
      process.exit(1);
    }
  }

  if (!projectRef) {
    console.error('Could not determine the Supabase project ref from SUPABASE_URL or VITE_SUPABASE_URL.');
    process.exit(1);
  }

  if (!dbPassword) {
    console.error('SUPABASE_DB_PASSWORD is missing from .env.');
    process.exit(1);
  }

  const dbUrl = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${projectRef}.supabase.co:5432/postgres`;

  try {
    runCli(['--version']);
    runCli(['db', 'push', '--db-url', dbUrl]);
  } catch (error) {
    console.error('');
    console.error('Migration push failed.');
    process.exit(error.status || 1);
  }
}

main();

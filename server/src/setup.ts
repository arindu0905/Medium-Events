// Shared start-up steps for every way of running the server (long-running process, serverless, build-time setup).
import { join } from 'node:path';
import type { Db } from './db/index.js';
import type { AppConfig } from './app.js';
import { migrate } from './db/migrate.js';
import { DEFAULT_ADMIN_EMAIL, defaultAdminPending, ensureDefaultAdmin } from './bootstrap.js';
import { seedEvents } from './seed.js';

// Applies migrations, loads MEDIUM's events on first run and creates the default admin on an empty database.
// root: the server folder (holds migrations/ and seed/)
export async function prepareDatabase(db: Db, root: string) {
  const applied = await migrate(db, join(root, 'migrations'));
  if (applied.length) console.log(`Applied migrations: ${applied.join(', ')}`);
  if ((await seedEvents(db, join(root, 'seed'))) === 'seeded') console.log("Loaded MEDIUM's event series and past editions");

  if ((await ensureDefaultAdmin(db, process.env.DEFAULT_ADMIN_PASSWORD?.trim())) === 'created') {
    console.log(`Created the default admin: ${DEFAULT_ADMIN_EMAIL}`);
  }
  if (await defaultAdminPending(db)) {
    console.warn(`WARNING: ${DEFAULT_ADMIN_EMAIL} still uses the default password. Sign in and change it.`);
  }
}

export function configFromEnv(): AppConfig {
  return {
    publicSiteOrigin: process.env.PUBLIC_SITE_ORIGIN?.trim() || undefined,
    deployHookUrl: process.env.SITE_DEPLOY_HOOK_URL?.trim() || undefined,
  };
}

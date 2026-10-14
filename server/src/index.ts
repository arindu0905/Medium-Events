// Starts the MEDIUM admin API: opens the database, applies migrations, creates the default admin
// on first run, and listens on PORT.
import 'dotenv/config';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb } from './db/index.js';
import { createApp } from './app.js';
import { configFromEnv, prepareDatabase } from './setup.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = process.env.DATABASE_URL?.trim() || undefined;
const dataDir = join(root, '.data', 'pg');
if (!url) mkdirSync(dataDir, { recursive: true });

const db = await openDb({ url, dataDir });
await prepareDatabase(db, root);

const port = Number(process.env.PORT ?? 3020);
// In production the server also serves the built admin app (npm --prefix admin run build)
const adminDist = join(root, '..', 'admin', 'dist');

createApp({
  db,
  adminDist: process.env.NODE_ENV === 'production' && existsSync(join(adminDist, 'index.html')) ? adminDist : undefined,
  config: configFromEnv(),
}).listen(port, () => {
  console.log(`MEDIUM admin API on http://localhost:${port} (${url ? 'Postgres via DATABASE_URL' : `local database in ${dataDir}`})`);
});

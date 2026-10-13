// Starts the MEDIUM admin API: opens the database, applies migrations, creates the default admin
// on first run, and listens on PORT.
import 'dotenv/config';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb } from './db/index.js';
import { migrate } from './db/migrate.js';
import { createApp } from './app.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = process.env.DATABASE_URL?.trim() || undefined;
const dataDir = join(root, '.data', 'pg');
if (!url) mkdirSync(dataDir, { recursive: true });

const db = await openDb({ url, dataDir });
const applied = await migrate(db, join(root, 'migrations'));
if (applied.length) console.log(`Applied migrations: ${applied.join(', ')}`);

const port = Number(process.env.PORT ?? 3020);
createApp({ db }).listen(port, () => {
  console.log(`MEDIUM admin API on http://localhost:${port} (${url ? 'Postgres via DATABASE_URL' : `local database in ${dataDir}`})`);
});

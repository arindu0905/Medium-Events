// Prepares the database without starting the server: migrations, MEDIUM's events, default admin.
// Runs during the Vercel build (npm run db:setup), so serverless instances never migrate on a cold start.
import 'dotenv/config';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb } from './db/index.js';
import { prepareDatabase } from './setup.js';

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error('DATABASE_URL is not set. Add the Supabase connection string to the project environment variables.');
  process.exit(1);
}

const db = await openDb({ url, poolMax: 1 });
await prepareDatabase(db, join(dirname(fileURLToPath(import.meta.url)), '..'));
await db.close();
console.log('Database ready');

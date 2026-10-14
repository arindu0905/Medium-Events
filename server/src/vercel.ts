// Serverless entry for Vercel (api/index.js re-exports it). The database is prepared at build time
// (npm run db:setup), so a cold start only opens a small connection pool and builds the app.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { openDb } from './db/index.js';
import { createApp } from './app.js';
import { configFromEnv } from './setup.js';

// Each instance has its own pool; a few connections are enough because an instance serves one request at a time
const POOL_MAX = 3;

let app: Promise<ReturnType<typeof createApp>> | undefined;

async function load() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error('DATABASE_URL is not set');
  return createApp({ db: await openDb({ url, poolMax: POOL_MAX }), config: configFromEnv() });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Retry on the next request if opening the database failed
  app ??= load().catch((e) => {
    app = undefined;
    throw e;
  });
  (await app)(req, res);
}

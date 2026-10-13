import express from 'express';
import type { Db } from './db/index.js';

export interface AppContext {
  db: Db;
  // Injectable clock so tests can move time (session expiry, lockout)
  now: () => Date;
}

export function createApp(opts: { db: Db; now?: () => Date }) {
  const ctx: AppContext = { db: opts.db, now: opts.now ?? (() => new Date()) };
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.locals.ctx = ctx;
  return app;
}

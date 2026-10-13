import express, { type NextFunction, type Request, type Response } from 'express';
import type { Db } from './db/index.js';
import { requireAuth } from './auth/middleware.js';
import { authRoutes, publicAuthRoutes } from './auth/routes.js';

export interface AppContext {
  db: Db;
  // Injectable clock so tests can move time (session expiry, lockout)
  now: () => Date;
}

export function createApp(opts: { db: Db; now?: () => Date }) {
  const ctx: AppContext = { db: opts.db, now: opts.now ?? (() => new Date()) };
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '1mb' }));

  // Public routes (no sign-in)
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });
  app.use('/api/auth', publicAuthRoutes(ctx));

  // Everything else under /api needs a signed-in, active user
  app.use('/api', requireAuth(ctx));
  app.use('/api/auth', authRoutes(ctx));

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found.' });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Try again.' });
  });

  return app;
}

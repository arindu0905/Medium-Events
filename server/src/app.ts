import express, { type NextFunction, type Request, type Response } from 'express';
import type { Db } from './db/index.js';
import { requireAuth } from './auth/middleware.js';
import { authRoutes, publicAuthRoutes } from './auth/routes.js';
import { staffRoutes } from './staff/routes.js';
import { activityRoutes } from './activity/routes.js';
import { fileRoutes } from './files/routes.js';
import { eventRoutes } from './events/routes.js';
import { publishRoutes } from './publish/routes.js';
import { publicRoutes } from './public/routes.js';
import { HttpError } from './http.js';

export interface AppContext {
  db: Db;
  // Injectable clock so tests can move time (session expiry, lockout)
  now: () => Date;
  // Injectable for tests (deploy hook)
  fetch: typeof fetch;
  config: AppConfig;
}

export interface AppConfig {
  // Public website address allowed to call /api/public from the browser
  publicSiteOrigin?: string;
  // Called (POST) after publishing so the host rebuilds the website
  deployHookUrl?: string;
}

export function createApp(opts: { db: Db; now?: () => Date; fetch?: typeof fetch; config?: AppConfig }) {
  const ctx: AppContext = { db: opts.db, now: opts.now ?? (() => new Date()), fetch: opts.fetch ?? fetch, config: opts.config ?? {} };
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '1mb' }));

  // Public routes (no sign-in)
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });
  app.use('/api/auth', publicAuthRoutes(ctx));
  app.use('/api/public', publicRoutes(ctx));

  // Everything else under /api needs a signed-in, active user
  app.use('/api', requireAuth(ctx));
  app.use('/api/auth', authRoutes(ctx));
  app.use('/api/staff', staffRoutes(ctx));
  app.use('/api/activity', activityRoutes(ctx));
  app.use('/api/files', fileRoutes(ctx));
  const events = eventRoutes(ctx);
  app.use('/api/series', events.series);
  app.use('/api/editions', events.editions);
  app.use('/api/partners', events.partners);
  app.use('/api/publish', publishRoutes(ctx));

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found.' });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) return res.status(err.status).json(err.fields ? { error: err.message, fields: err.fields } : { error: err.message });
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Try again.' });
  });

  return app;
}

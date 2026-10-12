// Loads supabase/.env.local (git-ignored) for setup scripts and database tests.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

export function loadSupabaseEnv(required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
  const file = resolve('supabase/.env.local');
  if (!existsSync(file)) throw new Error('Missing supabase/.env.local — copy supabase/.env.example and fill it in.');
  const env = {};
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z_]+)\s*=\s*"?(.*?)"?\s*$/);
    if (match) env[match[1]] = match[2];
  }
  const missing = required.filter((key) => !env[key]);
  if (missing.length) throw new Error(`Fill in ${missing.join(', ')} in supabase/.env.local.`);
  return env;
}

export function serviceClient(env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

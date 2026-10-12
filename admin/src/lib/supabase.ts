import { createClient } from '@supabase/supabase-js';

// Demo mode: local development only (`npm run dev` with VITE_DEMO_MODE=true). Production builds
// replace import.meta.env.DEV with false, so the demo client and its default logins are never bundled.
export const DEMO_MODE = import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE === 'true';

async function createSupabase() {
  if (DEMO_MODE) {
    const { demoClient } = await import('../demo/demoClient');
    return demoClient as unknown as ReturnType<typeof createClient>;
  }

  // Public (anon) key only. Every table is protected by row-level security in the database;
  // the service_role key must never be used in this app.
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in admin/.env (see admin/.env.example).');
  }
  return createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

export const supabase = await createSupabase();

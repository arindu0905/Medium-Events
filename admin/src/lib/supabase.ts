import { createClient } from '@supabase/supabase-js';

// Public (anon) key only. Every table is protected by row-level security in the database;
// the service_role key must never be used in this app.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in admin/.env (see admin/.env.example).');
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});

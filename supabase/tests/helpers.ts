import { readFileSync } from 'node:fs';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
// @ts-expect-error plain JS helper shared with the setup scripts
import { loadSupabaseEnv, serviceClient as makeServiceClient } from '../../scripts/supabase-env.mjs';
// @ts-expect-error plain JS seed script
import { seedTestUsers } from '../seed/seed-test-users.mjs';

export type TestRole = 'admin' | 'sales' | 'events' | 'finance' | 'inactive';

export const env = loadSupabaseEnv(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'DEV_PROJECT_REF', 'TEST_USER_PASSWORD']) as Record<string, string>;
// The public key the admin app uses; tests sign in exactly as the app does
const anonKey = readFileSync('admin/.env', 'utf8').match(/VITE_SUPABASE_ANON_KEY="?([^"\n]+)/)![1];

export const service = (): SupabaseClient => makeServiceClient(env);
export const seed = (): Promise<Record<TestRole, string>> => seedTestUsers();

export async function signInWith(email: string, password: string): Promise<SupabaseClient> {
  const client = createClient(env.SUPABASE_URL, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`Sign-in failed for ${email}: ${error.message}`);
  return client;
}

export const signInAs = (role: TestRole) => signInWith(`test-${role}@medium.test`, env.TEST_USER_PASSWORD);

export const functionUrl = (name: string) => `${env.SUPABASE_URL}/functions/v1/${name}`;

// Calls an Edge Function as the signed-in user and returns status + JSON body
export async function callFunction(client: SupabaseClient, name: string, body: unknown) {
  const { data } = await client.auth.getSession();
  const res = await fetch(functionUrl(name), {
    method: 'POST',
    headers: { Authorization: `Bearer ${data.session!.access_token}`, apikey: anonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: (await res.json()) as { ok: boolean; error?: string } };
}

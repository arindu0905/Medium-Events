// Development-only demo backend: an in-memory stand-in for Supabase so the admin app can be
// explored before the real project is set up. Loaded only when import.meta.env.DEV is true and
// VITE_DEMO_MODE=true (see lib/supabase.ts); production builds never include this file.
// Mirrors the database rules from the spec: no self role/active changes, never zero active admins,
// every change logged, non-admins see only their own activity.
import { createFakeSupabase, makeProfile, type QueryCall } from '../test/fakeSupabase';
import { validateInvite } from '../../../supabase/functions/invite-staff/validate.ts';
import type { ActivityRow, Profile } from '../lib/types';

export const DEMO_PASSWORD = 'medium-demo';
export const DEMO_ACCOUNTS = [
  { email: 'admin@demo.medium', role: 'Admin' },
  { email: 'sales@demo.medium', role: 'Sales' },
  { email: 'events@demo.medium', role: 'Events' },
  { email: 'finance@demo.medium', role: 'Finance' },
];

const profiles: Profile[] = [
  makeProfile({ id: 'demo-admin', full_name: 'Demo Admin', email: 'admin@demo.medium', role: 'admin' }),
  makeProfile({ id: 'demo-sales', full_name: 'Sara Sales', email: 'sales@demo.medium', role: 'sales' }),
  makeProfile({ id: 'demo-events', full_name: 'Eman Events', email: 'events@demo.medium', role: 'events' }),
  makeProfile({ id: 'demo-finance', full_name: 'Faisal Finance', email: 'finance@demo.medium', role: 'finance' }),
  makeProfile({ id: 'demo-former', full_name: 'Former Staff', email: 'former@demo.medium', role: 'sales', active: false }),
];

// Keep the demo sign-in across page reloads (demo data itself still resets)
const SESSION_KEY = 'medium-demo-session';
const readSession = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null');
  } catch {
    return null;
  }
};

const { client, state } = createFakeSupabase({ profiles, password: DEMO_PASSWORD, session: readSession() });

client.auth.onAuthStateChange((_event, session) => {
  try {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage unavailable (private mode): demo still works, just without surviving reloads
  }
});

const activity: ActivityRow[] = [
  { id: 2, at: '2026-10-10T05:15:00Z', actor_id: 'demo-admin', table_name: 'profiles', record_id: 'demo-former', action: 'update', changes: { active: { old: true, new: false } } },
  { id: 1, at: '2026-10-01T04:00:00Z', actor_id: null, table_name: 'profiles', record_id: 'demo-admin', action: 'insert', changes: {} },
];
let nextActivityId = 3;
let nextProfileId = 1;

const me = () => state.session?.user.id ?? null;
const log = (record_id: string, action: ActivityRow['action'], changes: Record<string, unknown>) =>
  activity.unshift({ id: nextActivityId++, at: new Date().toISOString(), actor_id: me(), table_name: 'profiles', record_id, action, changes });
const arg = (calls: QueryCall[], method: string, column?: string) =>
  calls.filter((c) => c.method === method && (column === undefined || c.args[0] === column)).map((c) => c.args);

const selectProfiles = state.handlers.profiles;
state.handlers.profiles = (calls) => {
  const update = calls.find((c) => c.method === 'update');
  if (!update) return selectProfiles(calls);

  const id = arg(calls, 'eq', 'id')[0]?.[1];
  const target = state.profiles.find((p) => p.id === id);
  const patch = update.args[0] as Partial<Profile>;
  const actor = state.profiles.find((p) => p.id === me());
  if (!target || !actor?.active || actor.role !== 'admin') return { data: null, error: { message: 'permission denied' } };
  if (target.id === actor.id && (patch.role !== undefined || patch.active !== undefined)) {
    return { data: null, error: { message: 'cannot change own role or active' } };
  }
  const losesAdmin = target.role === 'admin' && target.active && (patch.role !== undefined ? patch.role !== 'admin' : patch.active === false);
  const otherAdmins = state.profiles.filter((p) => p.id !== target.id && p.role === 'admin' && p.active).length;
  if (losesAdmin && otherAdmins === 0) return { data: null, error: { message: 'last active admin' } };

  const changes: Record<string, { old: unknown; new: unknown }> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (target[key as keyof Profile] !== value) changes[key] = { old: target[key as keyof Profile], new: value };
  }
  Object.assign(target, patch);
  if (Object.keys(changes).length) log(target.id, 'update', changes);
  return { data: null, error: null };
};

state.handlers.activity_log = (calls) => {
  const actor = state.profiles.find((p) => p.id === me());
  let rows = actor?.role === 'admin' ? activity : activity.filter((r) => r.actor_id === actor?.id);
  for (const [column, value] of arg(calls, 'eq')) rows = rows.filter((r) => r[column as keyof ActivityRow] === value);
  for (const [, from] of arg(calls, 'gte')) rows = rows.filter((r) => new Date(r.at) >= new Date(from as string));
  for (const [, to] of arg(calls, 'lte')) rows = rows.filter((r) => new Date(r.at) <= new Date(to as string));
  const [start, end] = (arg(calls, 'range')[0] ?? [0, 49]) as [number, number];
  return { data: rows.slice(start, end + 1), error: null, count: rows.length };
};

client.functions.invoke = async (_name: string, options: { body: unknown }) => {
  const actor = state.profiles.find((p) => p.id === me());
  if (!actor?.active || actor.role !== 'admin') {
    return { data: null, error: { context: { json: async () => ({ ok: false, error: 'Only active admins can invite staff.' }) } } };
  }
  const checked = validateInvite(options.body);
  if (!checked.ok) return { data: null, error: { context: { json: async () => checked } } };
  if (state.profiles.some((p) => p.email === checked.value.email)) {
    return { data: null, error: { context: { json: async () => ({ ok: false, error: 'That email already has an account.' }) } } };
  }
  const profile = makeProfile({ id: `demo-new-${nextProfileId++}`, ...checked.value, created_at: new Date().toISOString() });
  state.profiles.push(profile);
  log(profile.id, 'insert', {});
  return { data: { ok: true }, error: null };
};

export const demoClient = client;

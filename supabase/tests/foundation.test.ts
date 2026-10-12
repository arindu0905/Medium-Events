import { beforeAll, describe, expect, it } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { seed, service, signInAs, type TestRole } from './helpers';

let ids: Record<TestRole, string>;
const as: Partial<Record<TestRole, SupabaseClient>> = {};

beforeAll(async () => {
  ids = await seed();
  for (const role of ['admin', 'sales', 'events', 'finance', 'inactive'] as TestRole[]) as[role] = await signInAs(role);
}, 60_000);

describe('profiles access', () => {
  it.each(['admin', 'sales', 'events', 'finance'] as TestRole[])('%s can read staff profiles', async (role) => {
    const { data, error } = await as[role]!.from('profiles').select('id');
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThanOrEqual(5);
  });

  it('a deactivated user reads nothing', async () => {
    const { data } = await as.inactive!.from('profiles').select('id');
    expect(data).toEqual([]);
  });

  it('only admins can change someone else', async () => {
    const byAdmin = await as.admin!.from('profiles').update({ full_name: 'Test Events' }).eq('id', ids.events).select();
    expect(byAdmin.error).toBeNull();
    expect(byAdmin.data).toHaveLength(1);

    const bySales = await as.sales!.from('profiles').update({ role: 'admin' }).eq('id', ids.events).select();
    expect(bySales.data ?? []).toHaveLength(0);
  });

  it("nobody changes their own role or active status", async () => {
    const { error } = await as.admin!.from('profiles').update({ role: 'sales' }).eq('id', ids.admin);
    expect(error?.message).toMatch(/own role/);
  });

  it('never leaves zero active admins', async () => {
    const db = service();
    const before = await db.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin').eq('active', true);
    const { error } = await db.from('profiles').update({ active: false }).eq('role', 'admin').eq('active', true);
    expect(error?.message).toMatch(/last active admin/);
    const after = await db.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin').eq('active', true);
    expect(after.count).toBe(before.count);
  });

  it('nobody can create profiles from the app', async () => {
    const { error } = await as.admin!.from('profiles').insert({ id: ids.sales, email: 'x@medium.test', full_name: 'X', role: 'sales' });
    expect(error).not.toBeNull();
  });

  it('staff cannot clear their password flag by editing the table', async () => {
    const { error } = await as.admin!.from('profiles').update({ must_change_password: false }).eq('id', ids.events);
    expect(error).not.toBeNull();
  });
});

describe('password flag', () => {
  it('clear_password_flag clears only the caller', async () => {
    const db = service();
    await db.from('profiles').update({ must_change_password: true }).in('id', [ids.sales, ids.events]);
    const { error } = await as.sales!.rpc('clear_password_flag');
    expect(error).toBeNull();
    const { data } = await db.from('profiles').select('id, must_change_password').in('id', [ids.sales, ids.events]);
    const flags = Object.fromEntries(data!.map((r) => [r.id, r.must_change_password]));
    expect(flags[ids.sales]).toBe(false);
    expect(flags[ids.events]).toBe(true);
    await db.from('profiles').update({ must_change_password: false }).eq('id', ids.events);
  });
});

describe('activity log', () => {
  it('records who changed which columns, and skips updates that change nothing', async () => {
    const stamp = `Test Events ${Date.now()}`;
    await as.admin!.from('profiles').update({ full_name: stamp }).eq('id', ids.events);
    const { data: rows } = await as.admin!.from('activity_log').select('*').eq('record_id', ids.events).order('id', { ascending: false }).limit(1);
    expect(rows![0]).toMatchObject({ actor_id: ids.admin, table_name: 'profiles', action: 'update' });
    expect((rows![0].changes as Record<string, { new: string }>).full_name.new).toBe(stamp);

    const before = await as.admin!.from('activity_log').select('id', { count: 'exact', head: true });
    await as.admin!.from('profiles').update({ full_name: stamp }).eq('id', ids.events);
    const after = await as.admin!.from('activity_log').select('id', { count: 'exact', head: true });
    expect(after.count).toBe(before.count);
    await as.admin!.from('profiles').update({ full_name: 'Test Events' }).eq('id', ids.events);
  });

  it('shows non-admins only their own changes', async () => {
    const { data } = await as.finance!.from('activity_log').select('actor_id');
    expect(data!.every((row) => row.actor_id === ids.finance)).toBe(true);
  });

  it('cannot be edited or deleted by anyone in the app', async () => {
    const edit = await as.admin!.from('activity_log').update({ action: 'delete' }).gt('id', 0).select();
    expect(edit.error !== null || (edit.data ?? []).length === 0).toBe(true);
    const remove = await as.admin!.from('activity_log').delete().gt('id', 0).select();
    expect(remove.error !== null || (remove.data ?? []).length === 0).toBe(true);
  });
});

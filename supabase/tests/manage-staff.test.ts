import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { callFunction, env, seed, service, signInAs, signInWith, type TestRole } from './helpers';

let ids: Record<TestRole, string>;
let admin: SupabaseClient;
const NEW_EMAIL = `new-${Date.now()}@medium.test`;
const TEMP = 'Temporary-123';

async function deleteAuthUserByEmail(email: string) {
  const db = service();
  const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
  const user = data.users.find((u) => u.email === email);
  if (user) await db.auth.admin.deleteUser(user.id);
}

beforeAll(async () => {
  ids = await seed();
  admin = await signInAs('admin');
}, 60_000);

afterAll(async () => {
  await deleteAuthUserByEmail(NEW_EMAIL);
  await deleteAuthUserByEmail('orphan@medium.test');
  await seed(); // restore test users' passwords and flags
}, 60_000);

describe('manage-staff', () => {
  it('refuses non-admins and deactivated admins', async () => {
    for (const role of ['sales', 'inactive'] as TestRole[]) {
      const res = await callFunction(await signInAs(role), 'manage-staff', { action: 'create', email: 'x@medium.test', full_name: 'X', role: 'sales', temp_password: TEMP });
      expect(res.status).toBe(403);
    }
  });

  it('rejects bad input', async () => {
    const res = await callFunction(admin, 'manage-staff', { action: 'create', email: 'nope', full_name: 'X', role: 'sales', temp_password: TEMP });
    expect(res).toEqual({ status: 400, body: { ok: false, error: 'Enter a valid email address.' } });
  });

  it('creates an account that must change its password, logged against the admin', async () => {
    const res = await callFunction(admin, 'manage-staff', { action: 'create', email: NEW_EMAIL, full_name: 'New Person', role: 'events', temp_password: TEMP });
    expect(res).toEqual({ status: 200, body: { ok: true } });

    const db = service();
    const { data: profile } = await db.from('profiles').select('*').eq('email', NEW_EMAIL).single();
    expect(profile).toMatchObject({ role: 'events', active: true, must_change_password: true });
    const { data: log } = await db.from('activity_log').select('actor_id').eq('record_id', profile.id).eq('action', 'insert').single();
    expect(log!.actor_id).toBe(ids.admin);

    await expect(signInWith(NEW_EMAIL, TEMP)).resolves.toBeTruthy();
  });

  it('refuses an email that already has an account', async () => {
    const res = await callFunction(admin, 'manage-staff', { action: 'create', email: 'test-sales@medium.test', full_name: 'Again', role: 'sales', temp_password: TEMP });
    expect(res).toEqual({ status: 409, body: { ok: false, error: 'That email already has an account.' } });
  });

  it('explains a sign-in left over without a profile', async () => {
    await service().auth.admin.createUser({ email: 'orphan@medium.test', password: TEMP, email_confirm: true });
    const res = await callFunction(admin, 'manage-staff', { action: 'create', email: 'orphan@medium.test', full_name: 'Orphan', role: 'sales', temp_password: TEMP });
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already exists for this email without a staff profile/);
  });

  it("resets someone's password and makes them choose a new one", async () => {
    const res = await callFunction(admin, 'manage-staff', { action: 'reset_password', user_id: ids.events, temp_password: 'Temporary-456' });
    expect(res).toEqual({ status: 200, body: { ok: true } });
    await expect(signInWith('test-events@medium.test', 'Temporary-456')).resolves.toBeTruthy();
    await expect(signInWith('test-events@medium.test', env.TEST_USER_PASSWORD)).rejects.toThrow();
    const { data } = await service().from('profiles').select('must_change_password').eq('id', ids.events).single();
    expect(data!.must_change_password).toBe(true);
  });

  it("won't reset the caller's own password", async () => {
    const res = await callFunction(admin, 'manage-staff', { action: 'reset_password', user_id: ids.admin, temp_password: 'Temporary-789' });
    expect(res.status).toBe(400);
  });
});

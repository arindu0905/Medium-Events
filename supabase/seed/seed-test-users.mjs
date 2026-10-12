// Dev only: creates one test user per role (plus an inactive admin) for the database tests.
//   node supabase/seed/seed-test-users.mjs
// Refuses to run unless SUPABASE_URL points at DEV_PROJECT_REF. Safe to run more than once.
import { loadSupabaseEnv, serviceClient } from '../../scripts/supabase-env.mjs';

export const TEST_USERS = [
  { email: 'test-admin@medium.test', full_name: 'Test Admin', role: 'admin', active: true },
  { email: 'test-sales@medium.test', full_name: 'Test Sales', role: 'sales', active: true },
  { email: 'test-events@medium.test', full_name: 'Test Events', role: 'events', active: true },
  { email: 'test-finance@medium.test', full_name: 'Test Finance', role: 'finance', active: true },
  { email: 'test-inactive@medium.test', full_name: 'Test Inactive', role: 'admin', active: false },
];

export async function seedTestUsers() {
  const env = loadSupabaseEnv(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'DEV_PROJECT_REF', 'TEST_USER_PASSWORD']);
  if (!env.SUPABASE_URL.includes(env.DEV_PROJECT_REF)) {
    throw new Error('SUPABASE_URL is not the dev project (DEV_PROJECT_REF). Refusing to seed test users.');
  }
  const db = serviceClient(env);
  const { data: list } = await db.auth.admin.listUsers({ perPage: 1000 });
  const ids = {};

  for (const user of TEST_USERS) {
    let id = list.users.find((u) => u.email === user.email)?.id;
    if (id) {
      // Reset to a known state so tests always start the same way
      await db.auth.admin.updateUserById(id, { password: env.TEST_USER_PASSWORD });
    } else {
      const { data, error } = await db.auth.admin.createUser({ email: user.email, password: env.TEST_USER_PASSWORD, email_confirm: true });
      if (error) throw new Error(`${user.email}: ${error.message}`);
      id = data.user.id;
    }
    const { error } = await db
      .from('profiles')
      .upsert({ id, email: user.email, full_name: user.full_name, role: user.role, active: user.active, must_change_password: false });
    if (error) throw new Error(`${user.email} profile: ${error.message}`);
    ids[user.role === 'admin' && !user.active ? 'inactive' : user.role] = id;
  }
  return ids;
}

if (process.argv[1]?.endsWith('seed-test-users.mjs')) {
  seedTestUsers().then(
    (ids) => console.log(`Test users ready: ${Object.keys(ids).join(', ')}.`),
    (e) => {
      console.error(e.message);
      process.exit(1);
    },
  );
}

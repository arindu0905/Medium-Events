// One-off setup: creates the default MEDIUM admin account.
//   node scripts/create-default-admin.mjs [--email admin@medium.mv] [--name "MEDIUM Admin"]
// The password comes from DEFAULT_ADMIN_PASSWORD in supabase/.env.local (never from code).
// The admin must choose their own password on first sign-in. Refuses to run if an active admin exists.
import { loadSupabaseEnv, serviceClient } from './supabase-env.mjs';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const env = loadSupabaseEnv(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'DEFAULT_ADMIN_PASSWORD']);
const email = arg('email', 'admin@medium.mv').trim().toLowerCase();
const fullName = arg('name', 'MEDIUM Admin');

if (env.DEFAULT_ADMIN_PASSWORD.length < 10) {
  console.error('DEFAULT_ADMIN_PASSWORD needs at least 10 characters.');
  process.exit(1);
}

const db = serviceClient(env);

const { count, error: countError } = await db
  .from('profiles')
  .select('id', { count: 'exact', head: true })
  .eq('role', 'admin')
  .eq('active', true);
if (countError) {
  console.error(`Couldn't read profiles (has the database been set up with "supabase db push"?): ${countError.message}`);
  process.exit(1);
}
if (count > 0) {
  console.error('An active admin already exists. Add more staff from the admin app instead.');
  process.exit(1);
}

const { data, error } = await db.auth.admin.createUser({
  email,
  password: env.DEFAULT_ADMIN_PASSWORD,
  email_confirm: true,
});
if (error) {
  console.error(`Couldn't create the sign-in for ${email}: ${error.message}`);
  process.exit(1);
}

const { error: profileError } = await db
  .from('profiles')
  .insert({ id: data.user.id, email, full_name: fullName, role: 'admin', must_change_password: true });
if (profileError) {
  await db.auth.admin.deleteUser(data.user.id);
  console.error(`Couldn't create the admin profile: ${profileError.message}`);
  process.exit(1);
}

console.log(`Default admin created: ${email}. Sign in with DEFAULT_ADMIN_PASSWORD; you'll be asked to choose a new password.`);

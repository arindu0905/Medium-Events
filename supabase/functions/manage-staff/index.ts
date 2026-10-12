// Edge Function: create staff accounts and reset their passwords. Active admins only.
// Holds the service key (provided by Supabase as SUPABASE_SERVICE_ROLE_KEY); sends no emails.
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { validateCreateStaff, validateResetPassword } from './validate.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Invalid request.' });

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Who is calling, and are they an active admin?
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  const { data: userData } = token ? await admin.auth.getUser(token) : { data: { user: null } };
  const caller = userData.user;
  if (!caller) return json(401, { ok: false, error: 'Sign in again.' });
  const { data: callerProfile } = await admin.from('profiles').select('role, active').eq('id', caller.id).maybeSingle();
  if (!callerProfile?.active || callerProfile.role !== 'admin') {
    return json(403, { ok: false, error: 'Only active admins can manage staff.' });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, error: 'Invalid request.' });
  }

  // The activity-log trigger can't see who called (service role has no user), so stamp the actor afterwards
  const stampActor = (recordId: string, action: 'insert' | 'update') =>
    admin
      .from('activity_log')
      .update({ actor_id: caller.id })
      .eq('table_name', 'profiles')
      .eq('record_id', recordId)
      .eq('action', action)
      .is('actor_id', null);

  if (body.action === 'create') {
    const checked = validateCreateStaff(body);
    if (!checked.ok) return json(400, checked);
    const { email, full_name, role, temp_password } = checked.value;

    const { data: existing } = await admin.from('profiles').select('id').eq('email', email).maybeSingle();
    if (existing) return json(409, { ok: false, error: 'That email already has an account.' });

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password: temp_password,
      email_confirm: true,
    });
    if (createError || !created.user) {
      const orphan = /already/i.test(createError?.message ?? '');
      return json(409, {
        ok: false,
        error: orphan
          ? 'A sign-in already exists for this email without a staff profile. Ask a developer to remove it in Supabase Auth.'
          : "The account couldn't be created.",
      });
    }

    const { error: profileError } = await admin
      .from('profiles')
      .insert({ id: created.user.id, email, full_name, role, must_change_password: true });
    if (profileError) {
      await admin.auth.admin.deleteUser(created.user.id);
      return json(500, { ok: false, error: "The account couldn't be created." });
    }
    await stampActor(created.user.id, 'insert');
    return json(200, { ok: true });
  }

  if (body.action === 'reset_password') {
    const checked = validateResetPassword(body);
    if (!checked.ok) return json(400, checked);
    const { user_id, temp_password } = checked.value;
    if (user_id === caller.id) return json(400, { ok: false, error: 'Change your own password from the password page.' });

    const { data: target } = await admin.from('profiles').select('id').eq('id', user_id).maybeSingle();
    if (!target) return json(404, { ok: false, error: 'That person was not found.' });

    const { error: pwError } = await admin.auth.admin.updateUserById(user_id, { password: temp_password });
    if (pwError) return json(500, { ok: false, error: "The password couldn't be reset." });
    await admin.from('profiles').update({ must_change_password: true }).eq('id', user_id);
    await stampActor(user_id, 'update');
    return json(200, { ok: true });
  }

  return json(400, { ok: false, error: 'Invalid request.' });
});

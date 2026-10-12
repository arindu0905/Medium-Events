import { supabase } from './supabase';
import type { Profile, StaffRole } from './types';
import {
  validateCreateStaff,
  validateResetPassword,
  type CreateStaffInput,
} from '../../../supabase/functions/manage-staff/validate.ts';

export type Result = { ok: true } | { ok: false; error: string };

const LAST_ADMIN = 'There must always be at least one active admin.';

export async function listStaff(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('full_name');
  if (error) throw new Error("Staff couldn't be loaded. Refresh to try again.");
  return (data ?? []) as Profile[];
}

// The manage-staff Edge Function holds the service key and re-checks that the caller is an active admin.
// No emails are sent: the admin passes the temporary password on to the person directly.
async function callManageStaff(body: Record<string, unknown>, fallback: string): Promise<Result> {
  const { data, error } = await supabase.functions.invoke('manage-staff', { body });
  if (error) {
    // Non-2xx responses carry the function's JSON body on error.context
    const response = await (error as { context?: { json?: () => Promise<unknown> } }).context?.json?.().catch(() => null);
    return { ok: false, error: (response as { error?: string } | null)?.error ?? fallback };
  }
  const result = data as { ok?: boolean; error?: string } | null;
  return result?.ok ? { ok: true } : { ok: false, error: result?.error ?? fallback };
}

export async function createStaff(input: CreateStaffInput): Promise<Result> {
  const checked = validateCreateStaff(input);
  if (!checked.ok) return checked;
  return callManageStaff({ action: 'create', ...checked.value }, "The account couldn't be created. Try again.");
}

export async function resetStaffPassword(userId: string, tempPassword: string): Promise<Result> {
  const checked = validateResetPassword({ user_id: userId, temp_password: tempPassword });
  if (!checked.ok) return checked;
  return callManageStaff({ action: 'reset_password', ...checked.value }, "The password couldn't be reset. Try again.");
}

export async function updateStaff(id: string, patch: { role?: StaffRole; active?: boolean }): Promise<Result> {
  const { error } = await supabase.from('profiles').update(patch).eq('id', id);
  if (!error) return { ok: true };
  return { ok: false, error: /last active admin/i.test(error.message) ? LAST_ADMIN : "The change couldn't be saved. Try again." };
}

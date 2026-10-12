import { supabase } from './supabase';
import type { Profile, StaffRole } from './types';
import { validateInvite } from '../../../supabase/functions/invite-staff/validate.ts';

export type Result = { ok: true } | { ok: false; error: string };

const LAST_ADMIN = 'There must always be at least one active admin.';

export async function listStaff(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('full_name');
  if (error) throw new Error("Staff couldn't be loaded. Refresh to try again.");
  return (data ?? []) as Profile[];
}

// The invite-staff Edge Function holds the service key and re-checks that the caller is an active admin
export async function inviteStaff(input: { email: string; full_name: string; role: StaffRole }): Promise<Result> {
  const checked = validateInvite(input);
  if (!checked.ok) return checked;

  const { data, error } = await supabase.functions.invoke('invite-staff', { body: checked.value });
  if (error) {
    // Non-2xx responses carry the function's JSON body on error.context
    const body = await (error as { context?: { json?: () => Promise<unknown> } }).context?.json?.().catch(() => null);
    const message = (body as { error?: string } | null)?.error;
    return { ok: false, error: message ?? "The invitation couldn't be sent. Try again." };
  }
  const result = data as { ok?: boolean; error?: string } | null;
  return result?.ok ? { ok: true } : { ok: false, error: result?.error ?? "The invitation couldn't be sent. Try again." };
}

export async function updateStaff(id: string, patch: { role?: StaffRole; active?: boolean }): Promise<Result> {
  const { error } = await supabase.from('profiles').update(patch).eq('id', id);
  if (!error) return { ok: true };
  return { ok: false, error: /last active admin/i.test(error.message) ? LAST_ADMIN : "The change couldn't be saved. Try again." };
}

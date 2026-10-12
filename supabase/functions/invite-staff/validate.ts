// Shared by the invite-staff Edge Function (Deno) and the admin app (browser), so both
// apply exactly the same rules. Plain TypeScript only: no Deno or browser APIs.

export type StaffRole = 'admin' | 'sales' | 'events' | 'finance';

const ROLES: StaffRole[] = ['admin', 'sales', 'events', 'finance'];

export type InviteInput = { email: string; full_name: string; role: StaffRole };

export function validateInvite(input: unknown): { ok: true; value: InviteInput } | { ok: false; error: string } {
  if (!input || typeof input !== 'object') return { ok: false, error: 'Invalid request.' };
  const { email, full_name, role } = input as Record<string, unknown>;

  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return { ok: false, error: 'Enter a valid email address.' };

  const cleanName = typeof full_name === 'string' ? full_name.trim() : '';
  if (!cleanName) return { ok: false, error: "Enter the person's name." };

  if (typeof role !== 'string' || !ROLES.includes(role as StaffRole)) return { ok: false, error: 'Choose a role.' };

  return { ok: true, value: { email: cleanEmail, full_name: cleanName, role: role as StaffRole } };
}

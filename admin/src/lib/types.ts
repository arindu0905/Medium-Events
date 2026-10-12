// Mirrors the database schema in supabase/migrations (spec §3).
// Task 1 generates database.types.ts from the real database; keep these in step with it.

export type StaffRole = 'admin' | 'sales' | 'events' | 'finance';

export const ROLE_LABELS: Record<StaffRole, string> = {
  admin: 'Admin',
  sales: 'Sales',
  events: 'Events',
  finance: 'Finance',
};

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  // Set when an admin creates the account or resets the password; cleared once the user picks their own
  must_change_password: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface ActivityRow {
  id: number;
  at: string;
  actor_id: string | null;
  table_name: string;
  record_id: string;
  action: 'insert' | 'update' | 'delete';
  changes: Record<string, unknown>;
}

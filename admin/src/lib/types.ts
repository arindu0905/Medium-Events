// Shapes returned by the MEDIUM server (server/src).

export type StaffRole = 'admin' | 'sales' | 'events' | 'finance';

export const ROLE_LABELS: Record<StaffRole, string> = {
  admin: 'Admin',
  sales: 'Sales',
  events: 'Events',
  finance: 'Finance',
};

// GET /api/auth/me
export interface SessionUser {
  id: string;
  email: string;
  full_name: string;
  role: StaffRole;
  must_change_password: boolean;
}

// GET /api/staff — admins get every field, others id/full_name/role/active
export interface StaffMember {
  id: string;
  full_name: string;
  role: StaffRole;
  active: boolean;
  email?: string;
  must_change_password?: boolean;
  last_login_at?: string | null;
  created_at?: string;
}

export interface ActivityRow {
  id: number;
  at: string;
  actor_id: string | null;
  actor_name: string | null;
  entity: string;
  entity_id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'publish' | 'export';
  changes: Record<string, unknown>;
}

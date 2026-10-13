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

// ---- events (server/src/events/routes.ts) ----
export interface Series {
  id: string;
  slug: string;
  name: string;
  label: string;
  short_name: string;
  tagline: string;
  description: string[];
  website: string | null;
  endorsement: string | null;
  audience: string;
  usual_venue: string;
  usual_month: string;
  cta_secondary: string | null;
  sort_order: number;
  active: boolean;
  edition_count: number;
}

export type EditionStatus = 'upcoming' | 'past' | 'cancelled';

export interface Edition {
  id: string;
  series_id: string;
  series_name: string;
  name: string;
  start_date: string;
  end_date: string | null;
  venue: string;
  description: string;
  rsvp_count: number | null;
  attendance: number | null;
  facebook_url: string | null;
  banner_file_id: string | null;
  status: EditionStatus;
  outcome_notes: string;
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  series_id: string | null;
  edition_id: string | null;
  sort_order: number;
}

export interface PublishInfo {
  published_at: string;
  published_by_name: string | null;
  series: number;
  events: number;
}

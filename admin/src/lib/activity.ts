import { supabase } from './supabase';
import type { ActivityRow } from './types';

export const PAGE_SIZE = 50;
// Dates in filters are Maldives calendar days (UTC+5, no daylight saving)
const MALDIVES_OFFSET = '+05:00';

export interface ActivityFilters {
  actorId?: string;
  table?: string;
  action?: string;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  page: number; // 0-based
}

export async function listActivity(f: ActivityFilters): Promise<{ rows: ActivityRow[]; total: number }> {
  let query = supabase.from('activity_log').select('*', { count: 'exact' });
  if (f.actorId) query = query.eq('actor_id', f.actorId);
  if (f.table) query = query.eq('table_name', f.table);
  if (f.action) query = query.eq('action', f.action);
  if (f.from) query = query.gte('at', `${f.from}T00:00:00${MALDIVES_OFFSET}`);
  if (f.to) query = query.lte('at', `${f.to}T23:59:59${MALDIVES_OFFSET}`);
  const start = f.page * PAGE_SIZE;
  const { data, error, count } = await query.order('at', { ascending: false }).range(start, start + PAGE_SIZE - 1);
  if (error) throw new Error("The activity log couldn't be loaded. Refresh to try again.");
  return { rows: (data ?? []) as ActivityRow[], total: count ?? 0 };
}

const TABLE_LABELS: Record<string, string> = { profiles: 'Staff' };
const ACTION_LABELS: Record<string, string> = { insert: 'Created', update: 'Updated', delete: 'Deleted' };

export const tableLabel = (table: string) => TABLE_LABELS[table] ?? table;
export const actionLabel = (action: string) => ACTION_LABELS[action] ?? action;

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Indian/Maldives',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

// e.g. "12 Oct 2026, 09:30" in Maldives time
export function formatWhen(iso: string): string {
  const parts = Object.fromEntries(timeFormat.formatToParts(new Date(iso)).map((p) => [p.type, p.value]));
  return `${parts.day} ${parts.month} ${parts.year}, ${parts.hour}:${parts.minute}`;
}

// Readable summary of an update's changed columns: field: "old" → "new"
export function summariseChanges(row: ActivityRow): string {
  if (row.action !== 'update') return '';
  return Object.entries(row.changes as Record<string, { old: unknown; new: unknown }>)
    .map(([field, change]) => `${field}: ${JSON.stringify(change.old)} → ${JSON.stringify(change.new)}`)
    .join('; ');
}

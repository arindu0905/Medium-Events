import type { StaffRole } from './types';

// Which sections each role sees in the admin app. This only shapes the UI;
// the database's row-level security is what actually protects the data.

export type SectionId = 'dashboard' | 'staff' | 'activity';

const ALL: StaffRole[] = ['admin', 'sales', 'events', 'finance'];

export const NAV_ITEMS: { id: SectionId; label: string; path: string; roles: StaffRole[] }[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', roles: ALL },
  { id: 'staff', label: 'Staff', path: '/staff', roles: ['admin'] },
  { id: 'activity', label: 'Activity log', path: '/activity', roles: ALL },
];

export function canSee(role: StaffRole, section: SectionId): boolean {
  return NAV_ITEMS.find((item) => item.id === section)!.roles.includes(role);
}

export function rolesFor(section: SectionId): StaffRole[] {
  return NAV_ITEMS.find((item) => item.id === section)!.roles;
}

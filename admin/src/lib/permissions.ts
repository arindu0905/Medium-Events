import { can as serverCan, type Permission } from '../../../server/src/permissions.ts';
import type { StaffRole } from './types';

// Which sections each role sees. Uses the server's own permission table, so the menu always
// matches what the server allows; the server still checks every request.
export type { Permission };
export const can = (role: StaffRole | null | undefined, permission: Permission) => !!role && serverCan(role, permission);

export type SectionId = 'dashboard' | 'events' | 'publish' | 'enquiries' | 'staff' | 'activity' | 'account';

export const NAV_ITEMS: { id: SectionId; label: string; path: string; permission: Permission | null }[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', permission: null },
  { id: 'events', label: 'Events', path: '/events', permission: 'events.read' },
  { id: 'publish', label: 'Publish', path: '/publish', permission: 'events.publish' },
  { id: 'enquiries', label: 'Enquiries', path: '/enquiries', permission: 'enquiries.access' },
  { id: 'staff', label: 'Staff', path: '/staff', permission: 'staff.write' },
  { id: 'activity', label: 'Activity log', path: '/activity', permission: null },
  { id: 'account', label: 'My account', path: '/account', permission: null },
];

export function canSee(role: StaffRole, section: SectionId): boolean {
  const item = NAV_ITEMS.find((i) => i.id === section)!;
  return item.permission === null || can(role, item.permission);
}

export function rolesFor(section: SectionId): StaffRole[] {
  return (['admin', 'sales', 'events', 'finance'] as StaffRole[]).filter((role) => canSee(role, section));
}

export const navFor = (role: StaffRole | null) => NAV_ITEMS.filter((item) => role && canSee(role, item.id));

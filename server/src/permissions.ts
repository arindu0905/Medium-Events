// The one place that says who may do what (spec §5). Route guards and tests both use it;
// the admin app mirrors it for navigation only.

export type Role = 'admin' | 'sales' | 'events' | 'finance';
export const ROLES: Role[] = ['admin', 'sales', 'events', 'finance'];

const ALL: Role[] = ROLES;

export const PERMISSIONS = {
  'staff.list': ALL,
  'staff.details': ['admin'],
  'staff.write': ['admin'],
  'activity.readOwn': ALL,
  'activity.readAll': ['admin'],
  'events.read': ALL,
  'events.write': ['admin', 'events'],
  'events.publish': ['admin', 'events'],
  'enquiries.access': ['admin', 'sales'],
  'sponsors.read': ALL,
  'sponsors.write': ['admin', 'sales'],
  'deals.read': ALL,
  // Events staff see sponsors and packages but never money
  'deals.readAmounts': ['admin', 'sales', 'finance'],
  'deals.write': ['admin', 'sales'],
  'payments.read': ['admin', 'sales', 'finance'],
  'payments.write': ['admin', 'finance'],
  'payments.delete': ['admin'],
  'reports.postEvent': ['admin', 'events'],
  'reports.sponsorship': ['admin', 'sales', 'finance'],
  'reports.enquiries': ['admin', 'sales'],
} satisfies Record<string, Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as Role[]).includes(role);
}

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AdminRoutes } from '../AdminRoutes';
import { createFakeSupabase, makeProfile } from '../test/fakeSupabase';
import type { StaffRole } from '../lib/types';
import { canSee } from '../lib/permissions';

const holder = vi.hoisted(() => ({ fake: null as unknown as ReturnType<typeof createFakeSupabase> }));
vi.mock('../lib/supabase', () => ({
  DEMO_MODE: false,
  get supabase() {
    return holder.fake.client;
  },
}));

function renderAs(role: StaffRole, url = '/') {
  const profile = makeProfile({ id: `u-${role}`, role, full_name: 'Sam Example', email: `${role}@medium.test` });
  holder.fake = createFakeSupabase({ profiles: [profile], session: { user: { id: profile.id, email: profile.email } } });
  return render(
    <MemoryRouter initialEntries={[url]}>
      <AdminRoutes />
    </MemoryRouter>,
  );
}

const navLabels = async () =>
  within(await screen.findByRole('navigation', { name: 'Admin' }))
    .getAllByRole('link')
    .map((a) => a.textContent);

beforeEach(() => vi.clearAllMocks());

describe('permissions', () => {
  it('shows Staff only to admins', () => {
    expect(canSee('admin', 'staff')).toBe(true);
    for (const role of ['sales', 'events', 'finance'] as StaffRole[]) {
      expect(canSee(role, 'staff')).toBe(false);
      expect(canSee(role, 'dashboard')).toBe(true);
      expect(canSee(role, 'activity')).toBe(true);
    }
  });
});

describe('Layout', () => {
  it('gives admins Dashboard, Staff and Activity log', async () => {
    renderAs('admin');
    expect(await navLabels()).toEqual(['Dashboard', 'Staff', 'Activity log']);
  });

  it.each(['sales', 'events', 'finance'] as StaffRole[])('gives %s Dashboard and Activity log only', async (role) => {
    renderAs(role);
    expect(await navLabels()).toEqual(['Dashboard', 'Activity log']);
  });

  it('blocks non-admins from the Staff page', async () => {
    renderAs('finance', '/staff');
    expect(await screen.findByRole('heading', { name: "You don't have access to this page" })).toBeTruthy();
  });

  it('shows who is signed in and their role', async () => {
    renderAs('events');
    const banner = await screen.findByRole('banner');
    expect(within(banner).getByText('Sam Example')).toBeTruthy();
    expect(within(banner).getByText('Events')).toBeTruthy();
  });

  it('signs out', async () => {
    renderAs('sales');
    fireEvent.click(await screen.findByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('heading', { name: 'Sign in to MEDIUM Admin' })).toBeTruthy();
  });

  it('opens and closes the menu on small screens', async () => {
    renderAs('admin');
    const toggle = await screen.findByRole('button', { name: 'Open menu' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Close menu' }).getAttribute('aria-expanded')).toBe('true');
  });

  it('shows a not-found page for unknown addresses', async () => {
    renderAs('admin', '/nope');
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeTruthy();
  });
});

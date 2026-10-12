import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AdminRoutes } from '../AdminRoutes';
import { createFakeSupabase, makeProfile, type QueryCall } from '../test/fakeSupabase';
import type { ActivityRow, StaffRole } from '../lib/types';

const holder = vi.hoisted(() => ({ fake: null as unknown as ReturnType<typeof createFakeSupabase> }));
vi.mock('../lib/supabase', () => ({
  get supabase() {
    return holder.fake.client;
  },
}));

const admin = makeProfile({ id: 'u-admin', full_name: 'Aisha Admin', role: 'admin' });
const sales = makeProfile({ id: 'u-sales', full_name: 'Sam Sales', email: 'sam@medium.test', role: 'sales' });

const ROWS: ActivityRow[] = [
  {
    id: 2,
    at: '2026-10-12T04:30:00Z',
    actor_id: 'u-admin',
    table_name: 'profiles',
    record_id: 'u-sales',
    action: 'update',
    changes: { role: { old: 'events', new: 'sales' }, full_name: { old: 'Sam', new: 'Sam Sales' } },
  },
  { id: 1, at: '2026-10-11T03:00:00Z', actor_id: null, table_name: 'profiles', record_id: 'u-admin', action: 'insert', changes: {} },
];

let activityQueries: QueryCall[][];

function renderAs(role: StaffRole, total = ROWS.length) {
  const me = role === 'admin' ? admin : sales;
  holder.fake = createFakeSupabase({ profiles: [admin, sales], session: { user: { id: me.id, email: me.email } } });
  activityQueries = [];
  holder.fake.state.handlers.activity_log = (calls) => {
    activityQueries.push(calls);
    return { data: ROWS, error: null, count: total };
  };
  render(
    <MemoryRouter initialEntries={['/activity']}>
      <AdminRoutes />
    </MemoryRouter>,
  );
}

const lastQuery = () => activityQueries[activityQueries.length - 1];
const call = (calls: QueryCall[], method: string) => calls.filter((c) => c.method === method).map((c) => c.args);

beforeEach(() => vi.clearAllMocks());

describe('ActivityPage', () => {
  it('shows who did what, when, in Maldives time', async () => {
    renderAs('admin');
    await screen.findByText('12 Oct 2026, 09:30');
    const rows = screen.getAllByRole('row');
    const first = rows[1];
    expect(await within(first).findByText('Aisha Admin')).toBeTruthy();
    expect(within(first).getByText('12 Oct 2026, 09:30')).toBeTruthy();
    expect(within(first).getByText('Updated')).toBeTruthy();
    expect(within(first).getByText('Staff')).toBeTruthy();
    expect(within(first).getByText('role: "events" → "sales"; full_name: "Sam" → "Sam Sales"')).toBeTruthy();
    expect(within(rows[2]).getByText('System')).toBeTruthy();
    expect(within(rows[2]).getByText('Created')).toBeTruthy();
  });

  it('loads newest first, 50 per page', async () => {
    renderAs('admin');
    await screen.findAllByRole('row');
    expect(call(lastQuery(), 'order')).toEqual([['at', { ascending: false }]]);
    expect(call(lastQuery(), 'range')).toEqual([[0, 49]]);
  });

  it('pages through long histories', async () => {
    renderAs('admin', 120);
    fireEvent.click(await screen.findByRole('button', { name: 'Next page' }));
    await waitFor(() => expect(call(lastQuery(), 'range')).toEqual([[50, 99]]));
    expect(screen.getByText('Page 2 of 3')).toBeTruthy();
  });

  it('filters by person, action and dates in Maldives time', async () => {
    renderAs('admin');
    await screen.findAllByRole('row');
    await screen.findByRole('option', { name: 'Sam Sales' });
    fireEvent.change(screen.getByLabelText('Person'), { target: { value: 'u-sales' } });
    fireEvent.change(screen.getByLabelText('Action'), { target: { value: 'update' } });
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2026-10-01' } });
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2026-10-31' } });
    await waitFor(() => {
      const q = lastQuery();
      expect(call(q, 'eq')).toEqual(expect.arrayContaining([['actor_id', 'u-sales'], ['action', 'update']]));
      expect(call(q, 'gte')).toEqual([['at', '2026-10-01T00:00:00+05:00']]);
      expect(call(q, 'lte')).toEqual([['at', '2026-10-31T23:59:59+05:00']]);
      expect(call(q, 'range')).toEqual([[0, 49]]);
    });
  });

  it('does not offer the person filter to non-admins', async () => {
    renderAs('sales');
    await screen.findAllByRole('row');
    expect(screen.queryByLabelText('Person')).toBeNull();
    expect(screen.getByText('Showing your own changes.')).toBeTruthy();
  });
});

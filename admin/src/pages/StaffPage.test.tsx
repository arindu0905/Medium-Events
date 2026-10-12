import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AdminRoutes } from '../AdminRoutes';
import { createFakeSupabase, makeProfile, type QueryCall } from '../test/fakeSupabase';

const holder = vi.hoisted(() => ({ fake: null as unknown as ReturnType<typeof createFakeSupabase> }));
vi.mock('../lib/supabase', () => ({
  DEMO_MODE: false,
  get supabase() {
    return holder.fake.client;
  },
}));

const me = makeProfile({ id: 'u-me', full_name: 'Aisha Admin', email: 'aisha@medium.mv', role: 'admin' });
const sam = makeProfile({ id: 'u-sam', full_name: 'Sam Sales', email: 'sam@medium.mv', role: 'sales' });
const fay = makeProfile({ id: 'u-fay', full_name: 'Fay Finance', email: 'fay@medium.mv', role: 'finance', active: false });

let updates: { patch: unknown; id: unknown }[];
let updateError: { message: string } | null;

function setup() {
  holder.fake = createFakeSupabase({ profiles: [me, sam, fay], session: { user: { id: me.id, email: me.email } } });
  updates = [];
  updateError = null;
  const select = holder.fake.state.handlers.profiles;
  holder.fake.state.handlers.profiles = (calls: QueryCall[]) => {
    const update = calls.find((c) => c.method === 'update');
    if (!update) return select(calls);
    const id = calls.find((c) => c.method === 'eq')?.args[1];
    updates.push({ patch: update.args[0], id });
    return { data: null, error: updateError };
  };
  render(
    <MemoryRouter initialEntries={['/staff']}>
      <AdminRoutes />
    </MemoryRouter>,
  );
}

const rowFor = async (name: string) => (await screen.findByRole('cell', { name })).closest('tr') as HTMLElement;

beforeEach(setup);

describe('StaffPage', () => {
  it('lists every staff member with role and status', async () => {
    expect(await screen.findByRole('heading', { level: 1, name: 'Staff' })).toBeTruthy();
    const fayRow = await rowFor('Fay Finance');
    expect(within(fayRow).getByText('fay@medium.mv')).toBeTruthy();
    expect(within(fayRow).getByText('Deactivated')).toBeTruthy();
    expect(within(await rowFor('Sam Sales')).getByText('Active')).toBeTruthy();
  });

  it('validates an invite before sending it', async () => {
    fireEvent.click(await screen.findByRole('button', { name: 'Invite staff' }));
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'New Person' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send invitation' }));
    expect(screen.getByText('Enter a valid email address.')).toBeTruthy();
    expect(holder.fake.state.invoked).toHaveLength(0);
  });

  it('sends a valid invite and confirms it', async () => {
    fireEvent.click(await screen.findByRole('button', { name: 'Invite staff' }));
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'New Person' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'New@Medium.mv' } });
    fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'events' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send invitation' }));
    expect(await screen.findByText('Invitation sent to new@medium.mv.')).toBeTruthy();
    expect(holder.fake.state.invoked).toEqual([
      { name: 'invite-staff', body: { email: 'new@medium.mv', full_name: 'New Person', role: 'events' } },
    ]);
  });

  it('shows the server error when an invite is refused', async () => {
    holder.fake.state.invokeResult = {
      data: null,
      error: { context: { json: async () => ({ ok: false, error: 'That email already has an account.' }) } },
    };
    fireEvent.click(await screen.findByRole('button', { name: 'Invite staff' }));
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Sam Again' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'sam@medium.mv' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send invitation' }));
    expect(await screen.findByText('That email already has an account.')).toBeTruthy();
  });

  it("doesn't let you change your own access", async () => {
    const myRow = await rowFor('Aisha Admin');
    const select = within(myRow).getByLabelText('Role for Aisha Admin') as HTMLSelectElement;
    const button = within(myRow).getByRole('button', { name: 'Deactivate' });
    expect(select.disabled).toBe(true);
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.getAttribute('title')).toBe("You can't change your own access");
  });

  it('changes another person’s role', async () => {
    const row = await rowFor('Sam Sales');
    fireEvent.change(within(row).getByLabelText('Role for Sam Sales'), { target: { value: 'finance' } });
    await waitFor(() => expect(updates).toEqual([{ patch: { role: 'finance' }, id: 'u-sam' }]));
  });

  it('asks for confirmation before deactivating', async () => {
    const row = await rowFor('Sam Sales');
    fireEvent.click(within(row).getByRole('button', { name: 'Deactivate' }));
    expect(updates).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Yes, deactivate Sam Sales' }));
    await waitFor(() => expect(updates).toEqual([{ patch: { active: false }, id: 'u-sam' }]));
  });

  it('reactivates a deactivated person', async () => {
    const row = await rowFor('Fay Finance');
    fireEvent.click(within(row).getByRole('button', { name: 'Reactivate' }));
    await waitFor(() => expect(updates).toEqual([{ patch: { active: true }, id: 'u-fay' }]));
  });

  it('explains the last-admin rule when the database refuses', async () => {
    updateError = { message: 'last active admin' };
    const row = await rowFor('Sam Sales');
    fireEvent.change(within(row).getByLabelText('Role for Sam Sales'), { target: { value: 'events' } });
    expect(await screen.findByText('There must always be at least one active admin.')).toBeTruthy();
  });
});

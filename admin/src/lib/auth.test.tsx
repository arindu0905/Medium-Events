import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AdminRoutes } from '../AdminRoutes';
import { createFakeSupabase, makeProfile } from '../test/fakeSupabase';

const holder = vi.hoisted(() => ({ fake: null as unknown as ReturnType<typeof createFakeSupabase> }));
vi.mock('./supabase', () => ({
  DEMO_MODE: false,
  get supabase() {
    return holder.fake.client;
  },
}));

const admin = makeProfile();

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <AdminRoutes />
    </MemoryRouter>,
  );
}

async function signInViaForm(email = admin.email, password = 'correct-password') {
  fireEvent.change(await screen.findByLabelText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
}

beforeEach(() => {
  holder.fake = createFakeSupabase({ profiles: [admin] });
});

describe('authentication', () => {
  it('sends signed-out visitors to the sign-in page', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { name: 'Sign in to MEDIUM Admin' })).toBeTruthy();
  });

  it('shows a plain error for a wrong password', async () => {
    renderAt('/');
    await signInViaForm(admin.email, 'wrong');
    expect(await screen.findByText('Email or password is incorrect.')).toBeTruthy();
  });

  it('signs in and shows the dashboard', async () => {
    renderAt('/');
    await signInViaForm();
    expect(await screen.findByText('Welcome, Aisha')).toBeTruthy();
    expect(screen.getByText('Signed in as Admin')).toBeTruthy();
  });

  it('refuses a deactivated account', async () => {
    holder.fake = createFakeSupabase({ profiles: [makeProfile({ active: false })] });
    renderAt('/');
    await signInViaForm();
    expect(await screen.findByText('Your account is deactivated. Contact a MEDIUM admin.')).toBeTruthy();
    expect(holder.fake.state.session).toBeNull();
  });

  it('signs out a user who is deactivated during their session', async () => {
    renderAt('/');
    await signInViaForm();
    await screen.findByText('Welcome, Aisha');
    holder.fake.state.profiles[0].active = false;
    fireEvent.click(screen.getByRole('link', { name: 'Activity log' }));
    expect(await screen.findByText('Your account is deactivated. Contact a MEDIUM admin.')).toBeTruthy();
    expect(holder.fake.state.session).toBeNull();
  });

  it('picks up a role change on the next navigation', async () => {
    renderAt('/');
    await signInViaForm();
    await screen.findByText('Signed in as Admin');
    holder.fake.state.profiles[0].role = 'sales';
    fireEvent.click(screen.getByRole('link', { name: 'Activity log' }));
    fireEvent.click(await screen.findByRole('link', { name: 'Dashboard' }));
    expect(await screen.findByText('Signed in as Sales')).toBeTruthy();
  });
});

describe('set password', () => {
  const fill = (password: string, confirm: string) => {
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: password } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: confirm } });
    fireEvent.click(screen.getByRole('button', { name: 'Save password' }));
  };

  beforeEach(() => {
    holder.fake = createFakeSupabase({ profiles: [admin], session: { user: { id: admin.id, email: admin.email } } });
  });

  it('requires at least 10 characters', async () => {
    renderAt('/set-password');
    await screen.findByLabelText('New password');
    fill('short', 'short');
    expect(screen.getByText('Use at least 10 characters.')).toBeTruthy();
  });

  it('requires both passwords to match', async () => {
    renderAt('/set-password');
    await screen.findByLabelText('New password');
    fill('long-enough-1', 'long-enough-2');
    expect(screen.getByText("Passwords don't match.")).toBeTruthy();
  });

  it('saves the password and opens the dashboard', async () => {
    const updateUser = vi.spyOn(holder.fake.client.auth, 'updateUser');
    renderAt('/set-password');
    await screen.findByLabelText('New password');
    fill('long-enough-1', 'long-enough-1');
    await waitFor(() => expect(updateUser).toHaveBeenCalledWith({ password: 'long-enough-1' }));
    expect(await screen.findByText('Welcome, Aisha')).toBeTruthy();
  });
});

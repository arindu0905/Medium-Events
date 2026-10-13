import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../lib/auth';
import { navFor } from '../lib/permissions';
import { ROLE_LABELS } from '../lib/types';

const DESCRIPTIONS: Record<string, string> = {
  events: 'Event series, editions, banners and partners.',
  publish: 'Update the website with the latest events.',
  enquiries: 'Leads from the website and enquiries taken by phone or in person.',
  staff: 'Add staff, change roles and deactivate accounts.',
  activity: 'See who changed what, and when.',
  account: 'Your details and password.',
};

export default function DashboardPage() {
  const { user, role } = useAuth();
  const firstName = user?.full_name.split(' ')[0] ?? '';
  const shortcuts = navFor(role).filter((item) => item.id !== 'dashboard');

  return (
    <section>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">Welcome, {firstName}</h1>
      <p className="mt-1 text-body">Signed in as {role && ROLE_LABELS[role]}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="block rounded-lg border border-line bg-white p-5 hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <h2 className="text-base font-semibold text-ink">{item.label}</h2>
            <p className="mt-1 text-sm text-body">{DESCRIPTIONS[item.id]}</p>
          </Link>
        ))}
      </div>
      <p className="mt-10 text-sm text-muted">Events, enquiries, sponsors and reports will appear here as they're added.</p>
    </section>
  );
}

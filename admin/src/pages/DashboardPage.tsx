import React from 'react';
import { useAuth } from '../lib/auth';
import { ROLE_LABELS } from '../lib/types';

export default function DashboardPage() {
  const { profile, role } = useAuth();
  const firstName = profile?.full_name.split(' ')[0] ?? '';
  return (
    <section>
      <h1 className="text-2xl font-bold text-ink">Welcome, {firstName}</h1>
      <p className="mt-1 text-body">Signed in as {role && ROLE_LABELS[role]}</p>
    </section>
  );
}

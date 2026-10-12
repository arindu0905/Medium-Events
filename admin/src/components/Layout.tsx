import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../lib/auth';
import { ROLE_LABELS } from '../lib/types';

export const Layout: React.FC = () => {
  const { profile, role, signOut } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-line bg-white px-6 py-3">
        <span className="font-semibold text-ink">MEDIUM Admin</span>
        <span className="text-sm text-body">
          {profile?.full_name} · {role && ROLE_LABELS[role]}
          <button type="button" onClick={signOut} className="ml-4 font-semibold text-brand cursor-pointer">
            Sign out
          </button>
        </span>
      </header>
      <nav aria-label="Admin" className="flex gap-4 border-b border-line bg-white px-6 py-2 text-sm">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/activity">Activity log</NavLink>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

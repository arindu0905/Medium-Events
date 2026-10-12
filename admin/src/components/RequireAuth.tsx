import React, { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../lib/auth';
import type { StaffRole } from '../lib/types';

// Guards signed-in pages. Re-checks the profile on every navigation so a deactivation or role
// change made by an admin takes effect without the user signing in again.
export const RequireAuth: React.FC<{ roles?: StaffRole[]; children?: React.ReactNode }> = ({ roles, children }) => {
  const { session, profile, loading, refreshProfile } = useAuth();
  const { pathname } = useLocation();
  const firstPath = useRef(pathname);

  useEffect(() => {
    if (pathname !== firstPath.current) {
      firstPath.current = pathname;
      refreshProfile();
    }
  }, [pathname, refreshProfile]);

  if (loading) return <p className="p-8 text-sm text-muted">Loading…</p>;
  if (!session || !profile) return <Navigate to="/login" replace state={{ from: pathname }} />;
  if (roles && !roles.includes(profile.role)) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-ink">You don't have access to this page</h1>
        <p className="mt-2 text-body">Ask a MEDIUM admin if you need it.</p>
      </div>
    );
  }
  return children ? <>{children}</> : <Outlet />;
};

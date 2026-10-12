import React from 'react';
import { Route, Routes } from 'react-router';
import { AuthProvider } from './lib/auth';
import { rolesFor } from './lib/permissions';
import { RequireAuth } from './components/RequireAuth';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import SetPasswordPage from './pages/SetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Placeholders until the staff and activity pages are built (plan Tasks 6 and 7)
const StaffPlaceholder = () => <h1 className="text-2xl font-bold text-ink">Staff</h1>;
const ActivityPlaceholder = () => <h1 className="text-2xl font-bold text-ink">Activity log</h1>;

export function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/staff" element={<RequireAuth roles={rolesFor('staff')}><StaffPlaceholder /></RequireAuth>} />
            <Route path="/activity" element={<RequireAuth roles={rolesFor('activity')}><ActivityPlaceholder /></RequireAuth>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

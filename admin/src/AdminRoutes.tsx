import React from 'react';
import { Route, Routes } from 'react-router';
import { AuthProvider } from './lib/auth';
import { RequireAuth } from './components/RequireAuth';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import SetPasswordPage from './pages/SetPasswordPage';
import DashboardPage from './pages/DashboardPage';

// Placeholder until the activity log page is built (plan Task 7)
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
            <Route path="/activity" element={<ActivityPlaceholder />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

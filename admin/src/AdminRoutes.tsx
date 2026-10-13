import React from 'react';
import { Route, Routes } from 'react-router';
import { AuthProvider } from './lib/auth';
import { rolesFor } from './lib/permissions';
import { RequireAuth } from './components/RequireAuth';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import StaffPage from './pages/StaffPage';
import ActivityPage from './pages/ActivityPage';
import AccountPage from './pages/AccountPage';
import EventsPage from './pages/EventsPage';
import SeriesPage from './pages/SeriesPage';
import EditionPage from './pages/EditionPage';
import PublishPage from './pages/PublishPage';

export function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/staff" element={<RequireAuth roles={rolesFor('staff')}><StaffPage /></RequireAuth>} />
            <Route path="/activity" element={<RequireAuth roles={rolesFor('activity')}><ActivityPage /></RequireAuth>} />
            <Route path="/account" element={<AccountPage />} />
            <Route element={<RequireAuth roles={rolesFor('events')} />}>
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/editions/:id" element={<EditionPage />} />
              <Route path="/events/:seriesId/editions/new" element={<EditionPage />} />
              <Route path="/events/:id" element={<SeriesPage />} />
            </Route>
            <Route path="/publish" element={<RequireAuth roles={rolesFor('publish')}><PublishPage /></RequireAuth>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

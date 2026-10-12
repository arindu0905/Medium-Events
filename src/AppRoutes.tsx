import React from 'react';
import { Route, Routes } from 'react-router';
import App from './App';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import { pathFor } from './routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route index element={<HomePage />} />
        <Route path={pathFor('services')} element={<ServicesPage />} />
        <Route path={pathFor('events')} element={<EventsPage />} />
        <Route path={pathFor('about')} element={<AboutPage />} />
        <Route path={pathFor('news')} element={<NewsPage />} />
        <Route path={pathFor('contact')} element={<ContactPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

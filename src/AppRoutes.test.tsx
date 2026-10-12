import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import { AppRoutes } from './AppRoutes';
import { contactPath } from './routes';
import { FLAGSHIP_EVENTS_DATA } from './data/websiteData';
import { trackPageView } from './lib/analytics';

vi.mock('./lib/analytics', () => ({ initAnalytics: vi.fn(), trackPageView: vi.fn(), trackEvent: vi.fn() }));

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
}

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <AppRoutes />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe('AppRoutes', () => {
  it('renders the Flagship Events page at /events', async () => {
    renderAt('/events');
    expect(await screen.findByRole('heading', { name: 'Nation-Scale Expos & Strategic Forums' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: "Events We've Delivered" })).toBeTruthy();
  });

  it('renders the Info Center at /news', async () => {
    renderAt('/news');
    expect(await screen.findByRole('heading', { name: 'News, Expo Bulletins & Press Releases' })).toBeTruthy();
  });

  it('redirects legacy hash links on the home page', async () => {
    renderAt('/#events');
    expect(await screen.findByRole('heading', { name: 'Nation-Scale Expos & Strategic Forums' })).toBeTruthy();
    expect(screen.getByTestId('location').textContent).toBe('/events');
  });

  it('ignores hashes on other pages', async () => {
    renderAt('/about#events');
    await screen.findAllByRole('heading');
    expect(screen.getByTestId('location').textContent).toBe('/about');
  });

  it('links navigation to real URLs', async () => {
    renderAt('/');
    const nav = await screen.findByRole('navigation');
    expect(within(nav).getAllByRole('link', { name: 'Info Center' })[0].getAttribute('href')).toBe('/news');
    expect(screen.getByRole('link', { name: 'Project Enquiry' }).getAttribute('href')).toBe('/contact');
  });

  it('links event sponsorship buttons to a prefilled contact page', async () => {
    renderAt('/events');
    const links = await screen.findAllByRole('link', { name: /Sponsorship/ });
    expect(links[0].getAttribute('href')).toBe(contactPath({ event: FLAGSHIP_EVENTS_DATA[0].name }));
  });

  it('reports page views under the canonical path', async () => {
    renderAt('/contact/');
    await screen.findAllByRole('heading');
    expect(trackPageView).toHaveBeenCalledWith('/contact', 'Contact & Sponsorship Enquiries | MEDIUM Events Maldives');
  });
});

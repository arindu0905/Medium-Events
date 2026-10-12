import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { WhatsAppButton } from './WhatsAppButton';
import { buildWhatsAppUrl } from '../lib/enquiry';
import { trackEvent } from '../lib/analytics';

vi.mock('../lib/analytics', () => ({ trackEvent: vi.fn() }));

const renderAt = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <WhatsAppButton />
    </MemoryRouter>,
  );

describe('WhatsAppButton', () => {
  it('opens a pre-filled chat with MEDIUM in a new tab', () => {
    renderAt('/');
    const link = screen.getByRole('link', { name: 'Chat with MEDIUM on WhatsApp' });
    expect(link.getAttribute('href')).toBe(
      buildWhatsAppUrl('+960 799-7974', "Hi MEDIUM, I'm interested in your events and services."),
    );
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
  });

  it('is not rendered on the contact page, where the form has its own WhatsApp action', () => {
    renderAt('/');
    const home = screen.getByRole('link', { name: 'Chat with MEDIUM on WhatsApp' }).className;
    expect(home).toContain('flex');
    expect(home).not.toContain('hidden');
    renderAt('/contact');
    expect(screen.getAllByRole('link', { name: 'Chat with MEDIUM on WhatsApp' })).toHaveLength(1);
  });

  it('reports clicks to analytics', () => {
    renderAt('/');
    fireEvent.click(screen.getByRole('link', { name: 'Chat with MEDIUM on WhatsApp' }));
    expect(trackEvent).toHaveBeenCalledWith('whatsapp_click', { location: 'floating' });
  });

  it('is not rendered at /contact/ with a trailing slash either', () => {
    renderAt('/contact/');
    expect(screen.queryByRole('link', { name: 'Chat with MEDIUM on WhatsApp' })).toBeNull();
  });

  it('shows a brand-coloured focus ring that is visible on white pages', () => {
    renderAt('/');
    const cls = screen.getByRole('link', { name: 'Chat with MEDIUM on WhatsApp' }).className;
    expect(cls).toContain('focus-visible:outline-brand');
    expect(cls).not.toContain('ring-white');
  });
});

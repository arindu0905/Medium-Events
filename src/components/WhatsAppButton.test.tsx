import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { WhatsAppButton } from './WhatsAppButton';
import { buildWhatsAppUrl } from '../lib/enquiry';

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
});

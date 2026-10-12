import { describe, expect, it } from 'vitest';
import { ROUTES, contactPath, legacyHashToPath, pathFor, routeForPath } from './routes';

describe('ROUTES', () => {
  it('lists the six pages in navigation order', () => {
    expect(ROUTES.map((r) => r.path)).toEqual(['/', '/services', '/events', '/about', '/news', '/contact']);
  });

  it('gives every page a unique title and a description', () => {
    expect(new Set(ROUTES.map((r) => r.title)).size).toBe(ROUTES.length);
    for (const r of ROUTES) expect(r.description.length).toBeGreaterThan(40);
    for (const r of ROUTES) expect(r.description.length).toBeLessThanOrEqual(160);
  });

  it('uses the Ooredoo signing photo as the News share image and the CIF collage elsewhere', () => {
    expect(ROUTES.find((r) => r.id === 'news')!.ogImage).toBe('/images/fb/ooredoo-cif-2026-signing.jpg');
    expect(ROUTES.find((r) => r.id === 'events')!.ogImage).toBe('/images/fb/cif-2025.jpg');
  });
});

describe('pathFor / routeForPath', () => {
  it('maps ids to paths', () => {
    expect(pathFor('news')).toBe('/news');
    expect(pathFor('home')).toBe('/');
  });

  it('finds routes with or without a trailing slash', () => {
    expect(routeForPath('/events/')!.id).toBe('events');
    expect(routeForPath('/events')!.id).toBe('events');
    expect(routeForPath('/')!.id).toBe('home');
    expect(routeForPath('/nope')).toBeUndefined();
  });
});

describe('legacyHashToPath', () => {
  it('maps every legacy hash to its new page', () => {
    expect(legacyHashToPath('#home')).toBe('/');
    expect(legacyHashToPath('#services')).toBe('/services');
    expect(legacyHashToPath('#events')).toBe('/events');
    expect(legacyHashToPath('#about')).toBe('/about');
    expect(legacyHashToPath('#info-center')).toBe('/news');
    expect(legacyHashToPath('enquiry')).toBe('/contact');
  });

  it('returns null for unknown or empty hashes', () => {
    expect(legacyHashToPath('#nope')).toBeNull();
    expect(legacyHashToPath('')).toBeNull();
    expect(legacyHashToPath('#')).toBeNull();
  });
});

describe('contactPath', () => {
  it('is plain /contact without options', () => {
    expect(contactPath()).toBe('/contact');
  });

  it('round-trips event names containing special characters', () => {
    const name = 'Aviation Forum – Connecting Maldives (AF) & more';
    const p = contactPath({ event: name });
    expect(new URL(p, 'https://x').pathname).toBe('/contact');
    expect(new URL(p, 'https://x').searchParams.get('event')).toBe(name);
  });

  it('carries a service id', () => {
    expect(new URL(contactPath({ service: 'design' }), 'https://x').searchParams.get('service')).toBe('design');
  });
});

// Single source of truth for pages: drives the router, pre-rendering, sitemap and build check.

export type PageId = 'home' | 'services' | 'events' | 'about' | 'news' | 'contact';

export interface RouteMeta {
  id: PageId;
  path: string;
  navLabel: string;
  title: string;
  description: string;
  ogImage: string;
}

const DEFAULT_OG_IMAGE = '/images/fb/cif-2025.jpg';

export const ROUTES: RouteMeta[] = [
  {
    id: 'home',
    path: '/',
    navLabel: 'Home',
    title: 'MEDIUM Events | Expos, Forums & Creative Agency in the Maldives',
    description:
      'MEDIUM Events runs the Construction Industry Forum, Marine Industry Forum, Aviation Forum and Build Expo, plus advertising and design across the Maldives.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  {
    id: 'services',
    path: '/services',
    navLabel: 'Services',
    title: 'Services | MEDIUM Events Maldives',
    description:
      'Turnkey event management, analytics-driven advertising, design and video production, and creative consultancy for brands across the Maldives.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  {
    id: 'events',
    path: '/events',
    navLabel: 'Flagship Events',
    title: 'Flagship Events | MEDIUM Events Maldives',
    description:
      'Construction Industry Forum, Maldives Marine Industry Forum, Aviation Forum and Build Expo: the national forums and expos MEDIUM has hosted since 2023.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  {
    id: 'about',
    path: '/about',
    navLabel: 'About & Credibility',
    title: 'About | MEDIUM Events Maldives',
    description:
      'A full-suite creative firm in Malé with 60+ years of combined experience, trusted by MNACI, Ooredoo Maldives, SITA and national industry associations.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  {
    id: 'news',
    path: '/news',
    navLabel: 'Info Center',
    title: 'News & Press Releases | MEDIUM Events Maldives',
    description:
      'Latest announcements from MEDIUM Events: sponsorship signings, forum dates, expo bulletins and press releases from across the Maldives.',
    ogImage: '/images/fb/ooredoo-cif-2026-signing.jpg',
  },
  {
    id: 'contact',
    path: '/contact',
    navLabel: 'Enquiry',
    title: 'Contact & Sponsorship Enquiries | MEDIUM Events Maldives',
    description:
      'Enquire about sponsorship, exhibition booths or a campaign. Reach MEDIUM Events in Malé by form, WhatsApp, phone or email.',
    ogImage: DEFAULT_OG_IMAGE,
  },
];

export function pathFor(id: PageId): string {
  return ROUTES.find((r) => r.id === id)!.path;
}

export function routeForPath(pathname: string): RouteMeta | undefined {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return ROUTES.find((r) => r.path === (normalized || '/'));
}

export function contactPath(opts: { service?: string; event?: string } = {}): string {
  const params = new URLSearchParams();
  if (opts.service) params.set('service', opts.service);
  if (opts.event) params.set('event', opts.event);
  const query = params.toString();
  return query ? `/contact?${query}` : '/contact';
}

// Section ids used by the old single-page hash navigation (e.g. links shared on Facebook)
const LEGACY_HASHES: Record<string, PageId> = {
  home: 'home',
  services: 'services',
  events: 'events',
  about: 'about',
  'info-center': 'news',
  enquiry: 'contact',
};

export function legacyHashToPath(hash: string): string | null {
  const key = hash.replace(/^#/, '');
  return Object.hasOwn(LEGACY_HASHES, key) ? pathFor(LEGACY_HASHES[key]) : null;
}

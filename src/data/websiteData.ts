import { ServiceItem, FlagshipEvent, NewsArticle, PastEvent, EventSeries } from '../types';

export const COMPANY_DETAILS = {
  name: 'MEDIUM Events Pvt Ltd',
  shortName: 'MEDIUM',
  tagline: 'Full-Suite Creative Firm & Turnkey Event Management in Maldives',
  headline: 'Creating Lasting Impressions Through Vision, Precision & Scale',
  subheadline:
    'With over 60 years of combined industry expertise, MEDIUM delivers full-suite creative solutions, analytics-driven advertising, and high-impact flagship events across the Maldives.',
  address: 'Champa Building 4, 5th Floor, Orchid Magu, K. Malé, Maldives',
  altAddress: 'H. Huba (2nd Floor), Medhuziyaaraiy Magu, Malé, Maldives',
  phone: '+960 770-1090',
  secondaryPhone: '+960 799-7974',
  officePhone: '+960 333-0020',
  whatsapp: '+960 799-7974',
  email: 'Operations@medium.mv',
  inquiryEmail: 'info@medium.mv',
  social: {
    facebook: 'https://www.facebook.com/MediumMv/',
    instagram: 'https://www.instagram.com/medium_mv/',
    linkedin: 'https://www.linkedin.com/company/mediummv/',
  },
  stats: [
    { value: '60+', label: 'Years Combined Experience', detail: 'Cumulative management team track record' },
    { value: '15+', label: 'Years Individual Leadership', detail: 'Seasoned directors in specialized domains' },
    { value: '6+', label: 'Flagship Annual Expos & Forums', detail: 'Including Maldives Marine Expo & CIF' },
    { value: '100+', label: 'Turnkey Productions', detail: 'Delivered for national associations & enterprises' },
  ],
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'events',
    title: 'Events',
    tagline: 'Events that leave a lasting impression',
    description:
      'We plan and run conferences, industry forums, exhibitions and product launches from start to finish: venue, programme, speakers, sponsors, stage and production.',
    features: [
      'Conferences, forums and workshops',
      'Exhibitions and trade expos',
      'Product launches and business events',
      'Sponsor and exhibitor management',
      'Stage, audio-visual and production',
      'Project management on the day',
    ],
    icon: 'CalendarDays',
    accentColor: '#12229D',
    stat: '9',
    statLabel: 'events hosted since 2023',
  },
  {
    id: 'advertising',
    title: 'Advertising and marketing',
    tagline: 'Advertising based on analytics and metrics',
    description:
      'Marketing for niche markets, planned around measurable results and direct revenue. For selected clients we also run long-term marketing plans.',
    features: [
      'Promotional and awareness campaigns',
      'Guerrilla marketing',
      'Long-term marketing plans',
      'Content creation',
      'Campaign measurement and reporting',
    ],
    icon: 'TrendingUp',
    accentColor: '#12229D',
    stat: '',
    statLabel: '',
  },
  {
    id: 'design',
    title: 'Design and production',
    tagline: 'Design, video and installation',
    description:
      'Design, video production, installation and application work, from business profiles and publications to video ads and event builds.',
    features: [
      'Video ads',
      'Business profiles',
      'Publishing and print',
      'Concept development',
      'Exhibition and event installations',
    ],
    icon: 'Palette',
    accentColor: '#12229D',
    stat: '',
    statLabel: '',
  },
  {
    id: 'consultancy',
    title: 'Creative consultancy',
    tagline: 'A clear route to the right solution',
    description:
      "We treat each client's challenge as a maze to solve: where you are, where you need to be, and the creative route between the two.",
    features: [
      'Concept development',
      'Brand and campaign direction',
      'Market insight for the Maldives',
      'Project planning',
    ],
    icon: 'Compass',
    accentColor: '#12229D',
    stat: '',
    statLabel: '',
  },
];

export const FLAGSHIP_EVENTS_DATA: FlagshipEvent[] = [
  {
    id: 'marine-expo',
    name: 'Maldives Marine Expo',
    tagline: 'The Official Flagship Exhibition of the Boating Industry',
    category: 'Flagship Marine Exhibition',
    year: '2025 – 2026',
    dateOrFrequency: 'Annual Showcase (February 5–8)',
    location: 'Central Park / Hulhumalé, Maldives',
    endorsements: ['National Boating Association of Maldives (NBAM)', 'Ministry of Transport'],
    description:
      'The premier marine industry exhibition of the Maldives, organized by MEDIUM on behalf of NBAM. Bringing together boat builders, engine manufacturers, water sports innovators, naval architects, and maritime service providers across the Indian Ocean.',
    highlights: [
      'Over 100+ national and international marine exhibitors',
      'Live in-water vessel trials and live demonstration zones',
      'High-level commercial deals and marine technology debuts',
      'Official endorsement and patronage by NBAM',
    ],
    attendees: '12,000+ Trade & Public Visitors',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    role: 'Turnkey Event Organizer & Producer',
  },
  {
    id: 'cif-2026',
    name: 'Construction Industry Forum (CIF 2026)',
    tagline: 'Driving Growth, Sustainability & Built Environment Innovation',
    category: 'National Industry Forum',
    year: '2026',
    dateOrFrequency: 'August 18, 2026',
    location: 'Grand Parkside, One Central Park, Hulhumalé',
    endorsements: ['Maldives National Association of Construction Industry (MNACI)', 'Ooredoo Maldives (Exclusive Platinum Sponsor)'],
    description:
      'An annual gathering of high-level decision makers of the building and construction industry from government and private sectors. Industry leaders and key stakeholders identify the crucial issues facing the Maldives construction industry, present solutions and direct its future. Held every year since 2023 — CIF 2026 is the 4th edition.',
    highlights: [
      '4th annual edition — previous editions in 2023, 2024 and 2025',
      'High-level panels with government and private-sector decision makers',
      'Recognition certificates presented to industry partners and speakers',
      'Ooredoo Maldives signed on as Exclusive Platinum Sponsor (July 2026)',
    ],
    attendees: '200+ RSVPs on Facebook for CIF 2025',
    image: '/images/fb/cif-2025.jpg',
    role: 'Organizer (www.cif.mv)',
  },
  {
    id: 'mmif',
    name: 'Maldives Marine Industry Forum (MMIF)',
    tagline: 'Shaping the Future of the Maldives Marine Industry',
    category: 'Policy & Maritime Forum',
    year: '3rd Edition (2025)',
    dateOrFrequency: 'Annual Forum · 1 July 2025',
    location: 'JEN Malé Maldives by Shangri-La, Malé',
    endorsements: ['National Boating Association of Maldives (NBAM)', 'Indian Ocean Divers Association (IODA)'],
    description:
      'An annual gathering of high-level decision makers of the marine industry from government and private sectors. Industry leaders, decision makers and key stakeholders come together to identify the crucial and fundamental issues facing the marine industry, present solutions and raise awareness.',
    highlights: [
      'Three consecutive editions — 2023, 2024 and 2025 at JEN Malé',
      'Panel discussions with maritime authorities, operators and insurers',
      'Partners and sponsors from across the Maldivian marine sector',
    ],
    attendees: '99 RSVPs on Facebook for MMIF 2023',
    image: '/images/fb/mmif-2025.jpg',
    role: 'Organizer (www.mmif.mv)',
  },
  {
    id: 'build-expo',
    name: 'Build Expo',
    tagline: 'The Official Exhibition of MNACI',
    category: 'Construction Exhibition',
    year: '2025',
    dateOrFrequency: '24 – 27 April 2025 · 16:00 – 22:00',
    location: 'Central Park, Hulhumalé',
    endorsements: ['Maldives National Association of Construction Industry (MNACI)'],
    description:
      'The official exhibition of the Maldives National Association of Construction Industry (MNACI). Build Expo features an exhibition and equipment display area, stage activities, networking sessions, product launches and entertainment — a strong opportunity to connect with prospective customers and gain industry recognition.',
    highlights: [
      'Exhibition and heavy-equipment display area',
      'Stage activities and product launches',
      'Networking sessions for contractors, suppliers and developers',
      'Four days of evening entertainment at Hulhumalé Central Park',
    ],
    attendees: '195 RSVPs on Facebook for Build Expo 2025',
    image: '/images/fb/build-expo-2025.jpg',
    role: 'Event Organizer',
  },
  {
    id: 'aviation-forum',
    name: 'Aviation Forum – Connecting Maldives (AF)',
    tagline: 'Reshape the Aviation Industry of Maldives, via Stakeholder Dialogue',
    category: 'Aviation Summit',
    year: '2024 · 2026',
    dateOrFrequency: 'Latest edition: 12 May 2026',
    location: 'Hotel JEN Malé Maldives by Shangri-La',
    endorsements: ['SITA (Sponsor, AF 2026)'],
    description:
      "Join the Maldives' most influential aviation leaders. This premier summit unites high-level government officials and private sector pioneers to collaborate, innovate and redefine the future of the industry — generating actionable solutions and directing the strategic trajectory of Maldivian aviation.",
    highlights: [
      'Editions held in April 2024 and May 2026 at JEN Malé',
      'Dialogue between government officials and private-sector operators',
      'AF 2026 sponsored by SITA',
    ],
    attendees: '223 RSVPs on Facebook for AF 2024',
    image: '/images/fb/aviation-forum-2026.jpg',
    role: 'Organizer (www.aviationforum.mv)',
  },
  {
    id: 'hosco',
    name: 'Hotel Supply Conference (HOSCO)',
    tagline: 'The Authoritative Hospitality Procurement & Resort Supply Summit',
    category: 'Procurement Conference',
    year: 'Annual Convention',
    dateOrFrequency: 'Annual Hospitality Forum',
    location: 'Malé / Resort Convention Centers',
    endorsements: ['Maldives Tourism Industry Partners', 'Resort Purchase Managers Alliance'],
    description:
      'Connecting global luxury suppliers with general managers, executive chefs, procurement heads, and chief engineers representing world-renowned Maldivian five-star and ultra-luxury island resorts.',
    highlights: [
      'Exclusive 1-on-1 procurement matchmaking meetings',
      'Sustainability and zero-waste resort supply chain workshops',
      'Curated showcase of high-end culinary and amenity brands',
    ],
    attendees: '400+ Resort Procurement Directors',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    role: 'Summit Producer & Delegate Director',
  },
];

// Events hosted by MEDIUM, as listed on facebook.com/MediumMv (Events → Past)
export const PAST_EVENTS_DATA: PastEvent[] = [
  {
    id: 'af-2026',
    name: 'Aviation Forum 2026',
    series: 'Aviation Forum',
    date: 'Tue, 12 May 2026',
    isoDate: '2026-05-12',
    venue: 'JEN Malé Maldives by Shangri-La, Malé',
    description:
      "The Maldives' most influential aviation leaders — government officials and private-sector pioneers — came together to redefine the future of Maldivian aviation. Sponsored by SITA.",
    responded: 16,
    image: '/images/fb/aviation-forum-2026.jpg',
    facebookUrl: 'https://www.facebook.com/events/1592477385417941/',
  },
  {
    id: 'cif-2025',
    name: 'Construction Industry Forum 2025',
    series: 'Construction Industry Forum',
    date: 'Tue, 2 Sep 2025',
    isoDate: '2025-09-02',
    venue: 'JEN Malé Maldives by Shangri-La, Malé',
    description:
      'High-level decision makers of the building and construction industry from government and private sectors exchanged perspectives to shape the industry moving forward.',
    responded: 200,
    image: '/images/fb/cif-2025.jpg',
    facebookUrl: 'https://www.facebook.com/events/589833897305904/',
  },
  {
    id: 'mmif-2025',
    name: 'Maldives Marine Industry Forum 2025',
    series: 'Marine Industry Forum',
    date: 'Tue, 1 Jul 2025',
    isoDate: '2025-07-01',
    venue: 'JEN Malé Maldives by Shangri-La, Malé',
    description:
      'Marine industry leaders, decision makers and key stakeholders identified the fundamental issues facing the marine industry, presented solutions and raised awareness.',
    responded: 17,
    image: '/images/fb/mmif-2025.jpg',
    facebookUrl: 'https://www.facebook.com/events/1143988937284984/',
  },
  {
    id: 'build-expo-2025',
    name: 'Build Expo 2025',
    series: 'Build Expo',
    date: '24 – 27 Apr 2025',
    isoDate: '2025-04-24',
    venue: "Hulhumalé Central Park, Hulhumalé",
    description:
      'The official exhibition of MNACI — four days of exhibition and equipment displays, stage activities, networking sessions, product launches and entertainment.',
    responded: 195,
    image: '/images/fb/build-expo-2025.jpg',
    facebookUrl: 'https://www.facebook.com/events/402937255637143/',
  },
  {
    id: 'cif-2024',
    name: 'Construction Industry Forum 2024',
    series: 'Construction Industry Forum',
    date: 'Mon, 19 Aug 2024',
    isoDate: '2024-08-19',
    venue: 'Manhattan Business Hotel, Malé',
    description:
      'The second annual gathering of the construction industry’s decision makers, presenting solutions to the crucial issues facing the Maldives building sector.',
    responded: 65,
    image: '/images/fb/cif-2024.jpg',
    facebookUrl: 'https://www.facebook.com/events/1938179463291667/',
  },
  {
    id: 'mmif-2024',
    name: 'Maldives Marine Industry Forum 2024',
    series: 'Marine Industry Forum',
    date: 'Sat, 6 Jul 2024',
    isoDate: '2024-07-06',
    venue: 'JEN Malé Maldives by Shangri-La, Malé',
    description:
      'The second edition of MMIF brought government and private-sector marine leaders together to direct the future of the Maldives marine industry.',
    responded: 44,
    image: '/images/fb/mmif-2024.jpg',
    facebookUrl: 'https://www.facebook.com/events/784538483536193/',
  },
  {
    id: 'af-2024',
    name: 'Aviation Forum 2024',
    series: 'Aviation Forum',
    date: 'Sat, 27 Apr 2024',
    isoDate: '2024-04-27',
    venue: 'JEN Malé Maldives by Shangri-La, Malé',
    description:
      'The inaugural Aviation Forum gathered key stakeholders of the aviation industry from government and private sectors to present solutions and direct the future of Maldivian aviation.',
    responded: 223,
    image: '/images/fb/aviation-forum-2024.jpg',
    facebookUrl: 'https://www.facebook.com/events/3233118503650348/',
  },
  {
    id: 'cif-2023',
    name: 'Construction Industry Forum 2023',
    series: 'Construction Industry Forum',
    date: 'Sat, 12 Aug 2023',
    isoDate: '2023-08-12',
    venue: 'Meerumaa Hall, Malé',
    description:
      'The first Construction Industry Forum — a high-level dialogue and business networking platform for the construction industry of the Maldives.',
    responded: 18,
    image: '/images/fb/cif-2023.jpg',
    facebookUrl: 'https://www.facebook.com/events/665198652342686/',
  },
  {
    id: 'mmif-2023',
    name: 'Maldives Marine Industry Forum 2023',
    series: 'Marine Industry Forum',
    date: 'Sat, 27 May 2023',
    isoDate: '2023-05-27',
    venue: 'JEN Malé Maldives by Shangri-La, Malé',
    description:
      'The first Maldives Marine Industry Forum, an annual gathering of high-level decision makers of the marine industry from government and private sectors.',
    responded: 99,
    image: '/images/fb/mmif-2023.jpg',
    facebookUrl: 'https://www.facebook.com/events/1290445591543095/',
  },
];

export const NEWS_ARTICLES_DATA: NewsArticle[] = [
  {
    id: 'ooredoo-cif-2026-platinum',
    title: 'Ooredoo Maldives Signs On as Exclusive Platinum Sponsor of CIF 2026',
    category: 'Press Releases',
    date: '6 July 2026',
    readTime: '2 min read',
    summary:
      'Ooredoo Maldives has officially signed on as Exclusive Platinum Sponsor for the Construction Industry Forum – CIF 2026, held on 18 August 2026 at Grand Parkside, One Central Park, Hulhumalé.',
    fullContent: [
      'We are proud to announce that Ooredoo Maldives has officially signed on as Exclusive Platinum Sponsor for the Construction Industry Forum – CIF 2026, scheduled to be held on 18 August 2026 at Grand Parkside, One Central Park, Hulhumalé.',
      'Construction Industry Forum is a high-level dialogue and business networking platform for the construction industry of the Maldives.',
      'The official signing took place between Mr. Rajesh Mehta, Chief Business Officer of Ooredoo Maldives, and Mr. Sham Mohamed, Director of Medium Events Pvt Ltd.',
      'CIF 2026 is proudly endorsed by the Maldives National Association of Construction Industry (www.mnaci.org) and organized by Medium Events Pvt Ltd.',
    ],
    tags: ['CIF 2026', 'Ooredoo Maldives', 'MNACI', 'Sponsorship'],
    image: '/images/fb/ooredoo-cif-2026-signing.jpg',
  },
  {
    id: 'aviation-forum-2026',
    title: 'Aviation Forum 2026 Convenes Maldivian Aviation Leaders at Hotel JEN Malé',
    category: 'Expos & Forums',
    date: '12 May 2026',
    readTime: '2 min read',
    summary:
      'The second Aviation Forum – Connecting Maldives, sponsored by SITA, united government officials and private-sector pioneers to reshape the aviation industry through stakeholder dialogue.',
    fullContent: [
      "Aviation Forum 2026 brought together the Maldives' most influential aviation leaders on 12 May 2026 at Hotel JEN Malé Maldives by Shangri-La.",
      'This premier summit unites high-level government officials and private-sector pioneers to collaborate, innovate and redefine the future of the industry — generating actionable solutions and directing the strategic trajectory of Maldivian aviation.',
      'The 2026 edition was sponsored by SITA. Aviation Forum is organized by Medium Events Pvt Ltd — for more information visit www.aviationforum.mv, call +960 770-1090 or email info@medium.mv.',
    ],
    tags: ['Aviation Forum', 'SITA', 'JEN Malé', 'Connecting Maldives'],
    image: '/images/fb/aviation-forum-2026.jpg',
  },
];

export const CLIENT_PARTNERS = [
  { name: 'National Boating Association of Maldives (NBAM)', role: 'Flagship Event Partner' },
  { name: 'MNACI (Maldives National Association of Construction Industry)', role: 'Endorsing Association' },
  { name: 'Ooredoo Maldives', role: 'CIF 2026 Exclusive Platinum Sponsor' },
  { name: 'SITA', role: 'Aviation Forum 2026 Sponsor' },
  { name: 'Maldives Publications Pvt Ltd', role: 'Publishing Partner' },
  { name: 'Indian Ocean Divers Association (IODA)', role: 'Endorsing Body' },
  { name: 'Ministry of Transport & Civil Aviation', role: 'Governmental Endorsement' },
];

// Event series MEDIUM organises. Facts from the series' Facebook events, posts and banners.
export const EVENT_SERIES: EventSeries[] = [
  {
    slug: 'construction-industry-forum',
    name: 'Construction Industry Forum',
    shortName: 'CIF',
    series: 'Construction Industry Forum',
    tagline: 'High-level dialogue and business networking for the Maldives construction industry.',
    description: [
      'The Construction Industry Forum is an annual gathering of decision makers from the government and private sectors of the building and construction industry.',
      'Industry leaders and key stakeholders identify the fundamental issues facing the industry, present solutions and raise awareness, to shape where Maldivian construction goes next.',
    ],
    website: 'https://cif.mv',
    endorsement: 'Endorsed by MNACI',
    audience: 'Government and private-sector decision makers in building and construction',
    usualVenue: 'Malé and Hulhumalé',
    usualMonth: 'August–September',
    partners: [
      { name: 'MNACI', role: 'Endorsing association' },
      { name: 'Ooredoo Maldives', role: 'Exclusive Platinum Sponsor, CIF 2026' },
    ],
  },
  {
    slug: 'marine-industry-forum',
    name: 'Maldives Marine Industry Forum',
    shortName: 'MMIF',
    series: 'Marine Industry Forum',
    tagline: 'Where the Maldives marine industry meets to plan its future.',
    description: [
      'The Maldives Marine Industry Forum is an annual gathering of decision makers from the government and private sectors of the marine industry.',
      'Industry leaders and key stakeholders identify the fundamental issues facing the marine industry, present solutions and raise awareness.',
    ],
    website: 'https://mmif.mv',
    audience: 'Marine industry leaders from government and the private sector',
    usualVenue: 'JEN Malé Maldives by Shangri-La',
    usualMonth: 'May–July',
    partners: [],
  },
  {
    slug: 'aviation-forum',
    name: 'Aviation Forum – Connecting Maldives',
    shortName: 'Aviation Forum',
    series: 'Aviation Forum',
    tagline: 'Reshaping the aviation industry of the Maldives through stakeholder dialogue.',
    description: [
      "The Aviation Forum brings together the Maldives' most influential aviation leaders, uniting senior government officials and private-sector pioneers.",
      'Its purpose is practical: to agree actionable solutions and set the strategic direction of Maldivian aviation.',
    ],
    website: 'https://aviationforum.mv',
    audience: 'Government officials and private-sector aviation leaders',
    usualVenue: 'JEN Malé Maldives by Shangri-La',
    usualMonth: 'April–May',
    partners: [{ name: 'SITA', role: 'Sponsor, Aviation Forum 2026' }],
  },
  {
    slug: 'build-expo',
    name: 'Build Expo',
    shortName: 'Build Expo',
    series: 'Build Expo',
    tagline: 'The official exhibition of the Maldives National Association of Construction Industry.',
    description: [
      'Build Expo is a four-day exhibition at Central Park, Hulhumalé, with an exhibition and equipment display area, stage activities, networking sessions, product launches and entertainment.',
      'It is a place to meet prospective customers and gain recognition across the construction industry.',
    ],
    endorsement: 'Official exhibition of MNACI',
    audience: 'Contractors, suppliers, developers and the public',
    usualVenue: 'Central Park, Hulhumalé',
    usualMonth: 'April',
    partners: [{ name: 'MNACI', role: 'Official exhibition partner' }],
    ctaSecondary: 'Book a stand',
  },
];

export function editionsFor(series: PastEvent['series']): PastEvent[] {
  return PAST_EVENTS_DATA.filter((e) => e.series === series).sort((a, b) => b.isoDate.localeCompare(a.isoDate));
}

export function seriesBySlug(slug: string): EventSeries | undefined {
  return EVENT_SERIES.find((s) => s.slug === slug);
}

export const VERIFIED_PARTNERS = [
  { name: 'MNACI', role: 'Endorsing association, CIF and Build Expo' },
  { name: 'Ooredoo Maldives', role: 'Exclusive Platinum Sponsor, CIF 2026' },
  { name: 'SITA', role: 'Sponsor, Aviation Forum 2026' },
];

const firstEventYear = PAST_EVENTS_DATA.map((e) => e.isoDate.slice(0, 4)).sort()[0];

export const SITE_STATS = [
  { value: String(PAST_EVENTS_DATA.length), label: 'events hosted' },
  { value: String(EVENT_SERIES.length), label: 'event series' },
  { value: firstEventYear, label: 'first forum' },
  { value: '60+', label: 'years combined experience' },
];

// Enquiry types offered by the contact form; ids are used in /contact?service=<id>
export const SERVICE_OPTIONS = [
  { id: 'sponsorship', label: 'Sponsorship or exhibition stand' },
  ...SERVICES_DATA.map((service) => ({ id: service.id, label: service.title })),
  { id: 'general', label: 'General enquiry' },
];

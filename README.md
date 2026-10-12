# MEDIUM Events website

Website for MEDIUM Events Pvt Ltd (Malé, Maldives), built with React, Vite and Tailwind.

## Run locally

```bash
npm install
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm test` | Unit and component tests (Vitest) |
| `npm run lint` | TypeScript type check |
| `npm run build` | Production build: pre-renders every page, writes `sitemap.xml` and `robots.txt`, then checks every page has its title, description, canonical link and share image |
| `npm run preview` | Serves the production build from `dist/` |

Pages are listed once in `src/routes.ts`. Adding a page there adds it to the router, the pre-rendered output, the sitemap and the build check.

## Content

- All site content lives in `src/data/websiteData.ts`.
- **Event series pages** (`/events/<slug>`) are generated from `EVENT_SERIES`; each past event in `PAST_EVENTS_DATA` belongs to a series. Adding a new edition (e.g. CIF 2027) is one new entry in `PAST_EVENTS_DATA` plus its banner in `public/images/fb/` — the series page, Home, Events page, structured data and stats update automatically.
- Only verified facts are used. See `docs/content-to-confirm.md` for removed claims awaiting confirmation; `src/contentGuard.test.tsx` blocks them from returning.
- Design: colours are defined once in `src/design/palette.ts` (mirrored in `src/index.css`) and checked for WCAG AA contrast by tests; pages are built from the shared components in `src/components/ui/`.

## Deploying and configuration

1. Copy `.env.example` to `.env` and fill in the values below.
2. Run `npm run build`.
3. Upload the contents of `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, cPanel/Apache, etc.). Every page is a real HTML file, so no server is needed.
   - **Do not add a single-page-app rewrite** (e.g. "/* → /index.html"). Unknown addresses should get `404.html`, which Netlify, Vercel, Cloudflare Pages and GitHub Pages serve automatically.
   - **Apache / cPanel:** the included `.htaccess` serves `/contact` from `contact.html` instead of redirecting to `/contact/`, and serves `404.html` for unknown addresses. Make sure hidden files are uploaded and `mod_rewrite` is enabled. After launch, check that `https://medium.mv/contact` loads without a redirect.

| Variable | Purpose | If empty |
|---|---|---|
| `VITE_SITE_URL` | Live address, e.g. `https://medium.mv`. Used for canonical links, share previews and the sitemap. | Defaults to `https://medium.mv` |
| `VITE_WEB3FORMS_KEY` | Access key from [web3forms.com](https://web3forms.com). Enquiries are emailed to the address the key was created with. | The enquiry form sends via WhatsApp or email instead |
| `VITE_GA_ID` | Google Analytics 4 measurement ID (`G-XXXXXXX`). | No analytics are loaded |

### One-time setup for MEDIUM

1. **Enquiry emails:** sign up at web3forms.com with info@medium.mv and send the access key to the developer (it is safe to include in the website).
2. **Analytics:** create a Google Analytics 4 property and send the measurement ID. In the web data stream, open *Enhanced measurement* settings and turn **off** "Page changes based on browser history events" — the site reports page views itself, and leaving it on double-counts them. Tracked actions: `generate_lead` (enquiry delivered), `whatsapp_click`, `contact_click` (phone/email links), `facebook_event_click`.
3. **Google Search:** after launch, add the site in [Google Search Console](https://search.google.com/search-console), verify ownership and submit `https://medium.mv/sitemap.xml`.
4. **Social previews:** paste each page URL into the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to confirm the preview image and text.

The WhatsApp number is set once in `src/data/websiteData.ts` (`COMPANY_DETAILS.whatsapp`).

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

## Deploying and configuration

1. Copy `.env.example` to `.env` and fill in the values below.
2. Run `npm run build`.
3. Upload the contents of `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, cPanel/Apache, etc.). Every page is a real HTML file, so no server or rewrite rules are needed.

| Variable | Purpose | If empty |
|---|---|---|
| `VITE_SITE_URL` | Live address, e.g. `https://medium.mv`. Used for canonical links, share previews and the sitemap. | Defaults to `https://medium.mv` |
| `VITE_WEB3FORMS_KEY` | Access key from [web3forms.com](https://web3forms.com). Enquiries are emailed to the address the key was created with. | The enquiry form sends via WhatsApp or email instead |
| `VITE_GA_ID` | Google Analytics 4 measurement ID (`G-XXXXXXX`). | No analytics are loaded |

### One-time setup for MEDIUM

1. **Enquiry emails:** sign up at web3forms.com with info@medium.mv and send the access key to the developer (it is safe to include in the website).
2. **Analytics:** create a Google Analytics 4 property and send the measurement ID. Tracked actions: `generate_lead` (enquiry delivered), `whatsapp_click`, `contact_click` (phone/email links), `facebook_event_click`.
3. **Google Search:** after launch, add the site in [Google Search Console](https://search.google.com/search-console), verify ownership and submit `https://medium.mv/sitemap.xml`.
4. **Social previews:** paste each page URL into the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to confirm the preview image and text.

The WhatsApp number is set once in `src/data/websiteData.ts` (`COMPANY_DETAILS.whatsapp`).

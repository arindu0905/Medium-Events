// Deployment settings, read from VITE_* env vars at build time (see .env.example)

const DEFAULT_SITE_URL = 'https://medium.mv';

export function normalizeSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();
  return (value || DEFAULT_SITE_URL).replace(/\/+$/, '');
}

const optional = (value: string | undefined) => value?.trim() || undefined;

export const SITE_URL = normalizeSiteUrl(import.meta.env.VITE_SITE_URL);
export const WEB3FORMS_KEY = optional(import.meta.env.VITE_WEB3FORMS_KEY);
export const GA_ID = optional(import.meta.env.VITE_GA_ID);

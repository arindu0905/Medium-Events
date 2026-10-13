// Date display in Maldives time, shared by every section.

const DAY = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' });

// "2025-09-02" → "2 Sep 2025" (a calendar date, so no time-zone shift)
export function formatDay(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return DAY.format(new Date(Date.UTC(y, m - 1, d)));
}

const TIME = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Indian/Maldives',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

// "12 Oct 2026, 09:30" in Maldives time
export function formatWhen(iso: string): string {
  const parts = Object.fromEntries(TIME.formatToParts(new Date(iso)).map((p) => [p.type, p.value]));
  return `${parts.day} ${parts.month} ${parts.year}, ${parts.hour}:${parts.minute}`;
}

// Today's date in the Maldives as YYYY-MM-DD
export function maldivesToday(now = new Date()): string {
  return new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

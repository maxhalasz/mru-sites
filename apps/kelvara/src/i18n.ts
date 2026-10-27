export type Lang = 'no' | 'en';

export const pages = [
  'home', 'about', 'operations', 'hse', 'sustainability', 'careers', 'news', 'suppliers', 'contact',
  'privacy', 'cookies', 'transparency',
] as const;
export type PageKey = (typeof pages)[number];

export const paths: Record<Lang, Record<PageKey, string>> = {
  no: {
    home: '/', about: '/om-oss/', operations: '/virksomhet/', hse: '/hms/', sustainability: '/baerekraft/',
    careers: '/karriere/', news: '/nyheter/', suppliers: '/leverandorer/', contact: '/kontakt/',
    privacy: '/personvern/', cookies: '/informasjonskapsler/', transparency: '/apenhetsloven/',
  },
  en: {
    home: '/en/', about: '/en/about/', operations: '/en/operations/', hse: '/en/hse/', sustainability: '/en/sustainability/',
    careers: '/en/careers/', news: '/en/news/', suppliers: '/en/suppliers/', contact: '/en/contact/',
    privacy: '/en/privacy/', cookies: '/en/cookies/', transparency: '/en/transparency-act/',
  },
};

export const navKeys: PageKey[] = ['about', 'operations', 'hse', 'sustainability', 'careers', 'news', 'suppliers', 'contact'];

export const label: Record<Lang, Record<PageKey, string>> = {
  no: {
    home: 'Forside', about: 'Om oss', operations: 'Virksomhet', hse: 'HMS', sustainability: 'Bærekraft',
    careers: 'Karriere', news: 'Nyheter', suppliers: 'Leverandører', contact: 'Kontakt',
    privacy: 'Personvern', cookies: 'Informasjonskapsler', transparency: 'Åpenhetsloven',
  },
  en: {
    home: 'Home', about: 'About', operations: 'Operations', hse: 'HSE', sustainability: 'Sustainability',
    careers: 'Careers', news: 'News', suppliers: 'Suppliers', contact: 'Contact',
    privacy: 'Privacy', cookies: 'Cookies', transparency: 'Transparency Act',
  },
};

export const ui = {
  no: {
    skip: 'Hopp til hovedinnhold', menu: 'Meny', home: 'Kelvara, forside',
    readMore: 'Les mer', allNews: 'Alle nyheter', back: 'Tilbake til nyheter',
    postal: 'Postadresse', visit: 'Besøksadresse', base: 'Forsyningsbase',
    rights: 'Alle rettigheter forbeholdt.', orgnr: 'Org.nr.',
    cookieText: 'Vi bruker nødvendige informasjonskapsler for at nettstedet skal fungere. Med ditt samtykke bruker vi også valgfrie informasjonskapsler for å forstå hvordan nettstedet brukes. Du kan endre valget når som helst.',
    essential: 'Bare nødvendige', acceptAll: 'Godta alle', cookieSettings: 'Innstillinger for informasjonskapsler',
    download: 'Last ned PDF', published: 'Publisert', updated: 'Sist oppdatert',
  },
  en: {
    skip: 'Skip to main content', menu: 'Menu', home: 'Kelvara, home',
    readMore: 'Read more', allNews: 'All news', back: 'Back to news',
    postal: 'Postal address', visit: 'Visiting address', base: 'Supply base',
    rights: 'All rights reserved.', orgnr: 'Org. no.',
    cookieText: 'We use essential cookies to make this website work. With your consent we also use optional cookies to understand how the site is used. You can change your choice at any time.',
    essential: 'Essential only', acceptAll: 'Accept all', cookieSettings: 'Cookie settings',
    download: 'Download PDF', published: 'Published', updated: 'Last updated',
  },
} as const;

export function dateFmt(d: Date, lang: Lang) {
  return d.toLocaleDateString(lang === 'no' ? 'nb-NO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

// Nothing dated after 19 October 2028 is shown.
export const SITE_DATE = new Date('2028-10-19T23:59:59Z');

// An item is live when it is published and dated on or before the site date, or when it is marked
// "scheduled". Scheduled items are on the page but stay hidden until the shared date reaches them.
export const isLive = (d: { published: boolean; date: Date; scheduled?: boolean }) => d.published && (d.date <= SITE_DATE || !!d.scheduled);
export const isFuture = (d: Date) => d > SITE_DATE;
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

// ---- open positions -------------------------------------------------------------------------
// A listing can have more than one position (data.positions). Counts and sentences are built from the
// number of open positions, and control.js rewrites them with the same wording when the shared state
// changes (a position filled, a different date).
type JobLike = { data: { reference: string; date: Date; positions?: number } };
export const positionsOf = (j: JobLike) => j.data.positions ?? 1;
export const openPositions = (jobs: JobLike[]) => jobs.filter((j) => !isFuture(j.data.date)).reduce((n, j) => n + positionsOf(j), 0);
export const jobsAttr = (jobs: JobLike[]) => jobs.map((j) => `${j.data.reference}:${isoDay(j.data.date)}:${positionsOf(j)}`).join(',');
export const slotsText = (n: number, lang: Lang) => (n > 1 ? ` · ${n} ${lang === 'no' ? 'stillinger' : 'positions'}` : '');

const numNo = ['ingen', 'én', 'to', 'tre', 'fire', 'fem', 'seks', 'sju', 'åtte', 'ni', 'ti'];
const numEn = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export function vacancyText(kind: 'top' | 'headline' | 'count' | 'now' | 'lead', lang: Lang, n: number) {
  const no = lang === 'no';
  const w = (no ? numNo : numEn)[n] ?? String(n);
  if (kind === 'top') return no ? (n === 0 ? 'Ingen ledige stillinger' : n + (n === 1 ? ' ledig stilling' : ' ledige stillinger')) : (n === 0 ? 'No open positions' : n + (n === 1 ? ' open position' : ' open positions'));
  if (kind === 'headline') return no ? (n === 0 ? 'Ingen ledige stillinger' : cap(n === 1 ? 'én ledig stilling' : w + ' ledige stillinger') + ' til vintersesongen') : (n === 0 ? 'No open positions' : cap(w) + (n === 1 ? ' open position' : ' open positions') + ' for the winter season');
  if (kind === 'count') return no ? (n === 0 ? 'Ingen ledige stillinger' : n + (n === 1 ? ' stilling' : ' stillinger') + ' til vintersesongen') : (n === 0 ? 'No open positions' : n + (n === 1 ? ' position' : ' positions') + ' for the winter season');
  if (kind === 'now') return no ? (n === 0 ? 'Akkurat nå er ingen stillinger ledige på Ødemark A.' : n === 1 ? 'Akkurat nå er én stilling ledig på Ødemark A.' : `Akkurat nå er ${w} stillinger ledige på Ødemark A.`) : (n === 0 ? 'Right now no positions are open on Ødemark A.' : n === 1 ? 'Right now one position is open on Ødemark A.' : `Right now ${w} positions are open on Ødemark A.`);
  if (no) return n === 0 ? 'Bemanningen for vinteren 2028/29 er komplett. Det er ingen ledige stillinger på Ødemark A akkurat nå.'
    : `Bemanningen for vinteren 2028/29 er nesten komplett. ${n === 1 ? 'Dette er den siste ledige stillingen' : `Disse ${w} er de siste ledige stillingene`} på Ødemark A. Vi leser søknadene etter hvert som de kommer og kaller inn til intervju med en gang.`;
  return n === 0 ? 'The crew for winter 2028/29 is complete. There are no open positions on Ødemark A right now.'
    : `The crew for winter 2028/29 is almost complete. ${n === 1 ? 'This is the last open position' : `These ${w} are the last open positions`} on Ødemark A. We read applications as they come in and call people in for interviews straight away.`;
}

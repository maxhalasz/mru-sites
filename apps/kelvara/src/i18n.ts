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

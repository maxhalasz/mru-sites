import { getCollection, type CollectionKey } from 'astro:content';

// The site shows the state of mid-October 2028. Nothing dated later is shown as published news.
export const SITE_DATE = new Date('2028-10-19T23:59:59Z');

export async function published<K extends CollectionKey>(name: K) {
  const items = await getCollection(name, (e: any) => e.data.published !== false);
  return items.filter((e: any) => !e.data.date || e.data.date <= SITE_DATE || e.data.scheduled);
}

// Scheduled items are on the page but stay hidden until the shared date reaches them.
export const isFuture = (d: Date) => d > SITE_DATE;
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

export const longDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const shortDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

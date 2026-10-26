import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const md = (dir: string) => glob({ pattern: '**/*.md', base: `./src/content/${dir}` });
const published = z.boolean().default(true);

export const collections = {
  news: defineCollection({
    loader: md('news'),
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      published,
      category: z.enum(['Corporate', 'Clinical', 'Products', 'Investors', 'Science']),
      scheduled: z.boolean().optional(),
      summary: z.string(),
    }),
  }),
  products: defineCollection({
    loader: md('products'),
    schema: z.object({
      name: z.string(),
      generic: z.string(),
      drugClass: z.string(),
      indication: z.string(),
      approved: z.number(),
      kind: z.enum(['Medicine', 'Medical device', 'Digital platform']),
      order: z.number().default(0),
      published,
      leaflet: z.string().optional(),
      tagline: z.string(),
      how: z.string(),
      safety: z.array(z.string()),
      clinical: z.array(z.string()),
    }),
  }),
  pipeline: defineCollection({
    loader: md('pipeline'),
    schema: z.object({
      code: z.string(),
      generic: z.string().optional(),
      area: z.enum(['Sleep & Circadian Health', 'Memory & Cognition', 'Neurodiagnostics']),
      phase: z.enum(['I', 'II', 'III', 'Registration', 'Discontinued']),
      published,
      order: z.number().default(0),
      summary: z.string(),
      note: z.string().optional(),
    }),
  }),
  trials: defineCollection({
    loader: md('trials'),
    schema: z.object({
      id: z.string(),
      title: z.string(),
      phase: z.string(),
      status: z.enum(['Recruiting', 'Active, not recruiting', 'By invitation', 'Completed']),
      site: z.string().optional(),
      start: z.string().optional(),
      order: z.number().default(0),
      published,
      summary: z.string(),
    }),
  }),
  leadership: defineCollection({
    loader: md('leadership'),
    schema: z.object({
      name: z.string(),
      role: z.string(),
      group: z.enum(['executive', 'board', 'extended']),
      order: z.number().default(0),
      published,
    }),
  }),
  jobs: defineCollection({
    loader: md('jobs'),
    schema: z.object({
      title: z.string(),
      location: z.string(),
      team: z.string(),
      date: z.coerce.date(),
      published,
      reference: z.string(),
    }),
  }),
  reports: defineCollection({
    loader: md('reports'),
    schema: z.object({
      title: z.string(),
      kind: z.enum(['Annual report', 'Half-year report', 'Presentation', 'Governance']),
      date: z.coerce.date(),
      file: z.string().optional(),
      published,
    }),
  }),
  publications: defineCollection({
    loader: md('publications'),
    schema: z.object({
      title: z.string(),
      authors: z.string(),
      venue: z.string(),
      year: z.number(),
      kind: z.enum(['Paper', 'Poster']),
      file: z.string().optional(),
      published,
    }),
  }),
};

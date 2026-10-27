import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const yml = (dir: string) => glob({ pattern: '**/*.yml', base: `./src/content/${dir}` });
const published = z.boolean().default(true);

export const collections = {
  news: defineCollection({
    loader: yml('news'),
    schema: z.object({
      date: z.coerce.date(),
      published,
      scheduled: z.boolean().optional(),
      title_no: z.string(),
      title_en: z.string(),
      summary_no: z.string(),
      summary_en: z.string(),
      body_no: z.string(),
      body_en: z.string(),
    }),
  }),
  testimonials: defineCollection({
    loader: yml('testimonials'),
    schema: z.object({
      name: z.string(),
      order: z.number().default(0),
      published,
      role_no: z.string(),
      role_en: z.string(),
      quote_no: z.string(),
      quote_en: z.string(),
    }),
  }),
  jobs: defineCollection({
    loader: yml('jobs'),
    schema: z.object({
      reference: z.string(),
      date: z.coerce.date(),
      published,
      scheduled: z.boolean().optional(),
      order: z.number().default(0),
      positions: z.number().int().min(1).default(1),
      location: z.string(),
      title_no: z.string(),
      title_en: z.string(),
      subtitle_no: z.string(),
      subtitle_en: z.string(),
      summary_no: z.string(),
      summary_en: z.string(),
      rotation_no: z.string(),
      rotation_en: z.string(),
      requirements_no: z.string(),
      requirements_en: z.string(),
    }),
  }),
  leadership: defineCollection({
    loader: yml('leadership'),
    schema: z.object({
      name: z.string(),
      group: z.enum(['management', 'board']),
      order: z.number().default(0),
      published,
      role_no: z.string(),
      role_en: z.string(),
    }),
  }),
  documents: defineCollection({
    loader: yml('documents'),
    schema: z.object({
      date: z.coerce.date(),
      published,
      scheduled: z.boolean().optional(),
      title_no: z.string(),
      title_en: z.string(),
      file_no: z.string(),
      file_en: z.string(),
    }),
  }),
};

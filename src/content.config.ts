import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Yazılar: src/content/posts/tr/*.md ve src/content/posts/en/*.md
// Dil klasörden, adres dosya adından gelir. İki dildeki aynı yazıyı translationKey eşleştirir.
const posts = defineCollection({
  loader: glob({ pattern: '{tr,en}/**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };

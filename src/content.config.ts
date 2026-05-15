/**
 * Astro content collections — typed schemas for MDX/Markdown content
 * under `src/content/`.
 *
 * The `writing` collection backs both the home Writing card and the
 * /writing index + post pages. Each post lives at
 * `src/content/writing/<id>.mdx` with the frontmatter validated against
 * the Zod schema below.
 */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    /** Post title — appears in cards and the page <title>. */
    title: z.string(),
    /** One-sentence summary — shown beneath the title in lists. */
    description: z.string(),
    /** Publication date; ISO string in frontmatter, coerced to Date. */
    publishDate: z.coerce.date(),
    /** Drafts are filtered out of listings but reachable by URL. */
    draft: z.boolean().default(false),
    /** Free-form tags; used for filtering / display. */
    tags: z.array(z.string()).default([]),
    /** Optional reading-time estimate in minutes. */
    readingTimeMin: z.number().optional(),
  }),
});

export const collections = { writing };

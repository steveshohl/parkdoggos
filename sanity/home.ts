// sanity/home.ts
import { defineType, defineField } from 'sanity'

/* ------------------------------------------------------------------ */
/* HOME                                                               */
/* ------------------------------------------------------------------ */
export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),

    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
    }),

    // NEW: multiple hero images
    defineField({
      name: 'heroImages',
      title: 'Hero Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description:
        'Add 3–4 images. The homepage will pick one at random on each refresh.',
      validation: (Rule) => Rule.min(1).max(8),
    }),

    // OPTIONAL: legacy single image fallback
    defineField({
      name: 'heroImage',
      title: 'Hero Image (Legacy Fallback)',
      type: 'image',
      options: { hotspot: true },
      description: 'Used only if Hero Images is empty.',
    }),

    defineField({
      name: 'heroCtaText',
      title: 'Hero CTA Text',
      type: 'string',
    }),

    defineField({
      name: 'heroCtaLink',
      title: 'Hero CTA Link',
      type: 'string',
    }),
  ],
})
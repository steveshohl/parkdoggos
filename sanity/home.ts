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

    /**
     * HERO IMAGES
     *
     * This intentionally accepts MULTIPLE item shapes to remain backward-compatible:
     * 1) Raw image objects (legacy + simple case)
     * 2) References to Media Items (or other image-holding docs)
     *
     * Frontend code already normalizes these safely.
     */
    defineField({
      name: 'heroImages',
      title: 'Hero Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
        {
          type: 'reference',
          to: [{ type: 'mediaItem' }], // adjust if your media doc uses a different name
        },
      ],
      description:
        'Add 3–4 images. Can be direct uploads or references. One is chosen at random per refresh.',
      validation: (Rule) => Rule.min(1).max(8),
    }),

    /**
     * LEGACY SINGLE IMAGE
     * Kept intentionally for safety / fallback.
     */
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
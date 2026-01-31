import { defineType, defineField, defineArrayMember } from 'sanity'

export const schemaTypes = [
  /* ------------------------------------------------------------------ */
  /* SITE SETTINGS                                                      */
  /* ------------------------------------------------------------------ */
  defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
      defineField({ name: 'title', title: 'Site Title', type: 'string' }),
      defineField({ name: 'brandStatement', title: 'Brand Statement', type: 'text' }),
      defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string' }),
      defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),

      defineField({ name: 'aboutTitle', title: 'About Title', type: 'string' }),
      defineField({
  name: 'aboutContent',
  title: 'About Content',
  type: 'array',
  of: [{ type: 'block' }],
}),
      defineField({
        name: 'aboutPortrait',
        title: 'About Portrait',
        type: 'image',
        options: { hotspot: true },
      }),
    ],
  }),

  /* ------------------------------------------------------------------ */
  /* HOME                                                               */
  /* ------------------------------------------------------------------ */
  defineType({
    name: 'home',
    title: 'Home',
    type: 'document',
    fields: [
      defineField({ name: 'title', title: 'Title', type: 'string' }),
      defineField({ name: 'subtitle', title: 'Subtitle', type: 'text' }),

      // ✅ NEW: allow multiple hero images
      defineField({
        name: 'heroImages',
        title: 'Hero Images',
        type: 'array',
        of: [
          defineArrayMember({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
              defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
            ],
          }),
        ],
      }),

      // ⬅ keep the original single image as a fallback (can remove later)
      defineField({
        name: 'heroImage',
        title: 'Hero Image (legacy)',
        type: 'image',
        options: { hotspot: true },
      }),
    ],
  }),

  /* ------------------------------------------------------------------ */
  /* GALLERIES                                                          */
  /* ------------------------------------------------------------------ */
  defineType({
    name: 'gallery',
    title: 'Galleries',
    type: 'document',
    fields: [
      defineField({ name: 'title', title: 'Title', type: 'string' }),

      defineField({
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: { source: 'title', maxLength: 96 },
      }),

      defineField({
        name: 'description',
        title: 'Description',
        type: 'text',
      }),

      defineField({
        name: 'type',
        title: 'Type',
        type: 'string',
        options: {
          list: [
            { title: 'Stills', value: 'stills' },
            { title: 'Video', value: 'video' },
          ],
          layout: 'radio',
        },
        initialValue: 'stills',
      }),

      defineField({
        name: 'coverImage',
        title: 'Cover Image',
        type: 'image',
        options: { hotspot: true },
      }),

      defineField({
        name: 'order',
        title: 'Order',
        type: 'number',
      }),

      defineField({
        name: 'published',
        title: 'Published',
        type: 'boolean',
        initialValue: true,
      }),
    ],
  }),

  /* ------------------------------------------------------------------ */
  /* MEDIA ITEMS                                                        */
  /* ------------------------------------------------------------------ */
  defineType({
    name: 'mediaItem',
    title: 'Media Items',
    type: 'document',
    fields: [
      defineField({ name: 'title', title: 'Title', type: 'string' }),
      defineField({ name: 'caption', title: 'Caption', type: 'string' }),

      defineField({
        name: 'mediaType',
        title: 'Media Type',
        type: 'string',
        options: {
          list: [
            { title: 'Image', value: 'image' },
            { title: 'Video', value: 'video' },
          ],
          layout: 'radio',
        },
        initialValue: 'image',
      }),

      defineField({
        name: 'image',
        title: 'Image',
        type: 'image',
        options: { hotspot: true },
        hidden: ({ document }) => document?.mediaType !== 'image',
      }),

      defineField({
        name: 'videoUrl',
        title: 'Video URL',
        type: 'url',
        hidden: ({ document }) => document?.mediaType !== 'video',
      }),

      defineField({
        name: 'videoPoster',
        title: 'Video Poster',
        type: 'image',
        options: { hotspot: true },
        hidden: ({ document }) => document?.mediaType !== 'video',
      }),

      defineField({
        name: 'gallery',
        title: 'Gallery',
        type: 'reference',
        to: [{ type: 'gallery' }],
      }),

      defineField({
        name: 'order',
        title: 'Order',
        type: 'number',
      }),
    ],
  }),
]
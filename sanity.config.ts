import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/deskStructure'

export default defineConfig({
  name: 'default',
  title: 'ParkDoggos',

  // Embedded Studio route
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',

  plugins: [
    structureTool({ structure }),

    // Enables /studio/vision (GROQ playground)
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
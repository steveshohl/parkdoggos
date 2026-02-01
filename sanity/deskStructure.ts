// sanity/deskStructure.ts
import type { StructureResolver } from 'sanity/structure'

/**
 * Helper for singleton documents (Home, Site Settings, etc.)
 */
const singleton = (
  S: any,
  title: string,
  schemaType: string,
  documentId: string
) =>
  S.listItem()
    .title(title)
    .schemaType(schemaType)
    .child(
      S.document()
        .schemaType(schemaType)
        .documentId(documentId)
        .title(title)
    )

/**
 * Reusable gallery list builder so we can create:
 * - Galleries (Stills)
 * - Galleries (Video)
 */
const gallerySection = (
  S: any,
  title: string,
  galleryType: 'stills' | 'video'
) =>
  S.listItem()
    .title(title)
    .schemaType('gallery')
    .child(
      S.documentList()
        .title(title)
        .filter('_type == "gallery" && type == $galleryType')
        .params({ galleryType })
        .defaultOrdering([{ field: 'order', direction: 'asc' }])
        .child((galleryId: string) =>
          S.list()
            .title('Gallery')
            .items([
              // ✅ This is where you will drag/reorder:
              // open the Gallery document editor, which contains the `items` array field.
              S.listItem()
                .title('Edit + Reorder')
                .child(
                  S.document()
                    .schemaType('gallery')
                    .documentId(galleryId)
                    .title('Edit + Reorder')
                ),

              S.divider(),

              // Useful for quick browsing / editing individual MediaItem docs
              S.listItem()
                .title('Media Items (for this gallery)')
                .child(
                  S.documentTypeList('mediaItem')
                    .title('Media Items (for this gallery)')
                    .filter('_type == "mediaItem" && gallery._ref == $galleryId')
                    .params({ galleryId })
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
            ])
        )
    )

/**
 * Main Studio structure
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ─── Singletons ─────────────────────────────
      singleton(S, 'Home', 'home', 'home'),
      singleton(S, 'Site Settings', 'siteSettings', 'siteSettings'),

      S.divider(),

      // ─── Galleries ──────────────────────────────
      gallerySection(S, 'Galleries (Stills)', 'stills'),
      gallerySection(S, 'Galleries (Video)', 'video'),

      S.divider(),

      // ─── Media Items (All) ──────────────────────
      S.listItem()
        .title('Media Items (All)')
        .schemaType('mediaItem')
        .child(
          S.documentTypeList('mediaItem')
            .title('Media Items (All)')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),
    ])
import { client } from './client'
import type { SiteSettings, Gallery, MediaItem } from '@/lib/types'

// While you're actively building/debugging, use a shorter revalidate.
// You can change this back to 60 later.
const revalidateTime = 5 // ISR: revalidate every 5 seconds during dev

// Helper: Sanity “published” filter (exclude drafts)
const PUBLISHED_FILTER = `!(_id in path("drafts.**"))`

/* -------------------------------------------------------------------------- */
/*                                    HOME                                    */
/* -------------------------------------------------------------------------- */

type SanityImage = {
  _type?: 'image'
  asset?: { _ref?: string; _id?: string }
  alt?: string
}

export async function getHome(): Promise<{
  title?: string
  subtitle?: string
  heroImages?: SanityImage[]
  heroImage?: SanityImage | null
  heroCtaText?: string
  heroCtaLink?: string
} | null> {
  try {
    const query = `*[_type == "home" && ${PUBLISHED_FILTER}]
      | order(_updatedAt desc)[0]{
        title,
        subtitle,

        // NEW: array field
        "heroImages": heroImages[]{
          _type,
          asset,
          alt
        },

        // Legacy fallback field
        "heroImage": heroImage{
          _type,
          asset,
          alt
        },

        heroCtaText,
        heroCtaLink
      }`

    const home = await client.fetch(query, {}, { next: { revalidate: revalidateTime } })
    if (!home) return null

    // 🚫 CRITICAL: remove any "images" that aren't real Sanity assets.
    // This prevents _upload objects (in-progress uploads) from crashing urlFor().
    const cleanHeroImages = Array.isArray(home.heroImages)
      ? home.heroImages.filter((img: any) => img?.asset?._ref || img?.asset?._id)
      : []

    const cleanHeroImage =
      home.heroImage && (home.heroImage.asset?._ref || home.heroImage.asset?._id)
        ? home.heroImage
        : null

    return {
      ...home,
      heroImages: cleanHeroImages,
      heroImage: cleanHeroImage,
    }
  } catch (error) {
    console.warn('Failed to fetch home:', error)
    return null
  }
}

/* -------------------------------------------------------------------------- */
/*                                  SETTINGS                                  */
/* -------------------------------------------------------------------------- */

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const query = `*[_type == "siteSettings" && ${PUBLISHED_FILTER}][0]{
      title,
      brandStatement,
      contactEmail,
      instagramUrl,
      seo,
      featuredGalleries[]->{
        _id,
        title,
        slug,
        coverImage,
        type,
        description
      },
      aboutTitle,
      aboutContent,
      aboutPortrait,
      contactIntro
    }`

    return await client.fetch(query, {}, { next: { revalidate: revalidateTime } })
  } catch (error) {
    console.warn('Failed to fetch site settings:', error)
    return null
  }
}

/* -------------------------------------------------------------------------- */
/*                                  GALLERIES                                 */
/* -------------------------------------------------------------------------- */

export async function getAllGalleries(filter?: 'stills' | 'video'): Promise<Gallery[]> {
  try {
    const typeFilter = filter ? ` && type == "${filter}"` : ''

    const query = `*[
      _type == "gallery" &&
      ${PUBLISHED_FILTER} &&
      defined(slug.current)
      ${typeFilter}
    ] | order(order asc, title asc){
      _id,
      title,
      slug,
      description,
      type,
      coverImage,
      order,
      featured
    }`

    const galleries = await client.fetch(query, {}, { next: { revalidate: revalidateTime } })
    return Array.isArray(galleries) ? galleries : []
  } catch (error) {
    console.warn('Failed to fetch galleries:', error)
    return []
  }
}

export async function getGalleryBySlug(slug: string): Promise<Gallery | null> {
  if (!slug) return null

  try {
    const query = `*[
      _type == "gallery" &&
      ${PUBLISHED_FILTER} &&
      slug.current == $slug
    ][0]{
      _id,
      title,
      slug,
      description,
      type,
      coverImage,
      order,
      featured,

      // ✅ PRIMARY: if Gallery.items[] exists (drag-and-drop), use it (order is preserved)
      // ✅ FALLBACK: otherwise use the old mediaItem query (so nothing breaks while migrating)
      "items": coalesce(
        items[]->{
          _id,
          title,
          caption,
          mediaType,
          image,
          videoUrl,
          videoPoster,
          order,
          featured
        },

        *[
          _type == "mediaItem" &&
          ${PUBLISHED_FILTER} &&
          gallery._ref == ^._id
        ] | order(order asc){
          _id,
          title,
          caption,
          mediaType,
          image,
          videoUrl,
          videoPoster,
          order,
          featured
        }
      )
    }`

    return await client.fetch(query, { slug }, { next: { revalidate: revalidateTime } })
  } catch (error) {
    console.warn('Failed to fetch gallery:', error)
    return null
  }
}

/* -------------------------------------------------------------------------- */
/*                                MEDIA ITEMS                                 */
/* -------------------------------------------------------------------------- */

export async function getMediaItemsByGallery(galleryId: string): Promise<MediaItem[]> {
  if (!galleryId) return []

  try {
    const query = `*[
      _type == "mediaItem" &&
      gallery._ref == $galleryId &&
      ${PUBLISHED_FILTER}
    ] | order(order asc){
      _id,
      title,
      caption,
      mediaType,
      image,
      videoUrl,
      videoPoster,
      order,
      featured
    }`

    const items = await client.fetch(query, { galleryId }, { next: { revalidate: revalidateTime } })
    return Array.isArray(items) ? items : []
  } catch (error) {
    console.warn('Failed to fetch media items:', error)
    return []
  }
}

/* -------------------------------------------------------------------------- */
/*                            ADJACENT NAVIGATION                              */
/* -------------------------------------------------------------------------- */

export async function getAdjacentGalleries(
  currentOrder: number,
  currentTitle: string
): Promise<{ prev: Gallery | null; next: Gallery | null }> {
  try {
    const prevQuery = `*[
      _type == "gallery" &&
      ${PUBLISHED_FILTER} &&
      defined(slug.current) &&
      (order < $order || (order == $order && title < $title))
    ] | order(order desc, title desc)[0]{
      _id,
      title,
      slug
    }`

    const nextQuery = `*[
      _type == "gallery" &&
      ${PUBLISHED_FILTER} &&
      defined(slug.current) &&
      (order > $order || (order == $order && title > $title))
    ] | order(order asc, title asc)[0]{
      _id,
      title,
      slug
    }`

    const [prev, next] = await Promise.all([
      client.fetch(
        prevQuery,
        { order: currentOrder, title: currentTitle },
        { next: { revalidate: revalidateTime } }
      ),
      client.fetch(
        nextQuery,
        { order: currentOrder, title: currentTitle },
        { next: { revalidate: revalidateTime } }
      ),
    ])

    return { prev: prev ?? null, next: next ?? null }
  } catch (error) {
    console.warn('Failed to fetch adjacent galleries:', error)
    return { prev: null, next: null }
  }
}

/* -------------------------------------------------------------------------- */
/*                              STATIC PARAMS                                 */
/* -------------------------------------------------------------------------- */

export async function getAllGallerySlugs(): Promise<string[]> {
  try {
    const query = `*[
      _type == "gallery" &&
      ${PUBLISHED_FILTER} &&
      defined(slug.current)
    ].slug.current`

    const slugs = await client.fetch(query, {}, { next: { revalidate: revalidateTime } })
    if (!Array.isArray(slugs)) return []

    return slugs.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
  } catch (error) {
    console.warn('Failed to fetch gallery slugs:', error)
    return []
  }
}